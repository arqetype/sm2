export type TreeNode =
  | { type: 'file'; name: string }
  | { type: 'folder'; name: string; children: TreeNode[] };

export interface FilePreviewData {
  path: string;
  name: string;
  type: 'file';
}

export interface FilePreviewResult {
  content: string;
  mimeType: string;
  isText: boolean;
  encoding: 'utf-8' | 'base64';
  fileName: string;
  fileSize: number;
}
