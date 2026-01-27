import { createSocketConnection, destroySocketConnection } from '@/lib/socket';
import { registerSocketHandlers } from '@/redux/helpers/socket';
import { connectionLost, socketConnecting } from '@/redux/slice/socketSlice';
import { RootState } from '@/redux/store';
import { StoreApi } from '@/redux/types';
import { SocketEvent } from '@/redux/types/socketEvents';
import { Middleware } from 'redux';

export const socketMiddleware: Middleware<object, RootState> = (storeApi) => {
  return (next) => (action: any) => {
    if (action.type === 'socket/initSocket') {
      const { user } = storeApi.getState().global;
      const { conversations } = storeApi.getState().chat;

      storeApi.dispatch(socketConnecting());
      const socket = createSocketConnection();

      if (user?._id && socket) {
        socket.emit(SocketEvent.Join, user._id);
      }

      if (conversations?.length && socket) {
        const conversationIds = conversations.map(
          (conversation) => conversation._id,
        );
        socket.emit(SocketEvent.JoinConversations, conversationIds);
      }

      registerSocketHandlers(socket, storeApi as StoreApi);
    }

    if (action.type === 'socket/disconnect') {
      destroySocketConnection();
      storeApi.dispatch(connectionLost());
    }

    return next(action);
  };
};
