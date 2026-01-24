import { checkAndFetchConversationById } from '@/hooks/conversation/useGetConversationById';
import {
  ILastGroupMessage,
  ILastIndividualMessage,
} from '@/models/message.model';
import {
  addManagers,
  addMessage,
  deleteManager,
  isDeletedFromGroup,
  removeConversation,
  setConversations,
  setCurrentConversation,
  updateAvatarWhenUpdateMember,
  updateAvavarConver,
  updateNameOfConver,
} from '@/redux/slice/chat/chatSlice';
import { setConversationInfo } from '@/redux/slice/globalSlice';
import { socketError } from '@/redux/slice/socketSlice';
import { StoreApi } from '@/redux/types';
import { SocketEvent } from '@/redux/types/socketEvents';
import { Socket } from 'socket.io-client';

export const conversationHandlers = (
  socket: Socket,
  storeApi: StoreApi,
  isJoinChatLayout: boolean,
) => {
  const { dispatch, getState } = storeApi;

  socket.on(
    SocketEvent.CreateIndividualConversation,
    async (conversationId: string) => {
      try {
        const { conversations } = getState().chat;

        socket.emit(SocketEvent.JoinConversations, conversationId);
        const conversation = await checkAndFetchConversationById(
          conversationId,
        );
        if (conversation) {
          dispatch(setConversations([conversation, ...conversations]));
        }
      } catch (error) {
        dispatch(socketError('error.errorWhileJoiningConversation'));
      }
    },
  );

  socket.on(
    SocketEvent.CreateIndividualConversationWhenWasFriend,
    async (conversationId: string) => {
      try {
        const { conversations } = getState().chat;

        socket.emit(SocketEvent.JoinConversations, conversationId);
        const conversation = await checkAndFetchConversationById(
          conversationId,
        );
        if (conversation) {
          dispatch(setConversations([conversation, ...conversations]));
        }
      } catch (error) {
        dispatch(socketError('error.errorWhileJoiningConversation'));
      }
    },
  );

  socket.on(SocketEvent.UpdateMember, async (conversationId: string) => {
    try {
      const conversation = await checkAndFetchConversationById(conversationId);
      if (conversation) {
        dispatch(
          updateAvatarWhenUpdateMember({
            conversationId,
            avatar: conversation.avatar,
            totalMembers: conversation.totalMembers,
          }),
        );
      }
    } catch (error) {
      dispatch(socketError('error.errorWhileUpdatingMember'));
    }
  });

  socket.on(SocketEvent.CreateConversation, async (conversationId: string) => {
    try {
      const { conversations } = getState().chat;

      const conversation = await checkAndFetchConversationById(conversationId);
      if (conversation) {
        dispatch(setConversations([conversation, ...conversations]));
      }
    } catch (error) {
      dispatch(socketError('error.errorWhileCreateingConversation'));
    }
  });

  if (!isJoinChatLayout) {
    socket.on(SocketEvent.DeleteConversation, (conversationId: string) => {
      const { conversations } = getState().chat;
      const { user } = getState().global;

      const conversation: any = conversations.find(
        (ele) => ele._id === conversationId,
      );
      if (!conversation) return;
      if (conversation?.leaderId === user?._id) {
        dispatch(
          setConversationInfo(
            'common.groupConversationDeleted' + `${conversation.name}`,
          ),
        );
      }
      dispatch(removeConversation(conversationId));
    });

    socket.on(SocketEvent.AddedGroup, async (conversationId: string) => {
      try {
        const { conversations } = getState().chat;

        const conversation = await checkAndFetchConversationById(
          conversationId,
        );
        if (conversation) {
          dispatch(setConversations([conversation, ...conversations]));
        }
      } catch {
        dispatch(socketError('error.errorWhileUpdatingMember'));
      }
    });

    socket.on(SocketEvent.DeleteGroup, (conversationId: string) => {
      const { conversations, currentConversation } = getState().chat;

      const conversation: any = conversations.find(
        (ele) => ele._id === conversationId,
      );
      if (!conversation) return;
      dispatch(
        setConversationInfo(
          'common.removedFromTheGroup' + `${conversation.name}`,
        ),
      );
      if (conversationId === currentConversation) {
        dispatch(setCurrentConversation(''));
      }
      dispatch(isDeletedFromGroup(conversationId));
      socket.emit(SocketEvent.LeaveConversation, conversationId);
    });

    socket.on(
      SocketEvent.RenameConversation,
      (
        conversationId: string,
        conversationName: string,
        message: ILastIndividualMessage | ILastGroupMessage,
      ) => {
        dispatch(updateNameOfConver({ conversationId, conversationName }));
        dispatch(addMessage(message));
      },
    );

    socket.on(
      SocketEvent.UpdateAvatarConversation,
      (conversationId: string, conversationAvatar: string) => {
        const { currentConversation } = getState().chat;

        if (conversationId === currentConversation) {
          dispatch(updateAvavarConver({ conversationId, conversationAvatar }));
        }
      },
    );

    socket.on(
      SocketEvent.AddManagers,
      ({
        conversationId,
        managerIds,
      }: {
        conversationId: string;
        managerIds: string[];
      }) => {
        dispatch(addManagers({ conversationId, managerIds }));
      },
    );

    socket.on(
      SocketEvent.DeleteManagers,
      ({
        conversationId,
        managerIds,
      }: {
        conversationId: string;
        managerIds: string[];
      }) => {
        dispatch(deleteManager({ conversationId, managerIds }));
      },
    );
  }
};
