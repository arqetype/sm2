export type TreeNode =
  | { type: 'file'; name: string }
  | { type: 'folder'; name: string; children: TreeNode[] };
