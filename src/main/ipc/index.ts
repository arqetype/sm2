import { ipcMain } from 'electron';

export function registerIpcHandlers() {
  ipcMain.on('ping', () => console.log('pong'));
}
