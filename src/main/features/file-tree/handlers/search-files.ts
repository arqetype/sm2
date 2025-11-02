import { handleIpc } from '@main/utils/ipc';
import { searchFiles } from '@main/features/file-tree/services';
import { getOpenedDirectoryOrNull } from '@main/features/ui-state/service/state-service';

handleIpc('file-tree:search-files', async (_, { query, maxResults }) => {
  try {
    const openedDirectory = await getOpenedDirectoryOrNull();

    if (!openedDirectory) {
      return { error: 'No directory is currently opened' };
    }

    const results = await searchFiles(openedDirectory, query, maxResults);

    return { results };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error during search';
    return { error: message };
  }
});
