import { checkAndFetchLastViewOfMembers } from '@/hooks/conversation/useGetLastViewOfMembers';
import { checkAndFetchListMessages } from '@/hooks/message/useGetListMessages';
import {
  removeChannel,
  setCurrentChannel,
  setLastViewOfMember,
  setMessages,
  updateChannel,
  updateNameChannel,
} from '@/redux/slice/chat/chatSlice';
import { socketError } from '@/redux/slice/socketSlice';
import { StoreApi } from '@/redux/types';
import { SocketEvent } from '@/redux/types/socketEvents';
import { Socket } from 'socket.io-client';

export const channelHandlers = (
  socket: Socket,
  storeApi: StoreApi,
  isJoinChatLayout: boolean,
) => {
  const { dispatch, getState } = storeApi;

  if (!isJoinChatLayout) {
    socket.on(
      SocketEvent.NewChannel,
      async ({
        _id,
        name,
        conversationId,
        createdAt,
      }: {
        _id: string;
        name: string;
        conversationId: string;
        createdAt: string;
      }) => {
        const { currentConversation } = getState().chat;

        if (conversationId === currentConversation) {
          dispatch(
            updateChannel({
              _id,
              name,
              createdAt,
            }),
          );
        }
      },
    );

    socket.on(
      SocketEvent.DeleteChannel,
      async ({
        conversationId,
        channelId,
      }: {
        conversationId: string;
        channelId: string;
      }) => {
        try {
          const { currentConversation } = getState().chat;

          const actionAfterDelete = async () => {
            dispatch(setCurrentChannel(''));
            const messages = await checkAndFetchListMessages({
              conversationId,
              size: 10,
            });
            const lastViewOfMembers = await checkAndFetchLastViewOfMembers(
              conversationId,
            );
            storeApi.dispatch(
              setMessages({
                conversationId,
                messages: {
                  data: messages.data,
                  page: messages.page,
                  totalPages: messages.totalPages,
                },
              }),
            );
            storeApi.dispatch(setLastViewOfMember(lastViewOfMembers));
          };
          await actionAfterDelete();

          if (conversationId === currentConversation) {
            storeApi.dispatch(removeChannel({ channelId }));
          }
        } catch (error) {
          dispatch(socketError(t('error.errorWhileDeleteChannel')));
        }
      },
    );

    socket.on(
      SocketEvent.UpdateChannel,
      ({
        _id,
        name,
        conversationId,
      }: {
        _id: string;
        name: string;
        conversationId: string;
      }) => {
        const { currentConversation } = getState().chat;

        if (conversationId === currentConversation) {
          storeApi.dispatch(
            updateNameChannel({
              channelId: _id,
              name,
            }),
          );
        }
      },
    );
  }
};
