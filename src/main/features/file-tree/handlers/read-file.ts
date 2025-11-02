import { getOpenedDirectoryOrNull } from '@main/features/ui-state/service/state-service';
import { handleIpc } from '@main/utils/ipc';
import { previewFile } from '@main/features/file-tree/services';
import { join } from 'node:path';

handleIpc('file-tree:read-file', async (_, params) => {
  const directoryPath = await getOpenedDirectoryOrNull();
  if (!directoryPath) return { error: 'No directory opened' };
  const path = join(directoryPath, params.path);
  return previewFile(path);
});
