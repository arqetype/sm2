import type { FilePreviewResult } from '../../../../_shared/types/file-tree';
import type { PreviewRenderer, FilePreviewType } from './types';
import { MarkdownPreview } from './markdown-preview';
import { CodePreview } from './code-preview';
import { PdfPreview } from './pdf-preview';
import { ImagePreview } from './image-preview';
import { FallbackPreview } from './fallback-preview';

const MARKDOWN_EXTENSIONS = ['.md', '.markdown', '.mdown', '.mkd', '.mdx'];
const CODE_EXTENSIONS = [
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.html',
  '.css',
  '.scss',
  '.sass',
  '.py',
  '.rb',
  '.sh',
  '.bash',
  '.zsh',
  '.php',
  '.java',
  '.c',
  '.cpp',
  '.cs',
  '.go',
  '.rs',
  '.sql',
  '.xml',
  '.yaml',
  '.yml',
  '.vue',
  '.svelte',
  '.toml',
  '.ini',
  '.conf',
  '.config',
  '.env',
  '.gitignore',
  '.dockerignore'
];
const IMAGE_MIME_PREFIXES = ['image/'];
const PDF_MIME_TYPE = 'application/pdf';

function hasExtension(fileName: string, extensions: string[]): boolean {
  const lowerFileName = fileName.toLowerCase();
  return extensions.some(ext => lowerFileName.endsWith(ext));
}

function isMarkdown(data: FilePreviewResult): boolean {
  if (data.mimeType === 'text/markdown') return true;
  return hasExtension(data.fileName, MARKDOWN_EXTENSIONS);
}

function isCode(data: FilePreviewResult): boolean {
  if (!data.isText) return false;
  if (hasExtension(data.fileName, CODE_EXTENSIONS)) return true;

  const codeMimeTypes = [
    'application/javascript',
    'application/typescript',
    'application/json',
    'application/xml',
    'text/javascript',
    'text/typescript',
    'text/html',
    'text/css',
    'application/x-sh',
    'application/x-python',
    'application/x-ruby',
    'application/x-perl',
    'application/x-php',
    'application/sql'
  ];

  return codeMimeTypes.includes(data.mimeType);
}

function isPdf(data: FilePreviewResult): boolean {
  return data.mimeType === PDF_MIME_TYPE;
}

function isImage(data: FilePreviewResult): boolean {
  return IMAGE_MIME_PREFIXES.some(prefix => data.mimeType.startsWith(prefix));
}

const renderers: PreviewRenderer[] = [
  {
    type: 'markdown',
    test: isMarkdown,
    component: MarkdownPreview,
    priority: 10
  },
  {
    type: 'pdf',
    test: isPdf,
    component: PdfPreview,
    priority: 9
  },
  {
    type: 'image',
    test: isImage,
    component: ImagePreview,
    priority: 8
  },
  {
    type: 'code',
    test: isCode,
    component: CodePreview,
    priority: 7
  },
  {
    type: 'fallback',
    test: () => true,
    component: FallbackPreview,
    priority: 0
  }
];

export function getPreviewRenderer(data: FilePreviewResult): PreviewRenderer {
  const sortedRenderers = [...renderers].sort((a, b) => b.priority - a.priority);

  for (const renderer of sortedRenderers) {
    if (renderer.test(data)) {
      return renderer;
    }
  }

  return renderers[renderers.length - 1];
}

export function getPreviewType(data: FilePreviewResult): FilePreviewType {
  return getPreviewRenderer(data).type;
}
