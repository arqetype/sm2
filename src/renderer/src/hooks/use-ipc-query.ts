import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions
} from '@tanstack/react-query';

import type { InvokableChannels, IpcInput, IpcOutput } from '../../../_shared/types/ipc/utils';
import { useMemo, useState } from 'react';

export function useIpcQuery<T extends InvokableChannels>(
  channel: T,
  input?: IpcInput<T> extends void ? void : IpcInput<T>,
  options?: Omit<UseQueryOptions<IpcOutput<T>, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<IpcOutput<T>, Error>({
    queryKey: [channel, input],
    queryFn: async () => {
      const args = (
        input === undefined || input === null ? [] : [input]
      ) as IpcInput<T> extends void ? [] : [IpcInput<T>];
      return window.api.invoke(channel, ...args);
    },
    ...options
  });
}

export function useMutableIpcQuery<T extends InvokableChannels>(
  channel: T,
  initialInput?: IpcInput<T> extends void ? void : IpcInput<T>,
  options?: Omit<UseQueryOptions<IpcOutput<T>, Error>, 'queryKey' | 'queryFn'>
) {
  const [input, setInput] = useState<typeof initialInput>(initialInput);
  const key = useMemo(() => [channel, input] as const, [channel, input]);

  const query = useQuery<IpcOutput<T>, Error>({
    queryKey: key,
    queryFn: async () => {
      const args = (
        input === undefined || input === null ? [] : [input]
      ) as IpcInput<T> extends void ? [] : [IpcInput<T>];
      return window.api.invoke(channel, ...args);
    },
    ...options
  });

  const refetchWith = async (nextInput: typeof initialInput) => {
    setInput(nextInput);
    return query.refetch();
  };

  return { ...query, refetchWith };
}
export function useIpcMutation<T extends InvokableChannels>(
  channel: T,
  options?: Omit<UseMutationOptions<IpcOutput<T>, Error, IpcInput<T>>, 'mutationFn'>
) {
  return useMutation<IpcOutput<T>, Error, IpcInput<T>>({
    mutationFn: async input => {
      const args = (
        input === undefined || input === null ? [] : [input]
      ) as IpcInput<T> extends void ? [] : [IpcInput<T>];
      return window.api.invoke(channel, ...args);
    },
    ...options
  });
}

export function useInvalidateIpcQuery() {
  const queryClient = useQueryClient();

  return {
    invalidate: <T extends InvokableChannels>(channel: T, input?: IpcInput<T>) => {
      if (input !== undefined) {
        return queryClient.invalidateQueries({ queryKey: [channel, input] });
      }
      return queryClient.invalidateQueries({ queryKey: [channel] });
    },
    invalidateAll: () => queryClient.invalidateQueries()
  };
}
