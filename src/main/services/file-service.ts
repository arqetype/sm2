import fs from 'node:fs/promises';
import { basename, extname, join, normalize, resolve, sep } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { TreeNode } from '../../_shared/types/file-tree';
import { Stats } from 'node:fs';

type VerifyDirectoryReturn = { success: true } | { success: false; message: string };

export async function verifyDirectory(path: string): Promise<VerifyDirectoryReturn> {
  const normalizedPath = normalize(path);

  try {
    const stats = await fs.stat(normalizedPath);
    if (!stats.isDirectory()) {
      return {
        success: false,
        message: 'This path is a file, not a folder'
      };
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occured while reading the files';
    return {
      success: false,
      message: `${message}`
    };
  }

  return { success: true };
}

const SCAN_OPTIONS: {
  maxDepth: number;
  maxFilesPerDirectory: number;
  maxConcurrentReads: number;
  allowedExtensions: string[] | 'all';
  ignoredPatterns: string[];
  followSymlinks: boolean;
  timeoutMs: number;
} = {
  maxDepth: 30,
  maxFilesPerDirectory: 10000,
  maxConcurrentReads: 50,
  allowedExtensions: 'all',
  ignoredPatterns: ['node_modules', '.git', '.svn', 'dist', 'build', '__pycache__', '.*'],
  followSymlinks: false,
  timeoutMs: 30000
};

class Semaphore {
  private queue: Array<() => void> = [];
  private count: number;

  constructor(private max: number) {
    this.count = this.max;
  }

  async acquire(): Promise<() => void> {
    if (this.count > 0) {
      this.count--;
      return () => this.release();
    }
    return new Promise<() => void>(resolve => {
      this.queue.push(() => {
        this.count--;
        resolve(() => this.release());
      });
    });
  }

  private release() {
    this.count++;
    const next = this.queue.shift();
    if (next) next();
  }
}

const readSemaphore = new Semaphore(SCAN_OPTIONS.maxConcurrentReads);

function hasAllowedExtension(fileName: string): boolean {
  const ext = extname(fileName).toLowerCase();
  if (SCAN_OPTIONS.allowedExtensions === 'all') return true;
  return SCAN_OPTIONS.allowedExtensions.map(e => e.toLowerCase()).includes(ext);
}

function isIgnored(relativePathFromRoot: string): boolean {
  const segments = relativePathFromRoot.split(sep).filter(Boolean);
  const set = new Set(SCAN_OPTIONS.ignoredPatterns);
  return segments.some(seg => set.has(seg));
}

async function resolveEntry(
  fullPath: string,
  dirent: import('fs').Dirent
): Promise<{ isDir: boolean; isFile: boolean; targetPath: string } | null> {
  if (dirent.isSymbolicLink()) {
    if (!SCAN_OPTIONS.followSymlinks) {
      return null;
    }

    let release: (() => void) | null = null;
    try {
      release = await readSemaphore.acquire();
      const stat = await fs.stat(fullPath);

      return {
        isDir: stat.isDirectory(),
        isFile: stat.isFile(),
        targetPath: fullPath
      };
    } catch {
      return null;
    } finally {
      if (release) release();
    }
  }
  return {
    isDir: dirent.isDirectory(),
    isFile: dirent.isFile(),
    targetPath: fullPath
  };
}

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const controller = new AbortController();
  const timeoutPromise = delay(ms, undefined, { signal: controller.signal }).then(() => {
    throw new Error(`Directory scan timed out after ${ms}ms`);
  });
  try {
    const result = await Promise.race([promise, timeoutPromise]);
    controller.abort();
    return result as T;
  } catch (e) {
    controller.abort();
    throw e;
  }
}

export async function scanDirectory(rootPath: string, currentDepth = 0): Promise<TreeNode> {
  const normalizedRoot = resolve(rootPath);

  let rootStat: Stats;
  {
    let release: (() => void) | null = null;
    try {
      release = await readSemaphore.acquire();
      rootStat = await fs.stat(normalizedRoot);
    } finally {
      if (release) release();
    }
  }
  if (!rootStat.isDirectory()) {
    return { type: 'file', name: basename(normalizedRoot) };
  }

  const startTime = Date.now();

  async function scanFolder(
    folderPath: string,
    relativeFromRoot: string,
    depth: number
  ): Promise<TreeNode> {
    if (depth > SCAN_OPTIONS.maxDepth) {
      return { type: 'folder', name: basename(folderPath), children: [] };
    }

    if (Date.now() - startTime > SCAN_OPTIONS.timeoutMs) {
      throw new Error(`Directory scan timed out after ${SCAN_OPTIONS.timeoutMs}ms`);
    }

    let dirents: import('fs').Dirent[];
    {
      let release: (() => void) | null = null;
      try {
        release = await readSemaphore.acquire();
        dirents = await fs.readdir(folderPath, { withFileTypes: true });
      } finally {
        if (release) release();
      }
    }

    if (dirents.length > SCAN_OPTIONS.maxFilesPerDirectory) {
      dirents = dirents.slice(0, SCAN_OPTIONS.maxFilesPerDirectory);
    }

    const children: TreeNode[] = [];

    const chunkSize = Math.max(1, Math.min(SCAN_OPTIONS.maxConcurrentReads, 32));
    for (let i = 0; i < dirents.length; i += chunkSize) {
      const chunk = dirents.slice(i, i + chunkSize);
      const tasks = chunk.map(async dirent => {
        const name = dirent.name;
        const fullPath = join(folderPath, name);
        const rel = join(relativeFromRoot, name);

        if (isIgnored(rel)) return;

        const resolved = await resolveEntry(fullPath, dirent);
        if (!resolved) return;

        if (resolved.isFile) {
          if (!hasAllowedExtension(name)) return;
          children.push({ type: 'file', name });
          return;
        }

        if (resolved.isDir) {
          const subtree = await scanFolder(resolved.targetPath, rel, depth + 1);
          children.push(subtree);
        }
      });

      await Promise.all(tasks);
    }

    children.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return { type: 'folder', name: basename(folderPath), children };
  }

  return await withTimeout(scanFolder(normalizedRoot, '', currentDepth), SCAN_OPTIONS.timeoutMs);
}
