import { TreeNode } from '../file-tree';

export interface IpcChannels {
  'file-tree:open-directory': {
    input: 'initial' | 'action';
    output: { path: string } | { error: string };
  };
  'file-tree:scan-directory': {
    input: string | null;
    output: { tree: TreeNode[] } | { error: string };
  };
  'file-tree:read-file': {
    input: { path: string };
    output:
      | {
          content: string;
          mimeType: string;
          isText: boolean;
          encoding: 'utf-8' | 'base64';
          fileName: string;
          fileSize: number;
        }
      | { error: string };
  };
}
