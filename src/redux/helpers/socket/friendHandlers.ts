import { updateFriendChat } from '@/redux/slice/chat/chatSlice';
import {
  setNumberOfNotification,
  setNewFriend,
  setNewRequestFriend,
  updateFriend,
  updateMyRequestFriend,
  updateRequestFriends,
} from '@/redux/slice/friendSlice';
import { StoreApi } from '@/redux/types';
import { SocketEvent } from '@/redux/types/socketEvents';
import { Socket } from 'socket.io-client';

export const friendHandlers = (socket: Socket, storeApi: StoreApi) => {
  const { dispatch, getState } = storeApi;

  socket.on(SocketEvent.AcceptFriend, (value: any) => {
    dispatch(setNewFriend(value));
    dispatch(updateMyRequestFriend(value._id));
  });

  socket.on(SocketEvent.SendFriendInvite, (value: any) => {
    const { numberOfNotification } = getState().global;
    dispatch(setNewRequestFriend(value));
    dispatch(setNumberOfNotification(numberOfNotification + 1));
  });

  socket.on(SocketEvent.DeletedFriendInvite, (_id: string) => {
    dispatch(updateMyRequestFriend(_id));
  });

  socket.on(SocketEvent.DeletedInviteWasSend, (_id: string) => {
    dispatch(updateRequestFriends(_id));
  });

  socket.on(SocketEvent.DeletedFriend, (_id: string) => {
    dispatch(updateFriend(_id));
    dispatch(updateFriendChat({ id: _id }));
  });
};
