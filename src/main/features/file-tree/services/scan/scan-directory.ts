import fs from 'node:fs/promises';
import { basename, join, resolve } from 'node:path';

import type { TreeNode } from '@shared/types/file-tree';

import { Semaphore } from './semaphore';
import { DEFAULT_SCAN_OPTIONS as SCAN_OPTIONS } from './constants';
import {
  hasAllowedExtension,
  isIgnored,
  resolveEntry,
  withTimeout,
  computeChunkSize,
  limitEntries,
  readDirWithPermit
} from './utils';

export async function scanDirectory(rootPath: string, currentDepth = 0): Promise<TreeNode> {
  const normalizedRoot = resolve(rootPath);

  const semaphore = new Semaphore(SCAN_OPTIONS.maxConcurrentReads);
  const withPermit = <T>(task: () => Promise<T>): Promise<T> => semaphore.run(task);

  const rootStat = await withPermit(() => fs.stat(normalizedRoot));
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

    let dirents = await readDirWithPermit(folderPath, withPermit);
    dirents = limitEntries(dirents, SCAN_OPTIONS.maxFilesPerDirectory);

    const children: TreeNode[] = [];
    const chunkSize = computeChunkSize(SCAN_OPTIONS.maxConcurrentReads);

    for (let i = 0; i < dirents.length; i += chunkSize) {
      const chunk = dirents.slice(i, i + chunkSize);

      await Promise.all(
        chunk.map(async dirent => {
          const name = dirent.name;
          const fullPath = join(folderPath, name);
          const rel = join(relativeFromRoot, name);

          if (isIgnored(rel, SCAN_OPTIONS.ignoredPatterns)) return;

          const resolved = await resolveEntry(
            fullPath,
            dirent,
            SCAN_OPTIONS.followSymlinks,
            withPermit
          );
          if (!resolved) return;

          if (resolved.isFile) {
            if (!hasAllowedExtension(name, SCAN_OPTIONS.allowedExtensions)) return;
            children.push({ type: 'file', name });
            return;
          }

          if (resolved.isDir) {
            const subtree = await scanFolder(resolved.targetPath, rel, depth + 1);
            children.push(subtree);
          }
        })
      );
    }

    children.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return { type: 'folder', name: basename(folderPath), children };
  }

  return await withTimeout(scanFolder(normalizedRoot, '', currentDepth), SCAN_OPTIONS.timeoutMs);
}
