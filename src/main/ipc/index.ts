import { ipcMain } from 'electron';
import type { IpcChannelNames } from '../../types';

export function registerIpcHandlers() {
  ipcMain.on('ping' satisfies IpcChannelNames, () => {
    console.log('pong');
  });
}
