import type { IpcApi } from '../../preload/index';

declare global {
  interface Window {
    api: IpcApi;
  }
}

export {};
