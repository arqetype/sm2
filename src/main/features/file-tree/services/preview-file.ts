import fs from 'node:fs/promises';
import { basename } from 'node:path';
import { lookup as lookupMime } from 'mime-types';

export interface FilePreviewResult {
  content: string;
  mimeType: string;
  isText: boolean;
  encoding: 'utf-8' | 'base64';
  fileName: string;
  fileSize: number;
}

export interface FileReadOptions {
  maxSize?: number;
  sampleSize?: number;
}

export const DEFAULT_MAX_SIZE = 50 * 1024 * 1024;
export const DEFAULT_SAMPLE_SIZE = 512;

export const TEXT_MIME_PREFIXES: readonly string[] = [
  'text/',
  'application/json',
  'application/xml',
  'application/javascript',
  'application/typescript',
  'application/x-sh',
  'application/x-yaml',
  'application/sql',
  'application/x-httpd-php',
  'application/x-python',
  'application/x-ruby',
  'application/x-perl',
  'message/'
] as const;

export const TEXT_MIME_SUFFIXES: readonly string[] = ['+xml', '+json', '+yaml'] as const;

export function isTextMimeType(mimeType: string | false): boolean {
  if (!mimeType || typeof mimeType !== 'string') return false;
  const lower = mimeType.toLowerCase();
  if (TEXT_MIME_PREFIXES.some(prefix => lower.startsWith(prefix))) return true;
  return TEXT_MIME_SUFFIXES.some(suffix => lower.endsWith(suffix));
}

export function isLikelyText(buffer: Buffer, sampleSize: number = DEFAULT_SAMPLE_SIZE): boolean {
  const sample = buffer.subarray(0, Math.min(sampleSize, buffer.length));
  if (sample.length === 0) return true;
  if (sample.includes(0)) return false;

  let printableCount = 0;
  let controlCount = 0;

  for (const byte of sample) {
    if (byte >= 32 && byte <= 126) {
      printableCount++;
      continue;
    }
    if (byte === 9 || byte === 10 || byte === 13) {
      printableCount++;
      continue;
    }
    if ((byte & 0xc0) === 0x80) {
      printableCount++;
      continue;
    }
    if ((byte & 0xe0) === 0xc0 || (byte & 0xf0) === 0xe0 || (byte & 0xf8) === 0xf0) {
      printableCount++;
      continue;
    }
    if (byte < 32) {
      controlCount++;
    }
  }

  if (controlCount / sample.length > 0.05) return false;
  return printableCount / sample.length > 0.85;
}

export function shouldTreatAsText(
  buffer: Buffer,
  mimeType: string | false,
  options: FileReadOptions = {}
): boolean {
  const { sampleSize = DEFAULT_SAMPLE_SIZE } = options;
  if (isTextMimeType(mimeType)) return true;
  return isLikelyText(buffer, sampleSize);
}

export async function previewFile(
  filePath: string,
  options: FileReadOptions = {}
): Promise<FilePreviewResult> {
  const maxSize = options.maxSize ?? DEFAULT_MAX_SIZE;
  const sampleSize = options.sampleSize ?? DEFAULT_SAMPLE_SIZE;

  const stats = await fs.stat(filePath);
  if (stats.size > maxSize) {
    throw new Error(`File too large to preview (${stats.size} bytes, max: ${maxSize} bytes)`);
  }

  const buffer = await fs.readFile(filePath);
  const mimeType = lookupMime(filePath) || 'application/octet-stream';
  const treatAsText = shouldTreatAsText(buffer, mimeType, { sampleSize });

  let content: string;
  let encoding: 'utf-8' | 'base64';

  if (treatAsText) {
    const utf8 = buffer.toString('utf-8');
    if (utf8.includes('\uFFFD')) {
      content = buffer.toString('base64');
      encoding = 'base64';
    } else {
      content = utf8;
      encoding = 'utf-8';
    }
  } else {
    content = buffer.toString('base64');
    encoding = 'base64';
  }

  return {
    content,
    mimeType: typeof mimeType === 'string' ? mimeType : 'application/octet-stream',
    isText: encoding === 'utf-8',
    encoding,
    fileName: basename(filePath),
    fileSize: stats.size
  };
}
