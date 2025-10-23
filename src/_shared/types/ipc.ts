export interface IpcChannels {
  ping: {
    send: void;
    response: void;
  };
}

export type IpcChannelNames = keyof IpcChannels;

export type IpcSendData<T extends IpcChannelNames> = IpcChannels[T]['send'];
export type IpcResponseData<T extends IpcChannelNames> = IpcChannels[T]['response'];
