export type TreeNode =
  | { type: 'file'; name: string }
  | { type: 'folder'; name: string; children: TreeNode[] };

export interface FilePreviewData {
  path: string;
  name: string;
  type: 'file';
}
