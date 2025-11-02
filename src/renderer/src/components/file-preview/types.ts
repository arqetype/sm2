import type { FilePreviewResult } from '../../../../_shared/types/file-tree';
import type { ComponentType } from 'react';

export type PreviewMode = 'rendered' | 'raw';

export interface BasePreviewProps {
  data: FilePreviewResult;
}

export interface MarkdownPreviewProps extends BasePreviewProps {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
}

export interface CodePreviewProps extends BasePreviewProps {
  language?: string;
}

export interface PdfPreviewProps extends BasePreviewProps {
  data: FilePreviewResult;
}

export interface ImagePreviewProps extends BasePreviewProps {
  data: FilePreviewResult;
}

export interface FallbackPreviewProps extends BasePreviewProps {
  data: FilePreviewResult;
}

export type FilePreviewType = 'markdown' | 'code' | 'pdf' | 'image' | 'text' | 'fallback';

export interface PreviewRenderer {
  type: FilePreviewType;
  test: (data: FilePreviewResult) => boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  priority: number;
}
