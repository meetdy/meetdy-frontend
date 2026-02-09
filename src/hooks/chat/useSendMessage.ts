/**
 * useSendMessage – Mutation with optimistic update for sending text messages.
 *
 * ## How the Optimistic Update Works (step-by-step)
 *
 * 1. **onMutate** (before API call)
 *    - Cancel any in-flight refetches for the target message list (prevents
 *      them from overwriting our optimistic data).
 *    - Snapshot the current cache value (for rollback).
 *    - Create a temporary message object with `_tempId`, `status: 'sending'`,
 *      and the current user's info.
 *    - Append this temp message to the LAST page of the infinite query cache.
 *    - Also bump the conversation to the top of the conversation list.
 *    - Return `{ previousMessages, previousConversations, tempId }` as context.
 *
 * 2. **On success**
 *    - Replace the temp message with the real server response (which contains
 *      the permanent `_id`).
 *    - Remove the `_tempId` and set `status: undefined` (or just use the real
 *      object).
 *
 * 3. **On error**
 *    - Roll back the message cache to the snapshot.
 *    - Mark the temp message as `status: 'failed'` so the UI can show a retry
 *      button. We do NOT silently remove the message.
 *
 * 4. **onSettled** (always)
 *    - Invalidate the message query so a background refetch reconciles with
 *      the server.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import ServiceMessages, { TSendMessagePayload } from '@/api/messageApi';
import { chatKeys } from './chatKeys';
import {
  appendMessage,
  replaceMessage,
  patchMessage,
  type MessagesCache,
} from './messageCacheUtils';
import { bumpConversation } from './conversationCacheUtils';
import type {
  IGroupConversation,
  IIndividualConversation,
} from '@/models/conversation.model';

type Conversation = IIndividualConversation | IGroupConversation;

export interface SendMessageInput {
  content: string;
  conversationId: string;
  channelId?: string;
  type?: 'TEXT' | 'HTML';
  tags?: string[];
  replyMessageId?: string;
}

interface MutationContext {
  previousMessages: MessagesCache | undefined;
  previousConversations: Conversation[] | undefined;
  tempId: string;
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const user = useSelector((state: RootState) => state.global.user);

  return useMutation<any, Error, SendMessageInput, MutationContext>({
    mutationFn: async (input) => {
      const payload: TSendMessagePayload = {
        content: input.content,
        conversationId: input.conversationId,
        type: input.type || 'TEXT',
        tags: input.tags,
        replyMessageId: input.replyMessageId,
      };
      if (input.channelId) {
        payload.channelId = input.channelId;
      }
      return ServiceMessages.sendTextMessage(payload);
    },

    onMutate: async (input) => {
      const messagesKey = chatKeys.messages.infinite(
        input.conversationId,
        input.channelId,
      );
      const conversationsKey = chatKeys.conversations.list({});

      // 1. Cancel in-flight refetches
      await queryClient.cancelQueries({ queryKey: messagesKey });
      await queryClient.cancelQueries({ queryKey: conversationsKey });

      // 2. Snapshot current state
      const previousMessages =
        queryClient.getQueryData<MessagesCache>(messagesKey);
      const previousConversations =
        queryClient.getQueryData<Conversation[]>(conversationsKey);

      // 3. Create temp message
      const tempId = `temp-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 9)}`;
      const tempMessage = {
        _id: tempId,
        _tempId: tempId,
        content: input.content,
        type: input.type || 'TEXT',
        conversationId: input.conversationId,
        channelId: input.channelId,
        reacts: [],
        options: [],
        createdAt: new Date().toISOString(),
        user: user
          ? {
              _id: (user as any)._id,
              name: (user as any).name,
              avatar: (user as any).avatar,
              avatarColor: (user as any).avatarColor,
            }
          : { _id: '', name: '', avatar: '' },
        manipulatedUsers: [],
        userOptions: [],
        replyMessage: input.replyMessageId
          ? { _id: input.replyMessageId }
          : null,
        tagUsers: [],
        isDeleted: false,
        // Optimistic status flag
        _status: 'sending' as const,
      };

      // 4. Optimistically append to cache
      queryClient.setQueryData<MessagesCache>(messagesKey, (old) =>
        appendMessage(old, tempMessage),
      );

      // 5. Bump conversation to top
      queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
        bumpConversation(old, input.conversationId, tempMessage, {
          resetUnread: true,
        }),
      );

      return { previousMessages, previousConversations, tempId };
    },

    onSuccess: (serverMessage, input, context) => {
      if (!context) return;

      const messagesKey = chatKeys.messages.infinite(
        input.conversationId,
        input.channelId,
      );

      if (serverMessage && serverMessage._id) {
        // Replace temp message with the real one from the server
        queryClient.setQueryData<MessagesCache>(messagesKey, (old) =>
          replaceMessage(old, context.tempId, {
            ...serverMessage,
            _tempId: undefined,
            _status: undefined,
          }),
        );
      } else {
        // If server didn't return a full message, just clear the status
        queryClient.setQueryData<MessagesCache>(messagesKey, (old) =>
          patchMessage(old, context.tempId, { _status: undefined }),
        );
      }
    },

    onError: (_error, input, context) => {
      if (!context) return;

      const messagesKey = chatKeys.messages.infinite(
        input.conversationId,
        input.channelId,
      );
      const conversationsKey = chatKeys.conversations.list({});

      // Option A: Full rollback
      // queryClient.setQueryData(messagesKey, context.previousMessages);
      // queryClient.setQueryData(conversationsKey, context.previousConversations);

      // Option B (preferred): Keep the message visible but mark as failed
      queryClient.setQueryData<MessagesCache>(messagesKey, (old) =>
        patchMessage(old, context.tempId, { _status: 'failed' }),
      );

      // Restore conversations to previous state
      if (context.previousConversations) {
        queryClient.setQueryData(
          conversationsKey,
          context.previousConversations,
        );
      }
    },

    onSettled: (_data, _error, input) => {
      // Background refetch to reconcile with server
      queryClient.invalidateQueries({
        queryKey: chatKeys.messages.infinite(
          input.conversationId,
          input.channelId,
        ),
      });
    },
  });
}
