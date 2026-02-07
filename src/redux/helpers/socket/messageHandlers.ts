import { IUser } from '@/models/auth.model';
import {
  ILastGroupMessage,
  ILastIndividualMessage,
} from '@/models/message.model';
import {
  addMessage,
  addMessageInChannel,
  addTypingUser,
  removeTypingUser,
  setIdNewMessage,
  setPinMessages,
  setReactionMessage,
  updateLastViewOfMembers,
  updateVoteMessage,
} from '@/redux/slice/chat/chatSlice';
import { socketError } from '@/redux/slice/socketSlice';
import { StoreApi } from '@/redux/types';
import { SocketEvent } from '@/redux/types/socketEvents';
import { Socket } from 'socket.io-client';

export const messageHandlers = (
  socket: Socket,
  storeApi: StoreApi,
  isJoinChatLayout: boolean,
) => {
  const { dispatch, getState } = storeApi;

  socket.on(
    SocketEvent.NewMessage,
    (
      _conversationId: string,
      newMessage: ILastIndividualMessage | ILastGroupMessage,
    ) => {
      storeApi.dispatch(addMessage(newMessage));
      storeApi.dispatch(setIdNewMessage(newMessage._id));
    },
  );

  socket.on(
    SocketEvent.NewMessageOfChannel,
    (
      conversationId: string,
      channelId: string,
      message: ILastIndividualMessage | ILastGroupMessage,
    ) => {
      dispatch(addMessageInChannel({ conversationId, channelId, message }));
      dispatch(setIdNewMessage(message._id));
    },
  );

  if (!isJoinChatLayout) {
    socket.on(
      SocketEvent.AddReaction,
      ({
        conversationId,
        channelId,
        messageId,
        user,
        type,
      }: {
        conversationId: string;
        channelId: string;
        messageId: string;
        user: any;
        type: string;
      }) => {
        const { currentConversation, currentChannel } = getState().chat;

        if (
          currentConversation === conversationId &&
          currentChannel === channelId
        ) {
          dispatch(setReactionMessage({ messageId, user, type }));
        }
        if (!channelId && currentConversation === conversationId) {
          dispatch(setReactionMessage({ messageId, user, type }));
        }
      },
    );

    socket.on(SocketEvent.Typing, (conversationId: string, user: IUser) => {
      const { currentConversation } = getState().chat;

      if (currentConversation === conversationId) {
        dispatch(addTypingUser(user));
      }
    });

    socket.on(SocketEvent.NotTyping, (conversationId: string, user: IUser) => {
      const { currentConversation } = getState().chat;

      if (currentConversation === conversationId) {
        dispatch(removeTypingUser(user));
      }
    });

    socket.on(SocketEvent.ActionPinMessage, async (conversationId: string) => {
      const { currentConversation } = getState().chat;

      if (currentConversation === conversationId) {
        try {
          console.log('Fetching pin messages via socket...');
        } catch (error) {
          dispatch(socketError('error.errorWhileFetchingPinMessages'));
        }
      }
    });

    socket.on(
      SocketEvent.UserLastView,
      ({
        conversationId,
        lastView,
        userId,
        channelId,
      }: {
        conversationId: string;
        lastView: string;
        userId: string;
        channelId?: string;
      }) => {
        dispatch(
          updateLastViewOfMembers({
            conversationId,
            userId,
            lastView,
            channelId,
          }),
        );
      },
    );

    socket.on(
      SocketEvent.UpdateVoteMessage,
      (conversationId: string, voteMessage: any) => {
        const { currentConversation } = getState().chat;

        if (conversationId === currentConversation) {
          dispatch(updateVoteMessage(voteMessage));
        }
      },
    );
  }
};
