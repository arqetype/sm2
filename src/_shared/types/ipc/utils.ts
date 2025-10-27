import { IpcChannels } from '.';

export type IpcChannelNames = keyof IpcChannels;

export type IpcInput<T extends IpcChannelNames> = IpcChannels[T]['input'];

export type IpcOutput<T extends IpcChannelNames> = IpcChannels[T] extends { output: infer O }
  ? O
  : never;

export type InvokableChannels = {
  [K in IpcChannelNames]: IpcChannels[K] extends { output: unknown } ? K : never;
}[IpcChannelNames];

export type SendOnlyChannels = {
  [K in IpcChannelNames]: IpcChannels[K] extends { output: unknown } ? never : K;
}[IpcChannelNames];
