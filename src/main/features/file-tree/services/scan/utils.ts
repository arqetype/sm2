import fs from 'node:fs/promises';
import type { Dirent } from 'node:fs';
import { extname, sep } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

import { READ_CHUNK_CAP } from './constants';

export type WithPermit = <T>(task: () => Promise<T>) => Promise<T>;

export interface ResolvedEntry {
  isDir: boolean;
  isFile: boolean;
  targetPath: string;
}

export function hasAllowedExtension(
  fileName: string,
  allowedExtensions: string[] | 'all'
): boolean {
  if (allowedExtensions === 'all') return true;
  const ext = extname(fileName).toLowerCase();
  return allowedExtensions.map(e => e.toLowerCase()).includes(ext);
}

export function isIgnored(
  relativePathFromRoot: string,
  ignoredPatterns: readonly RegExp[]
): boolean {
  const segments = relativePathFromRoot.split(sep).filter(Boolean);
  return segments.some(seg => ignoredPatterns.some(pattern => pattern.test(seg)));
}

export async function resolveEntry(
  fullPath: string,
  dirent: Dirent,
  followSymlinks: boolean,
  withPermit?: WithPermit
): Promise<ResolvedEntry | null> {
  const run: WithPermit = withPermit ?? (async <T>(task: () => Promise<T>) => await task());

  if (dirent.isSymbolicLink()) {
    if (!followSymlinks) {
      return null;
    }
    try {
      const stat = await run(() => fs.stat(fullPath));
      return {
        isDir: stat.isDirectory(),
        isFile: stat.isFile(),
        targetPath: fullPath
      };
    } catch {
      return null;
    }
  }

  return {
    isDir: dirent.isDirectory(),
    isFile: dirent.isFile(),
    targetPath: fullPath
  };
}

export async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
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

export function computeChunkSize(maxConcurrentReads: number, cap: number = READ_CHUNK_CAP): number {
  return Math.max(1, Math.min(maxConcurrentReads, cap));
}

export function limitEntries<T>(entries: T[], max: number): T[] {
  if (!Number.isFinite(max) || max <= 0) return [];
  if (entries.length <= max) return entries;
  return entries.slice(0, max);
}

export async function readDirWithPermit(
  folderPath: string,
  withPermit?: WithPermit
): Promise<Dirent[]> {
  const run: WithPermit = withPermit ?? (async <T>(task: () => Promise<T>) => await task());
  return run(() => fs.readdir(folderPath, { withFileTypes: true }));
}
