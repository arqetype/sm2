/// <reference types="../_shared/types/window.d.ts" />

import { contextBridge, ipcRenderer } from 'electron';
import type {
  IpcChannelNames,
  IpcInput,
  IpcOutput,
  InvokableChannels,
  SendOnlyChannels
} from '../_shared/types/ipc/utils';

const api = {
  invoke: <T extends InvokableChannels>(
    channel: T,
    ...args: IpcInput<T> extends void ? [] : [IpcInput<T>]
  ): Promise<IpcOutput<T>> => {
    return ipcRenderer.invoke(channel, ...args);
  },

  send: <T extends SendOnlyChannels>(
    channel: T,
    ...args: IpcInput<T> extends void ? [] : [IpcInput<T>]
  ): void => {
    ipcRenderer.send(channel, ...args);
  },

  on: <T extends IpcChannelNames>(channel: T, callback: (data: IpcOutput<T>) => void) => {
    const subscription = (_event: Electron.IpcRendererEvent, data: IpcOutput<T>) => callback(data);
    ipcRenderer.on(channel, subscription);

    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  once: <T extends IpcChannelNames>(channel: T, callback: (data: IpcOutput<T>) => void) => {
    ipcRenderer.once(channel, (_event, data: IpcOutput<T>) => callback(data));
  }
};

export type IpcApi = typeof api;

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api);
  } catch (error) {
    console.error('[Preload] Failed to expose API:', error);
  }
} else {
  window.api = api;
}
