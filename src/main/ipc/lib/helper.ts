import { ipcMain, type IpcMainEvent, type IpcMainInvokeEvent } from 'electron';
import type {
  IpcInput,
  IpcOutput,
  InvokableChannels,
  SendOnlyChannels
} from '../../../_shared/types/ipc/utils';

export function handleIpc<T extends InvokableChannels>(
  channel: T,
  handler: (
    event: IpcMainInvokeEvent,
    ...args: IpcInput<T> extends void ? [] : [IpcInput<T>]
  ) => Promise<IpcOutput<T>> | IpcOutput<T>
): void {
  ipcMain.handle(channel, async (event, ...args) => {
    return handler(event, ...(args as IpcInput<T> extends void ? [] : [IpcInput<T>]));
  });
}

export function onIpc<T extends SendOnlyChannels>(
  channel: T,
  handler: (event: IpcMainEvent, ...args: IpcInput<T> extends void ? [] : [IpcInput<T>]) => void
): void {
  ipcMain.on(channel, (event, ...args) => {
    handler(event, ...(args as IpcInput<T> extends void ? [] : [IpcInput<T>]));
  });
}

export function removeHandler(channel: InvokableChannels): void {
  ipcMain.removeHandler(channel);
}

export function removeAllListeners(channel: SendOnlyChannels): void {
  ipcMain.removeAllListeners(channel);
}
