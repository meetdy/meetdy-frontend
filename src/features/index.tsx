import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import { setTabActive } from '@/app/globalSlice';
import conversationApi from '@/api/conversationApi';
import NotFoundPage from '@/components/not-found-page';

import { createKeyListConversations } from '@/hooks/conversation/useGetListConversations';
import { createKeyGetListMessages } from '@/hooks/message/useGetListMessages';

import Chat from '@/features/Chat';
import Friend from '@/features/Friend';
import NavbarContainer from '@/features/Chat/containers/NavbarContainer';

import timeUtils from '@/utils/time-utils';

import {
  addMessage,
  addMessageInChannel,
  fetchConversationById,
  fetchListConversations,
  updateAvatarWhenUpdateMember,
  updateFriendChat,
} from '@/app/chatSlice';
import { setNumberOfNotification } from '@/app/globalSlice';

import { invalidateFriendCore } from '@/hooks/friend';
import useWindowUnloadEffect from '@/hooks/utils/useWindowUnloadEffect';

import { createSocketConnection as init, socket } from '@/lib/socket';

init();

function ChatLayout() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const codeRevokeRef = useRef(null);

  const [idNewMessage, setIdNewMessage] = useState('');


  const { user, numberOfNotification } = useSelector((state: any) => state.global);
  const { conversations } = useSelector((state: any) => state.chat);

  useEffect(() => {
    dispatch(setTabActive(1));
    dispatch(fetchListConversations());
  }, []);

  useEffect(() => {
    const userId = user._id;
    if (userId) socket.emit('join', userId);
  }, [user]);

  useEffect(() => {
    if (conversations.length === 0) return;

    const conversationIds = conversations.map(
      (conversationEle) => conversationEle._id,
    );
    socket.emit('join-conversations', conversationIds);
  }, [conversations]);

  useEffect(() => {
    socket.on('create-individual-conversation', (conversationId) => {
      socket.emit('join-conversation', conversationId);
      dispatch(fetchConversationById({ conversationId }));
    });
  }, []);

  useEffect(() => {
    socket.on(
      'create-individual-conversation-when-was-friend',
      (conversationId) => {
        dispatch(fetchConversationById({ conversationId }));
      },
    );
  }, []);

  useEffect(() => {
    socket.on('new-message', (conversationId, newMessage) => {
      dispatch(addMessage(newMessage));
      setIdNewMessage(newMessage._id);

      // Update Conversations List (React Query Cache)
      queryClient.setQueryData(
        createKeyListConversations({}),
        (oldData: any[]) => {
          if (!oldData) return oldData;
          const index = oldData.findIndex((c: any) => c._id === conversationId);
          if (index === -1) return oldData;

          const conversation = { ...oldData[index] };
          conversation.lastMessage = {
            ...newMessage,
            createdAt: timeUtils.toTime(newMessage.createdAt),
          };
          conversation.numberUnread = (conversation.numberUnread || 0) + 1;

          const newConversations = oldData.filter((c: any) => c._id !== conversationId);
          return [conversation, ...newConversations];
        }
      );

      queryClient.invalidateQueries({
        queryKey: createKeyGetListMessages({ conversationId, size: 10 })
      });

      queryClient.invalidateQueries({
        queryKey: createKeyListConversations({})
      });
    });

    socket.on('update-member', async (conversationId) => {
      const data = await conversationApi.getConversationById(conversationId);
      const { avatar, totalMembers } = data;
      dispatch(
        updateAvatarWhenUpdateMember({
          conversationId,
          avatar,
          totalMembers,
        }),
      );
    });

    socket.on(
      'new-message-of-channel',
      (conversationId, channelId, message) => {
        dispatch(addMessageInChannel({ conversationId, channelId, message }));
        setIdNewMessage(message._id);
      },
    );

    socket.on('create-conversation', (conversationId) => {
      console.log('tạo nhóm', conversationId);
      dispatch(fetchConversationById({ conversationId }));
    });
  }, []);

  useWindowUnloadEffect(async () => {
    async function leaveApp() {
      socket.emit('leave', user._id);
      await timeUtils.sleep(2000);
    }

    await leaveApp();
  }, true);

  useEffect(() => {
    socket.on('accept-friend', () => {
      invalidateFriendCore();
    });

    socket.on('send-friend-invite', () => {
      invalidateFriendCore();
      dispatch(setNumberOfNotification(numberOfNotification + 1));
    });

    // xóa lời mời kết bạn
    socket.on('deleted-friend-invite', () => {
      invalidateFriendCore();
    });

    //  xóa gởi lời mời kết bạn cho người khác
    socket.on('deleted-invite-was-send', () => {
      invalidateFriendCore();

    });

    // xóa kết bạn
    socket.on('deleted-friend', (_id) => {
      invalidateFriendCore();
      dispatch(updateFriendChat(_id));
    });

    // revokeToken
    socket.on('revoke-token', ({ key }) => {
      if (codeRevokeRef.current !== key) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        queryClient.clear();
        window.location.reload();
      }
    });
  }, []);

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
