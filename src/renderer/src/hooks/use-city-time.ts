import { useIpcMutation } from './use-ipc-query';

export function useCityTime() {
  return useIpcMutation('getCityTime');
}
