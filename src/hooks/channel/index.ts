import { useDebouncedCallback } from 'use-debounce';
import {
  useMutation,
  useQuery,
  UseMutationOptions,
} from '@tanstack/react-query';

import ServiceChannel, { TChannelId, TChannelParams } from '@/api/channelApi';
import { queryClient } from '@/queries/core';

export const channelFactory = {
  all: () => ['channel'],
  detail: (conversationId: string) => ['channel', 'detail', conversationId],
};

interface UseGetChannelProps {
  conversationId: string;
  enabled?: boolean;
}

export function useGetChannel({
  conversationId,
  enabled = true,
}: UseGetChannelProps) {
  return useQuery({
    queryKey: channelFactory.detail(conversationId),
    queryFn: () => ServiceChannel.getChannel({ id: conversationId }),
    enabled: !!conversationId && enabled,
  });
}

export function useAddChannel() {
  const { mutate, mutateAsync, isPending } = useMutation({
    mutationFn: ServiceChannel.addChannel,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: channelFactory.detail(variables.id),
      });
    },
  });

  const doAddChannel = useDebouncedCallback(
    (
      params: TChannelParams,
      options?: UseMutationOptions<unknown, unknown, TChannelParams, unknown>,
    ) => mutate(params, options),
    300,
    { leading: true },
  );

  return { doAddChannel, mutateAsync, isPending };
}

export function useRenameChannel() {
  const { mutate, isPending } = useMutation({
    mutationFn: ServiceChannel.renameChannel,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: channelFactory.detail(variables.id),
      });
    },
  });

  const doRenameChannel = useDebouncedCallback(
    (
      params: TChannelParams,
      options?: UseMutationOptions<unknown, unknown, TChannelParams, unknown>,
    ) => mutate(params, options),
    300,
    { leading: true },
  );

  return { doRenameChannel, isPending };
}

export function useDeleteChannel() {
  const { mutate, isPending } = useMutation({
    mutationFn: ServiceChannel.deleteChannel,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: channelFactory.detail(variables.id),
      });
    },
  });

  const doDeleteChannel = useDebouncedCallback(
    (
      params: TChannelId,
      options?: UseMutationOptions<unknown, unknown, TChannelId, unknown>,
    ) => mutate(params, options),
    300,
    { leading: true },
  );

  return { doDeleteChannel, isPending };
}
