import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import ServicePinMessage, { IPinMessage } from '@/api/pinMessageApi';
import { createQueryKey } from '@/queries/core';
import { toast } from 'sonner';

export interface UsePinnedMessagesOptions {
  conversationId: string;
  enabled?: boolean;
}

export interface UsePinnedMessagesReturn {
  pinnedMessages: IPinMessage[];
  isLoading: boolean;
  error: Error | null;
  pinMessage: (messageId: string) => Promise<void>;
  unpinMessage: (messageId: string) => Promise<void>;
  isPinned: (messageId: string) => boolean;
  currentPinnedMessage: IPinMessage | null;
  navigatePinned: (direction: 'next' | 'prev') => void;
  currentPinnedIndex: number;
}

export function usePinnedMessages({
  conversationId,
  enabled = true,
}: UsePinnedMessagesOptions): UsePinnedMessagesReturn {
  const queryClient = useQueryClient();
  const queryKey = createQueryKey('pinnedMessages', { conversationId });

  const { data, isLoading, error } = useQuery({
    queryKey,
    queryFn: () => ServicePinMessage.getPinMessages(conversationId),
    enabled: enabled && !!conversationId,
    staleTime: 1000 * 60 * 5,
  });

  const pinnedMessages = data || [];
  const currentPinnedIndex = 0;

  const pinMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return ServicePinMessage.pinMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Message pinned');
    },
    onError: () => {
      toast.error('Failed to pin message');
    },
  });

  const unpinMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return ServicePinMessage.removePinMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Message unpinned');
    },
    onError: () => {
      toast.error('Failed to unpin message');
    },
  });

  const pinMessage = useCallback(
    async (messageId: string) => {
      const isAlreadyPinned = pinnedMessages.some((p) => p.id === messageId);
      if (isAlreadyPinned) {
        toast.info('Message is already pinned');
        return;
      }
      await pinMutation.mutateAsync(messageId);
    },
    [pinnedMessages, pinMutation],
  );

  const unpinMessage = useCallback(
    async (messageId: string) => {
      await unpinMutation.mutateAsync(messageId);
    },
    [unpinMutation],
  );

  const isPinned = useCallback(
    (messageId: string) => {
      return pinnedMessages.some((p) => p.id === messageId);
    },
    [pinnedMessages],
  );

  const currentPinnedMessage =
    pinnedMessages.length > 0 ? pinnedMessages[currentPinnedIndex] : null;

  const navigatePinned = useCallback((_direction: 'next' | 'prev') => {
    toast.info('Navigate pinned messages');
  }, []);

  return {
    pinnedMessages,
    isLoading,
    error: error as Error | null,
    pinMessage,
    unpinMessage,
    isPinned,
    currentPinnedMessage,
    navigatePinned,
    currentPinnedIndex,
  };
}

export default usePinnedMessages;
