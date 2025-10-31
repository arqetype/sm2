import { handleIpc } from '@main/utils/ipc';
import { dialog } from 'electron';
import { mainWindow } from '@main/window';
import {
  getOpenedDirectoryOrNull,
  updateOpenedDirectory
} from '@main/features/ui-state/service/state-service';

handleIpc('file-tree:open-directory', async (_, input) => {
  const openedDir = await getOpenedDirectoryOrNull();

  if (input === 'initial') {
    if (openedDir !== null) return { path: openedDir };
  }

  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Open your courses directory'
    });

    if (result.canceled) {
      if (openedDir !== null) return { path: openedDir };
      return { error: 'Canceled' };
    }

    const directory = result.filePaths[0];

    await updateOpenedDirectory(directory);

    return { path: directory };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: 'Error while selecting the directory' };
  }
});
