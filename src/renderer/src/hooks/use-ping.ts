import { useIpcMutation } from './use-ipc-query';

export function usePing() {
  return useIpcMutation('ping');
}
