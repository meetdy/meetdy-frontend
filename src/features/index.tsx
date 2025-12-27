import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { setTabActive } from '@/app/globalSlice';
import conversationApi from '@/api/conversationApi';
import NotFoundPage from '@/components/NotFoundPage';

import Chat from '@/features/Chat';
import Friend from '@/features/Friend';
import NavbarContainer from '@/features/Chat/containers/NavbarContainer';

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

import { init, socket } from '@/utils/socketClient';

init();

function ChatLayout() {
  const dispatch = useDispatch();

  const codeRevokeRef = useRef(null);

  const { conversations } = useSelector((state) => state.chat);
  const { isJoinChatLayout, user } = useSelector((state) => state.global);
  const { amountNotify } = useSelector((state) => state.friend);
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

    // dispatch(setJoinFriendLayout(true))
  }, []);

  return (
    <div className="h-screen w-full overflow-hidden">
      <div className="flex h-full">
        <aside>
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
