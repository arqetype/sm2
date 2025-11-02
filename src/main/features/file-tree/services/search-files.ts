import fs from 'node:fs/promises';
import { join, relative } from 'node:path';
import type { FileSearchResult } from '@shared/types/ipc';
import { DEFAULT_IGNORED_PATTERNS } from './scan/constants';

interface SearchOptions {
  maxResults: number;
  maxDepth: number;
  ignoredPatterns: readonly RegExp[];
  timeoutMs: number;
}

const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  maxResults: 50,
  maxDepth: 30,
  ignoredPatterns: DEFAULT_IGNORED_PATTERNS,
  timeoutMs: 5000
};

export async function searchFiles(
  rootPath: string,
  query: string,
  maxResults?: number
): Promise<FileSearchResult[]> {
  const results: FileSearchResult[] = [];
  const normalizedQuery = query.toLowerCase().trim();

  if (!normalizedQuery) {
    return results;
  }

  const options: SearchOptions = {
    ...DEFAULT_SEARCH_OPTIONS,
    maxResults: maxResults ?? DEFAULT_SEARCH_OPTIONS.maxResults
  };

  const startTime = Date.now();

  async function search(currentPath: string, depth: number): Promise<void> {
    if (results.length >= options.maxResults) return;
    if (depth > options.maxDepth) return;
    if (Date.now() - startTime > options.timeoutMs) return;

    try {
      const entries = await fs.readdir(currentPath, { withFileTypes: true });

      const files = entries.filter(e => e.isFile());
      const dirs = entries.filter(e => e.isDirectory());

      for (const entry of files) {
        if (results.length >= options.maxResults) break;

        const name = entry.name;
        const nameLower = name.toLowerCase();
        const fullPath = join(currentPath, name);
        const rel = relative(rootPath, fullPath);

        if (isIgnored(rel, options.ignoredPatterns)) continue;

        if (nameLower.includes(normalizedQuery) || rel.toLowerCase().includes(normalizedQuery)) {
          results.push({
            path: fullPath,
            name: name,
            relativePath: rel,
            type: 'file'
          });
        }
      }

      for (const entry of dirs) {
        if (results.length >= options.maxResults) break;

        const name = entry.name;
        const fullPath = join(currentPath, name);
        const rel = relative(rootPath, fullPath);

        if (isIgnored(rel, options.ignoredPatterns)) continue;

        await search(fullPath, depth + 1);
      }
    } catch {
      return;
    }
  }

  try {
    await search(rootPath, 0);
  } catch (error) {
    console.error('Search error:', error);
  }

  results.sort((a, b) => {
    const aExact = a.name.toLowerCase() === normalizedQuery;
    const bExact = b.name.toLowerCase() === normalizedQuery;

    if (aExact && !bExact) return -1;
    if (!aExact && bExact) return 1;

    const aStarts = a.name.toLowerCase().startsWith(normalizedQuery);
    const bStarts = b.name.toLowerCase().startsWith(normalizedQuery);

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    if (a.type !== b.type) {
      return a.type === 'file' ? -1 : 1;
    }

    return a.name.localeCompare(b.name);
  });

  return results;
}

function isIgnored(relativePath: string, patterns: readonly RegExp[]): boolean {
  return patterns.some(pattern => pattern.test(relativePath));
}
