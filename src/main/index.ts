import { app, BrowserWindow } from 'electron';
import { optimizer } from '@electron-toolkit/utils';
import { createMainWindow } from './windows/main';
import { registerIpcHandlers } from './ipc';
import { initDatabase } from './lib/database';

void app.whenReady().then(() => {
  initDatabase();
  createMainWindow();
  void registerIpcHandlers();
});

app.on('browser-window-created', (_, window) => {
  optimizer.watchWindowShortcuts(window);
});

app.on('activate', function () {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
