export type AllowedExtensions = string[] | 'all';

export interface ScanOptions {
  maxDepth: number;
  maxFilesPerDirectory: number;
  maxConcurrentReads: number;
  allowedExtensions: AllowedExtensions;
  ignoredPatterns: readonly RegExp[];
  followSymlinks: boolean;
  timeoutMs: number;
}

export const DEFAULT_IGNORED_PATTERNS: readonly RegExp[] = [
  /node_modules/,
  /^\.git$/,
  /^\.svn$/,
  /dist/,
  /build/,
  /__pycache__/,
  /^\..*/
];

export const READ_CHUNK_CAP = 32;

export const DEFAULT_SCAN_OPTIONS: Readonly<ScanOptions> = {
  maxDepth: 30,
  maxFilesPerDirectory: 10000,
  maxConcurrentReads: 50,
  allowedExtensions: 'all',
  ignoredPatterns: DEFAULT_IGNORED_PATTERNS,
  followSymlinks: false,
  timeoutMs: 30_000
};
