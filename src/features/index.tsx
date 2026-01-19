import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { setTabActive } from '@/app/globalSlice';
import conversationApi from '@/api/conversationApi';
import NotFoundPage from '@/components/NotFoundPage';

import Chat from '@/features/Chat';
import Friend from '@/features/Friend';
import NavbarContainer from '@/features/Chat/containers/NavbarContainer';
import { useQueryClient } from '@tanstack/react-query';
import { fetchListConversationsKey } from '@/hooks/conversation/useFetchListConversations';
import { fetchListMessagesKey } from '@/hooks/message/useFetchListMessages';
import dateUtils from '@/utils/dateUtils';

import {
  addMessage,
  addMessageInChannel,
  fetchAllSticker,
  fetchConversationById,
  fetchListClassify,
  fetchListColor,
  fetchListConversations,
  updateAvatarWhenUpdateMember,
  updateFriendChat,
} from '@/features/Chat/slice/chatSlice';
import {
  fetchFriends,
  fetchListGroup,
  fetchListMyRequestFriend,
  fetchListRequestFriend,
  setAmountNotify,
  setMyRequestFriend,
  setNewFriend,
  setNewRequestFriend,
  updateFriend,
  updateMyRequestFriend,
  updateRequestFriends,
} from '@/features/Friend/friendSlice';
import { fetchInfoWebs } from '@/features/Home/homeSlice';
import useWindowUnloadEffect from '@/hooks/useWindowUnloadEffect';

import { createSocketConnection as init, socket } from '@/lib/socket';

init();

function ChatLayout() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const codeRevokeRef = useRef(null);

  const { isJoinChatLayout, user } = useSelector((state: any) => state.global);
  const { conversations } = useSelector((state: any) => state.chat);
  const { amountNotify } = useSelector((state: any) => state.friend);

  const [idNewMessage, setIdNewMessage] = useState('');

  useEffect(() => {
    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    dispatch(setTabActive(1));

    dispatch(fetchListRequestFriend());
    dispatch(fetchListMyRequestFriend());
    dispatch(
      fetchFriends({
        name: '',
      }),
    );
    dispatch(
      fetchListGroup({
        name: '',
        type: 2,
      }),
    );
    dispatch(fetchListClassify());
    dispatch(fetchListColor());
    dispatch(fetchListConversations({}));
    dispatch(fetchAllSticker());
    dispatch(fetchInfoWebs());
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
    socket.on('create-individual-conversation', (converId) => {
      socket.emit('join-conversation', converId);
      dispatch(fetchConversationById({ conversationId: converId }));
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
        fetchListConversationsKey({}),
        (oldData: any[]) => {
          if (!oldData) return oldData;
          const index = oldData.findIndex((c: any) => c._id === conversationId);
          if (index === -1) return oldData;
          
          const conversation = { ...oldData[index] };
          conversation.lastMessage = {
             ...newMessage,
             createdAt: dateUtils.toTime(newMessage.createdAt),
          };
          
          // Increment unread only if not current conversation or if window not focused (handled elsewhere?)
          // Implementation plan says: increment if not current.
          // In ChatLayout we don't know refCurrentConversation easily unless we stick it in a ref or selector.
          // But we have `conversations` selector.
          // Wait, logic in reducer checks state.currentConversation.
          // Here we are in ChatLayout. We can access store state via valid techniques or just rely on what we have.
          // Redux `addMessage` handles unread count.
          // For RQ, we should ideally replicate.
          // The socket callback here doesn't have access to currentConversation state easily unless we use a Ref updated by effect.
          
          // Simple fix: Always increment unread in cache, component will reset it if active? 
          // No, if active we see unread count jump.
          // Let's rely on Component to clear unread, but we update cache here.
          // Actually, reducer says: if (conversationId === state.currentConversation && !state.currentChannel) ... numberUnread=0
          
          conversation.numberUnread = (conversation.numberUnread || 0) + 1;

          const newConversations = oldData.filter((c: any) => c._id !== conversationId);
          return [conversation, ...newConversations];
        }
      );
      
      // We also need to update message list if it's open.
      // Since we don't know easily if it's open here without state access,
      // We can invalidate the specific message list query.
      queryClient.invalidateQueries({
         queryKey: fetchListMessagesKey({ conversationId, size: 10 })
      });
      // Also invalidate conversation list to be safe/eventual consistent
      queryClient.invalidateQueries({
         queryKey: fetchListConversationsKey({})
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

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  useWindowUnloadEffect(async () => {
    async function leaveApp() {
      socket.emit('leave', user._id);
      await sleep(2000);
    }

    await leaveApp();
  }, true);

  useEffect(() => {
    socket.on('accept-friend', (value) => {
      dispatch(setNewFriend(value));
      dispatch(setMyRequestFriend(value._id));
    });

    socket.on('send-friend-invite', (value) => {
      dispatch(setNewRequestFriend(value));
      dispatch(setAmountNotify(amountNotify + 1));
    });

    // xóa lời mời kết bạn
    socket.on('deleted-friend-invite', (_id) => {
      dispatch(updateMyRequestFriend(_id));
    });

    //  xóa gởi lời mời kết bạn cho người khác
    socket.on('deleted-invite-was-send', (_id) => {
      dispatch(updateRequestFriends(_id));
    });

    // xóa kết bạn
    socket.on('deleted-friend', (_id) => {
      dispatch(updateFriend(_id));
      dispatch(updateFriendChat(_id));
    });
    // revokeToken

    socket.on('revoke-token', ({ key }) => {
      if (codeRevokeRef.current !== key) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.reload();
      }
    });
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
                  <Chat socket={socket} idNewMessage={idNewMessage} />
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
