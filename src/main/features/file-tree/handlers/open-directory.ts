import { handleIpc } from '@main/utils/ipc';
import { dialog } from 'electron';
import { mainWindow } from '@main/window';

handleIpc('file-tree:open-directory', async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory'],
      title: 'Open your courses directory'
    });

    if (result.canceled) {
      return { error: 'Canceled' };
    }

    return { path: result.filePaths[0] };
  } catch (error) {
    if (error instanceof Error) {
      return { error: error.message };
    }

    return { error: 'Error while selecting the directory' };
  }
});
