import { TreeNode } from '../file-tree';

export interface IpcChannels {
  'file-tree:open-directory': {
    input: void;
    output: { path: string } | { error: string };
  };
  'file-tree:scan-directory': {
    input: string | null;
    output: { tree: TreeNode[] } | { error: string };
  };
}
