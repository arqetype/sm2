import { ipcMain } from 'electron';
import type { IpcChannelNames } from '../../_shared/types/ipc';

export function registerIpcHandlers() {
  ipcMain.on('ping' satisfies IpcChannelNames, () => {
    console.log('pong');
  });
}
