import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { setTabActive, setNumberOfNotification } from '@/app/globalSlice';
import conversationApi from '@/api/conversationApi';

import NotFoundPage from '@/components/not-found-page';

import Chat from '@/features/Chat';
import Friend from '@/features/Friend';
import NavbarContainer from '@/features/Chat/containers/NavbarContainer';

import { chatKeys, useConversations } from '@/hooks/chat';
import {
  bumpConversation,
  patchConversation,
} from '@/hooks/chat/conversationCacheUtils';
import { appendMessage } from '@/hooks/chat/messageCacheUtils';
import type { MessagesCache } from '@/hooks/chat/messageCacheUtils';

import { invalidateFriendCore } from '@/hooks/friend';
import useWindowUnloadEffect from '@/hooks/utils/useWindowUnloadEffect';

import { createSocketConnection as init, socket } from '@/lib/socket';

import timeUtils from '@/utils/time-utils';

import type {
  IGroupConversation,
  IIndividualConversation,
} from '@/models/conversation.model';

type Conversation = IIndividualConversation | IGroupConversation;

init();

function ChatLayout() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const codeRevokeRef = useRef(null);

  const [idNewMessage, setIdNewMessage] = useState('');

  const { user, numberOfNotification } = useSelector(
    (state: any) => state.global,
  );

  // Conversations from React Query (replaces state.chat.conversations)
  const { conversations = [] } = useConversations();

  const conversationsKey = chatKeys.conversations.list({});

  useEffect(() => {
    dispatch(setTabActive(1));
    // Conversations are fetched automatically by useConversations() hook
  }, []);

  useEffect(() => {
    const userId = user._id;
    if (userId) socket.emit('join', userId);
  }, [user]);

  useEffect(() => {
    if (conversations.length === 0) return;

    const conversationIds = conversations.map((i: Conversation) => i._id);
    socket.emit('join-conversations', conversationIds);
  }, [conversations]);

  // ── Socket: new conversations ──────────────────────────────
  useEffect(() => {
    const handleCreateIndividual = async (conversationId: string) => {
      socket.emit('join-conversation', conversationId);
      // Fetch the new conversation and add to React Query cache
      try {
        const conversation = await conversationApi.getConversationById(
          conversationId,
        );
        queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
          old ? [conversation, ...old] : [conversation],
        );
      } catch {
        queryClient.invalidateQueries({ queryKey: chatKeys.conversations.all });
      }
    };

    const handleCreateIndividualWasFriend = async (
      conversationId: string,
    ) => {
      try {
        const conversation = await conversationApi.getConversationById(
          conversationId,
        );
        queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
          old ? [conversation, ...old] : [conversation],
        );
      } catch {
        queryClient.invalidateQueries({ queryKey: chatKeys.conversations.all });
      }
    };

    const handleCreateConversation = async (conversationId: string) => {
      try {
        const conversation = await conversationApi.getConversationById(
          conversationId,
        );
        queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
          old ? [conversation, ...old] : [conversation],
        );
      } catch {
        queryClient.invalidateQueries({ queryKey: chatKeys.conversations.all });
      }
    };

    socket.on('create-individual-conversation', handleCreateIndividual);
    socket.on(
      'create-individual-conversation-when-was-friend',
      handleCreateIndividualWasFriend,
    );
    socket.on('create-conversation', handleCreateConversation);

    return () => {
      socket.off('create-individual-conversation', handleCreateIndividual);
      socket.off(
        'create-individual-conversation-when-was-friend',
        handleCreateIndividualWasFriend,
      );
      socket.off('create-conversation', handleCreateConversation);
    };
  }, [queryClient, conversationsKey]);

  // ── Socket: new-message (layout-level: bump conversation + track idNewMessage)
  // Note: useChatSocket in Chat/index.tsx handles appending messages to the message
  // cache. Here we only handle the layout-level concern of bumping conversations
  // and tracking new message IDs for the "hasNewMessage" prop.
  useEffect(() => {
    const handleNewMessage = (conversationId: string, newMessage: any) => {
      setIdNewMessage(newMessage._id);
      // Bump conversation to top with updated lastMessage + numberUnread
      queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
        bumpConversation(old, conversationId, newMessage),
      );
    };

    const handleNewChannelMessage = (
      _conversationId: string,
      _channelId: string,
      message: any,
    ) => {
      setIdNewMessage(message._id);
    };

    const handleUpdateMember = async (conversationId: string) => {
      // Fetch fresh conversation data and update avatar/totalMembers
      try {
        const data = await conversationApi.getConversationById(conversationId);
        const { avatar, totalMembers } = data;
        queryClient.setQueryData<Conversation[]>(conversationsKey, (old) =>
          patchConversation(old, conversationId, {
            avatar,
            totalMembers,
          } as any),
        );
      } catch {
        // Fallback: invalidate entire conversations cache
        queryClient.invalidateQueries({ queryKey: chatKeys.conversations.all });
      }
    };

    socket.on('new-message', handleNewMessage);
    socket.on('new-message-of-channel', handleNewChannelMessage);
    socket.on('update-member', handleUpdateMember);

    return () => {
      socket.off('new-message', handleNewMessage);
      socket.off('new-message-of-channel', handleNewChannelMessage);
      socket.off('update-member', handleUpdateMember);
    };
  }, [queryClient, conversationsKey]);

  useWindowUnloadEffect(async () => {
    async function leaveApp() {
      socket.emit('leave', user._id);
      await timeUtils.sleep(2000);
    }

    await leaveApp();
  }, true);

  useEffect(() => {
    const handleAcceptFriend = () => {
      invalidateFriendCore();
    };

    const handleSendFriendInvite = () => {
      invalidateFriendCore();
      dispatch(setNumberOfNotification(numberOfNotification + 1));
    };

    const handleDeletedFriendInvite = () => {
      invalidateFriendCore();
    };

    const handleDeletedInviteWasSend = () => {
      invalidateFriendCore();
    };

    const handleDeletedFriend = () => {
      invalidateFriendCore();
    };

    const handleRevokeToken = ({ key }: { key: any }) => {
      if (codeRevokeRef.current !== key) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        queryClient.clear();
        window.location.reload();
      }
    };

    socket.on('accept-friend', handleAcceptFriend);
    socket.on('send-friend-invite', handleSendFriendInvite);
    socket.on('deleted-friend-invite', handleDeletedFriendInvite);
    socket.on('deleted-invite-was-send', handleDeletedInviteWasSend);
    socket.on('deleted-friend', handleDeletedFriend);
    socket.on('revoke-token', handleRevokeToken);

    return () => {
      socket.off('accept-friend', handleAcceptFriend);
      socket.off('send-friend-invite', handleSendFriendInvite);
      socket.off('deleted-friend-invite', handleDeletedFriendInvite);
      socket.off('deleted-invite-was-send', handleDeletedInviteWasSend);
      socket.off('deleted-friend', handleDeletedFriend);
      socket.off('revoke-token', handleRevokeToken);
    };
  }, [numberOfNotification, dispatch, queryClient]);

  useEffect(() => {
    return () => {
      socket.close();
    };
  }, []);

  return (
    <div className="h-screen w-full">
      <div className="flex h-full">
        {/* Sidebar */}
        <aside className="w-16 shrink-0">
          <NavbarContainer />
        </aside>

        {/* Content */}
        <main className="flex-1 h-full overflow-hidden">
          <Routes>
            <Route
              index
              element={
                <div className="h-full overflow-auto">
                  <Chat socket={socket} hasNewMessage={!!idNewMessage} />
                </div>
              }
            />
            <Route
              path="friends"
              element={
                <div className="h-full overflow-auto">
                  <Friend />
                </div>
              }
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default ChatLayout;
