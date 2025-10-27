import { scanDirectory } from '../../../services/file-service';
import { handleIpc } from '../../lib/helper';

handleIpc('file-tree:scan-directory', async (_, path) => {
  if (path === null) return { error: 'No path selected ' };

  try {
    const directory = await scanDirectory(path);

    if (directory.type === 'file') throw new Error('A file was read');
    return { tree: directory.children };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error happened';
    return { error: message };
  }
});
