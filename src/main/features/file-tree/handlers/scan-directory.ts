import { scanDirectory } from '@main/features/file-tree/services';
import type { TreeNode } from '@shared/types/file-tree';
import { handleIpc } from '@main/utils/ipc';

handleIpc('file-tree:scan-directory', async (_, path) => {
  if (path === null) return { error: 'No path selected ' };

  try {
    const directory: TreeNode = await scanDirectory(path);

    if (directory.type === 'file') throw new Error('A file was read');
    return { tree: directory.children };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error happened';
    return { error: message };
  }
});
