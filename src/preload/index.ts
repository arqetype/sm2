/// <reference types="../_shared/types/window.d.ts" />

import { contextBridge, ipcRenderer } from 'electron';

const api = {
  ping: () => ipcRenderer.send('ping')
};

try {
  contextBridge.exposeInMainWorld('api', api);
} catch (error) {
  console.error('[Preload] Failed to expose API:', error);
  window.api = api;
}
