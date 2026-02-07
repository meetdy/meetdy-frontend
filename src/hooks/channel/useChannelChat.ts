import { useCallback, useState, useEffect, useRef } from 'react';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import ServiceChannel from '@/api/channelApi';
import ServiceMessages from '@/api/messageApi';
import { ILastGroupMessage } from '@/models/message.model';
import { createQueryKey } from '@/queries/core';
import { useAppSelector } from '@/redux/store';
import { toast } from 'sonner';

const PAGE_SIZE = 20;

export interface ChannelMessage extends ILastGroupMessage {
  channelId?: string;
  isPending?: boolean;
  uploadProgress?: number;
  uploadError?: boolean;
}

export interface UseChannelChatOptions {
  channelId: string;
  conversationId: string;
  enabled?: boolean;
}

export interface UseChannelChatReturn {
  messages: ChannelMessage[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasNextPage: boolean;
  error: Error | null;
  loadMore: () => void;
  sendMessage: (content: string, replyMessageId?: string) => Promise<void>;
  sendFileMessage: (file: File) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  retryUpload: (messageId: string, file?: File) => Promise<void>;
  typingUsers: string[];
  setTyping: (isTyping: boolean) => void;
}

export function useChannelChat({
  channelId,
  conversationId,
  enabled = true,
}: UseChannelChatOptions): UseChannelChatReturn {
  const queryClient = useQueryClient();
  const { user } = useAppSelector((state) => state.global);
  const { usersTyping } = useAppSelector((state) => state.chat);

  const [pendingMessages, setPendingMessages] = useState<ChannelMessage[]>([]);
  const pendingFilesRef = useRef<Map<string, File>>(new Map());
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const typingUsers = usersTyping?.map((u) => u.name || 'Someone') || [];

  const queryKey = createQueryKey('channelMessages', { channelId });

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey,
    queryFn: async ({ pageParam = 1 }) => {
      const response = await ServiceChannel.getMessageInChannel(
        channelId,
        pageParam,
        PAGE_SIZE,
      );
      return {
        messages: response.data || [],
        total: response.total || 0,
        page: pageParam,
      };
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalFetched = allPages.reduce(
        (sum, page) => sum + page.messages.length,
        0,
      );
      if (totalFetched < lastPage.total) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    enabled: enabled && !!channelId,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
  });

  const sendTextMutation = useMutation({
    mutationFn: async ({
      content,
      replyMessageId,
    }: {
      content: string;
      replyMessageId?: string;
    }) => {
      return ServiceMessages.sendTextMessage({
        content,
        conversationId,
        replyMessageId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });

  const sendFileMutation = useMutation({
    mutationFn: async ({ file, tempId }: { file: File; tempId: string }) => {
      return ServiceMessages.sendFileThroughMessage(
        file,
        {
          type: file.type.startsWith('image/') ? 'IMAGE' : 'FILE',
          conversationId,
          channelId,
        },
        (progress) => {
          setPendingMessages((prev) =>
            prev.map((msg) =>
              msg._id === tempId ? { ...msg, uploadProgress: progress } : msg,
            ),
          );
        },
      );
    },
    onSuccess: (_, { tempId }) => {
      setPendingMessages((prev) => prev.filter((msg) => msg._id !== tempId));
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (_, { tempId }) => {
      setPendingMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId
            ? { ...msg, uploadError: true, isPending: false }
            : msg,
        ),
      );
      toast.error('Failed to upload file');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (messageId: string) => {
      return ServiceMessages.redoMessage(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast.success('Message deleted');
    },
    onError: () => {
      toast.error('Failed to delete message');
    },
  });

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const sendMessage = useCallback(
    async (content: string, replyMessageId?: string) => {
      if (!content.trim()) return;
      await sendTextMutation.mutateAsync({ content, replyMessageId });
    },
    [sendTextMutation],
  );

  const sendFileMessage = useCallback(
    async (file: File) => {
      const tempId = `temp-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      const tempMessage: ChannelMessage = {
        _id: tempId,
        content: file.name,
        type: file.type.startsWith('image/') ? 'IMAGE' : 'FILE',
        conversationId,
        channelId,
        reacts: [],
        options: [],
        createdAt: new Date().toISOString(),
        user: {
          _id: user?._id || '',
          name: user?.name || '',
          avatar: user?.avatar || '',
          avatarColor: user?.avatarColor || '',
        },
        manipulatedUsers: [],
        userOptions: [],
        replyMessage: null,
        tagUsers: [],
        isPending: true,
        uploadProgress: 0,
      };

      pendingFilesRef.current.set(tempId, file);
      setPendingMessages((prev) => [...prev, tempMessage]);
      await sendFileMutation.mutateAsync({ file, tempId });
    },
    [conversationId, channelId, user, sendFileMutation],
  );

  const deleteMessage = useCallback(
    async (messageId: string) => {
      await deleteMutation.mutateAsync(messageId);
    },
    [deleteMutation],
  );

  const retryUpload = useCallback(
    async (messageId: string, _file?: File) => {
      const storedFile = pendingFilesRef.current.get(messageId);
      if (!storedFile) {
        toast.error('File not found for retry');
        return;
      }

      setPendingMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId
            ? { ...msg, isPending: true, uploadError: false, uploadProgress: 0 }
            : msg,
        ),
      );
      await sendFileMutation.mutateAsync({
        file: storedFile,
        tempId: messageId,
      });
    },
    [sendFileMutation],
  );

  const setTyping = useCallback((isTyping: boolean) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (isTyping) {
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(false);
      }, 3000);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return {
    messages: [
      ...pendingMessages,
      ...(data
        ? data.pages.flatMap((page) => page.messages as any[])
        : []),
    ],
    isLoading,
    isLoadingMore: isFetchingNextPage,
    hasNextPage: !!hasNextPage,
    error: error as Error | null,
    loadMore,
    sendMessage,
    sendFileMessage,
    deleteMessage,
    retryUpload,
    typingUsers,
    setTyping,
  };
}

export default useChannelChat;
