import { ipcMain } from 'electron';
import type { IpcChannelNames } from '../../types';
import { createLogger } from '../../lib/logger';

const logger = createLogger('IPC');

export function registerIpcHandlers() {
  ipcMain.on('ping' satisfies IpcChannelNames, () => {
    logger.info('Received ping');
    console.log('pong');
  });
}
