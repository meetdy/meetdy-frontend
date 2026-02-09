/**
 * useChatSocket – Bridges WebSocket events to React Query cache.
 *
 * This hook registers all chat-related socket listeners and updates
 * the React Query cache directly, eliminating the need for Redux
 * dispatches for server-state changes.
 *
 * UI-only state (currentConversation, currentChannel, typing indicators)
 * still lives in a slim Redux slice.
 *
 * ## Usage
 *   Call once at the Chat layout level:
 *   ```tsx
 *   useChatSocket({ socket });
 *   ```
 */

import { useEffect, useRef, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import type { Socket } from 'socket.io-client';
import type { RootState } from '@/redux/store';
import type {
  IGroupConversation,
  IIndividualConversation,
} from '@/models/conversation.model';

import { chatKeys } from './chatKeys';
import {
  appendMessage,
  markMessageDeleted,
  updateReaction,
  hasMessageInCache,
  type MessagesCache,
} from './messageCacheUtils';
import {
  bumpConversation,
  removeConversation as removeConvFromList,
  patchConversation,
} from './conversationCacheUtils';

import conversationApi from '@/api/conversationApi';
import { toast } from 'sonner';

// Import only the UI-state actions we still need from Redux
import {
  setCurrentConversation,
  setCurrentChannel,
} from '@/redux/slice/chatUiSlice';

type Conversation = IIndividualConversation | IGroupConversation;

interface UseChatSocketOptions {
  socket: Socket;
}

export function useChatSocket({ socket }: UseChatSocketOptions) {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.global);

  // We use refs so socket callbacks always see the latest values
  // without re-registering listeners on every render.
  const currentConversation = useSelector(
    (state: RootState) => state.chatUi.currentConversation,
  );
  const currentChannel = useSelector(
    (state: RootState) => state.chatUi.currentChannel,
  );

  const currentConversationRef = useRef(currentConversation);
  const currentChannelRef = useRef(currentChannel);
  const conversationsRef = useRef<Conversation[]>([]);
  const userRef = useRef(user);

  useEffect(() => {
    currentConversationRef.current = currentConversation;
  }, [currentConversation]);

  useEffect(() => {
    currentChannelRef.current = currentChannel;
  }, [currentChannel]);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  // Keep conversationsRef in sync with the query cache
  useEffect(() => {
    const unsub = queryClient.getQueryCache().subscribe((event) => {
      if (
        event?.type === 'updated' &&
        event.query.queryKey[1] === 'list' &&
        event.query.queryKey[0] === 'conversations'
      ) {
        const data = event.query.state.data as Conversation[] | undefined;
        if (data) conversationsRef.current = data;
      }
    });
    // Initial sync
    const initial = queryClient.getQueryData<Conversation[]>(
      chatKeys.conversations.list({}),
    );
    if (initial) conversationsRef.current = initial;

    return unsub;
  }, [queryClient]);

  // ── Helper to get the current messages cache key ──────────────
  const getMessagesKey = useCallback(
    (convId?: string, chanId?: string) =>
      chatKeys.messages.infinite(
        convId ?? currentConversationRef.current,
        chanId ?? (currentChannelRef.current || undefined),
      ),
    [],
  );

  const conversationsKey = chatKeys.conversations.list({});

  useEffect(() => {
    if (!socket) return;

    // ─── New message in conversation ──────────────────────────
    const handleNewMessage = (message: any) => {
      const { conversationId } = message;
      const myId = (userRef.current as any)?._id;
      const isViewingConversation =
        currentConversationRef.current === conversationId &&
        !currentChannelRef.current;

      // Only add to messages cache if the user is currently viewing this conversation
      if (isViewingConversation) {
        const key = chatKeys.messages.infinite(conversationId, undefined);
        queryClient.setQueryData<MessagesCache>(key, (old) => {
          // Dedup: don't add if already present (e.g. from optimistic insert)
          if (hasMessageInCache(old, message._id)) return old;
          return appendMessage(old, message);
        });
      }

      // Bump conversation to top
      queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
        bumpConversation(old, conversationId, message, {
          resetUnread: isViewingConversation,
        }),
      );
    };

    // ─── New message in channel ───────────────────────────────
    const handleNewChannelMessage = ({
      conversationId,
      channelId,
      message,
    }: any) => {
      const isViewing =
        currentConversationRef.current === conversationId &&
        currentChannelRef.current === channelId;

      if (isViewing) {
        const key = chatKeys.messages.infinite(conversationId, channelId);
        queryClient.setQueryData<MessagesCache>(key, (old) => {
          if (hasMessageInCache(old, message._id)) return old;
          return appendMessage(old, message);
        });
      }

      // Invalidate channels list to update unread badge
      queryClient.invalidateQueries({
        queryKey: chatKeys.channels.list(conversationId),
      });
    };

    // ─── Delete / recall message ──────────────────────────────
    const handleDeleteMessage = ({ conversationId, channelId, id }: any) => {
      const isViewing =
        currentConversationRef.current === conversationId &&
        (channelId
          ? currentChannelRef.current === channelId
          : !currentChannelRef.current);

      if (isViewing) {
        const key = chatKeys.messages.infinite(
          conversationId,
          channelId || undefined,
        );
        queryClient.setQueryData<MessagesCache>(key, (old) =>
          markMessageDeleted(old, id),
        );
      }

      // Also update lastMessage.isDeleted on the conversation
      queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
        patchConversation(old, conversationId, {} as any),
      );
    };

    // ─── Reaction ─────────────────────────────────────────────
    const handleReaction = ({
      conversationId,
      channelId,
      messageId,
      user: reactionUser,
      type,
    }: any) => {
      const isViewing =
        currentConversationRef.current === conversationId &&
        (channelId
          ? currentChannelRef.current === channelId
          : !currentChannelRef.current);

      if (isViewing) {
        const key = chatKeys.messages.infinite(
          conversationId,
          channelId || undefined,
        );
        queryClient.setQueryData<MessagesCache>(key, (old) =>
          updateReaction(old, messageId, reactionUser, type),
        );
      }
    };

    // ─── Conversation deleted ─────────────────────────────────
    const handleDeleteConversation = (conversationId: string) => {
      const conver = conversationsRef.current.find(
        (c) => c._id === conversationId,
      );
      const myId = (userRef.current as any)?._id;
      if (conver && (conver as IGroupConversation).leaderId !== myId) {
        toast.info(`Nhóm ${conver.name} đã giải tán`);
      }

      queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
        removeConvFromList(old, conversationId),
      );

      if (currentConversationRef.current === conversationId) {
        dispatch(setCurrentConversation(''));
      }
    };

    // ─── Removed from group ───────────────────────────────────
    const handleDeletedGroup = (conversationId: string) => {
      const conver = conversationsRef.current.find(
        (c) => c._id === conversationId,
      );
      toast.info(`Bạn đã bị xóa khỏi nhóm ${conver?.name}`);

      queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
        removeConvFromList(old, conversationId),
      );

      if (currentConversationRef.current === conversationId) {
        dispatch(setCurrentConversation(''));
      }

      socket.emit('leave-conversation', conversationId);
    };

    // ─── Added to group ───────────────────────────────────────
    const handleAddedGroup = (_conversationId: string) => {
      queryClient.invalidateQueries({
        queryKey: chatKeys.conversations.all,
      });
    };

    // ─── Rename conversation ──────────────────────────────────
    const handleRenameConversation = (
      conversationId: string,
      conversationName: string,
      message: any,
    ) => {
      queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
        patchConversation(old, conversationId, { name: conversationName }),
      );

      // Add the notify message to the chat
      handleNewMessage(message);
    };

    // ─── Avatar update ────────────────────────────────────────
    const handleAvatarUpdate = (
      conversationId: string,
      conversationAvatar: string,
      _message: any,
    ) => {
      if (currentConversationRef.current === conversationId) {
        queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
          patchConversation(old, conversationId, {
            avatar: conversationAvatar,
          } as any),
        );
      }
    };

    // ─── Last view update ─────────────────────────────────────
    const handleUserLastView = ({
      conversationId,
      userId,
      lastView,
      channelId,
    }: any) => {
      const myId = (userRef.current as any)?._id;
      if (userId === myId) return;

      if (channelId) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.channels.lastView(channelId),
        });
      } else {
        queryClient.invalidateQueries({
          queryKey: chatKeys.members.lastView(conversationId),
        });
      }
    };

    // ─── Member updates ───────────────────────────────────────
    const handleUpdateMember = async (conversationId: string) => {
      if (currentConversationRef.current === conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.members.list(conversationId),
        });
        queryClient.invalidateQueries({
          queryKey: chatKeys.members.lastView(conversationId),
        });
      }
    };

    // ─── Pin message ──────────────────────────────────────────
    const handleActionPinMessage = (conversationId: string) => {
      if (currentConversationRef.current === conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.pinMessages.list(conversationId),
        });
      }
    };

    // ─── Channel CRUD ─────────────────────────────────────────
    const handleNewChannel = ({ conversationId }: any) => {
      if (currentConversationRef.current === conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.channels.list(conversationId),
        });
      }
    };

    const handleDeleteChannel = async ({ conversationId, channelId }: any) => {
      dispatch(setCurrentChannel(''));
      if (currentConversationRef.current === conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.channels.list(conversationId),
        });
        queryClient.invalidateQueries({
          queryKey: chatKeys.members.lastView(conversationId),
        });
      }
    };

    const handleUpdateChannel = ({ conversationId }: any) => {
      if (currentConversationRef.current === conversationId) {
        queryClient.invalidateQueries({
          queryKey: chatKeys.channels.list(conversationId),
        });
      }
    };

    // ─── Managers ─────────────────────────────────────────────
    const handleAddManagers = ({ conversationId, managerIds }: any) => {
      queryClient.setQueryData<Conversation[]>(conversationsKey, (old) => {
        if (!old) return [];
        return old.map((c) => {
          if (c._id !== conversationId) return c;
          const existing = c.managerIds || [];
          return {
            ...c,
            managerIds: Array.from(new Set([...existing, ...managerIds])),
          };
        });
      });
    };

    const handleDeleteManagers = ({ conversationId, managerIds }: any) => {
      queryClient.setQueryData<Conversation[]>(conversationsKey, (old) => {
        if (!old) return [];
        return old.map((c) => {
          if (c._id !== conversationId) return c;
          return {
            ...c,
            managerIds: (c.managerIds || []).filter(
              (id: string) => !managerIds.includes(id),
            ),
          };
        });
      });
    };

    // ─── Vote updates ─────────────────────────────────────────
    const handleVoteUpdate = (_conversationId: string, _voteMessage: any) => {
      // TODO: implement when vote feature is migrated
    };

    // ── Register all listeners ────────────────────────────────
    socket.on('receive-message', handleNewMessage);
    socket.on('receive-channel-message', handleNewChannelMessage);
    socket.on('delete-message', handleDeleteMessage);
    socket.on('add-reaction', handleReaction);
    socket.on('delete-conversation', handleDeleteConversation);
    socket.on('deleted-group', handleDeletedGroup);
    socket.on('added-group', handleAddedGroup);
    socket.on('rename-conversation', handleRenameConversation);
    socket.on('update-avatar-conversation', handleAvatarUpdate);
    socket.on('user-last-view', handleUserLastView);
    socket.on('update-member', handleUpdateMember);
    socket.on('action-pin-message', handleActionPinMessage);
    socket.on('new-channel', handleNewChannel);
    socket.on('delete-channel', handleDeleteChannel);
    socket.on('update-channel', handleUpdateChannel);
    socket.on('add-managers', handleAddManagers);
    socket.on('delete-managers', handleDeleteManagers);
    socket.on('update-vote-message', handleVoteUpdate);

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      socket.off('receive-message', handleNewMessage);
      socket.off('receive-channel-message', handleNewChannelMessage);
      socket.off('delete-message', handleDeleteMessage);
      socket.off('add-reaction', handleReaction);
      socket.off('delete-conversation', handleDeleteConversation);
      socket.off('deleted-group', handleDeletedGroup);
      socket.off('added-group', handleAddedGroup);
      socket.off('rename-conversation', handleRenameConversation);
      socket.off('update-avatar-conversation', handleAvatarUpdate);
      socket.off('user-last-view', handleUserLastView);
      socket.off('update-member', handleUpdateMember);
      socket.off('action-pin-message', handleActionPinMessage);
      socket.off('new-channel', handleNewChannel);
      socket.off('delete-channel', handleDeleteChannel);
      socket.off('update-channel', handleUpdateChannel);
      socket.off('add-managers', handleAddManagers);
      socket.off('delete-managers', handleDeleteManagers);
      socket.off('update-vote-message', handleVoteUpdate);
    };
  }, [socket, queryClient, dispatch, conversationsKey, getMessagesKey]);
}
