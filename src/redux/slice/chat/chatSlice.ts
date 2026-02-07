import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import timeUtils from '@/utils/time-utils';
import {
  IGroupConversation,
  IIndividualConversation,
} from '@/models/conversation.model';
import {
  ILastGroupMessage,
  ILastIndividualMessage,
} from '@/models/message.model';
import { IFriend } from '@/models/friend.model';
import { IClassify, IColor } from '@/models/classify.model';
import { IUser } from '@/models/auth.model';

type Conversation = IIndividualConversation | IGroupConversation;

interface ChatState {
  isLoading: boolean;
  conversations: Conversation[];
  idNewMessage: string;
  currentConversation: string;
  messages: (ILastGroupMessage | ILastIndividualMessage)[];
  friends: IFriend[];
  memberInConversation: any[];
  type: boolean;
  currentPage: string | number;
  totalPages: string;
  toTalUnread: number;
  pinMessages: any[];
  lastViewOfMember: any[];
  currentChannel: string;
  channels: any[];
  totalChannelNotify: number;
  votes: any[];
  totalPagesVote: number;
  usersTyping: IUser[];
  replyMessage: (ILastGroupMessage | ILastIndividualMessage) | null;
  isInfoPanelOpen: boolean;
}

const initialState: ChatState = {
  isLoading: false,
  conversations: [],
  idNewMessage: '',
  currentConversation: '',
  messages: [],
  friends: [],
  memberInConversation: [],
  type: false,
  currentPage: '',
  totalPages: '',
  toTalUnread: 0,
  pinMessages: [],
  lastViewOfMember: [],
  currentChannel: '',
  channels: [],
  totalChannelNotify: 0,
  votes: [],
  totalPagesVote: 0,
  usersTyping: [],
  replyMessage: null,
  isInfoPanelOpen: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<ILastIndividualMessage | ILastGroupMessage>,
    ) => {
      const newMessage = action.payload;
      const { conversationId } = newMessage;

      const index = state.conversations.findIndex(
        (conversation) => conversation._id === conversationId,
      );
      if (index === -1) return;

      const searchConversation = state.conversations[index];
      searchConversation.numberUnread =
        (searchConversation.numberUnread || 0) + 1;
      searchConversation.lastMessage = {
        ...newMessage,
        createdAt: timeUtils.toTime(newMessage.createdAt),
      };

      const updatedConversations = state.conversations.filter(
        (conversation) => conversation._id !== conversationId,
      );

      if (
        conversationId === state.currentConversation &&
        !state.currentChannel
      ) {
        state.messages.push(newMessage);
        searchConversation.numberUnread = 0;
      }

      state.conversations = [searchConversation, ...updatedConversations];
    },

    setMessages: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messages: {
          data: (ILastGroupMessage | ILastIndividualMessage)[];
          page: number | string;
          totalPages: string;
        };
      }>,
    ) => {
      const { conversationId, messages } = action.payload;

      const conversationIndex = state.conversations.findIndex(
        (conversation) => conversation._id === conversationId,
      );

      if (conversationIndex !== -1) {
        state.conversations[conversationIndex] = {
          ...state.conversations[conversationIndex],
          numberUnread: 0,
        };
      }

      state.currentConversation = conversationId;
      state.messages = messages.data;
      state.currentPage = messages.page;
      state.totalPages = messages.totalPages;
    },

    setMemberInConversation: (state, action: PayloadAction<any[]>) => {
      const tempMembers = action.payload as any;
      const temp: any[] = [];

      tempMembers.forEach((member: { _id: string; isFriend?: boolean }) => {
        state.friends.forEach((friend) => {
          if (member._id === friend._id) {
            member = { ...member, isFriend: true };
            return;
          }
        });
        temp.push(member);
      });

      state.memberInConversation = temp;
    },

    setChannels: (state, action: PayloadAction<any[]>) => {
      state.channels = action.payload;
    },

    setIdNewMessage: (state, action: PayloadAction<string>) => {
      state.idNewMessage = action.payload;
    },

    addMessageInChannel: (
      state,
      action: PayloadAction<{
        conversationId: string;
        channelId: string;
        message: ILastIndividualMessage | ILastGroupMessage;
      }>,
    ) => {
      const { conversationId, channelId, message } = action.payload;

      const index = state.channels.findIndex(
        (channel: any) => channel._id === channelId,
      );
      if (index === -1) return;

      const searchChannel = state.channels[index];
      const updatedChannels = state.channels.filter(
        (channel: any) => channel._id !== channelId,
      );

      searchChannel.numberUnread = (searchChannel.numberUnread || 0) + 1;

      if (
        state.currentConversation === conversationId &&
        state.currentChannel === channelId
      ) {
        state.messages.push(message);
        searchChannel.numberUnread = 0;
      }

      state.channels = [searchChannel, ...updatedChannels];
    },

    setFriends: (state, action: PayloadAction<IFriend[]>) => {
      state.friends = action.payload;
    },

    removeConversation: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      state.conversations = state.conversations.filter(
        (conversation) => conversation._id !== conversationId,
      );
      if (state.currentConversation === conversationId) {
        state.currentConversation = '';
      }
    },

    setCurrentConversation: (state, action: PayloadAction<string>) => {
      state.currentConversation = action.payload;
    },

    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },

    setPinMessages: (state, action: PayloadAction<any[]>) => {
      state.pinMessages = action.payload.reverse();
    },

    updateNameOfConver: (
      state,
      action: PayloadAction<{
        conversationId: string;
        conversationName: string;
      }>,
    ) => {
      const { conversationId, conversationName } = action.payload;
      const index = state.conversations.findIndex(
        (conversation) => conversation._id === conversationId,
      );
      if (index !== -1) {
        state.conversations[index].name = conversationName;
      }
    },

    setTotalChannelNotify: (state) => {
      let notify =
        state.conversations.find(
          (conversation) => conversation._id === state.currentConversation,
        )?.numberUnread || 0;

      state.channels.forEach((channel: any) => {
        if (channel.numberUnread && channel.numberUnread > 0) {
          notify += 1;
        }
      });

      state.totalChannelNotify = notify;
    },

    setRaisePage: (state) => {
      if (Number(state.currentPage) < Number(state.totalPages) - 1) {
        state.currentPage = Number(state.currentPage) + 1;
      }
    },
    setTypeOfConversation: (
      state: ChatState,
      action: PayloadAction<string>,
    ) => {
      const conversationId = action.payload;

      const conversation = state.conversations.find(
        (ele: Conversation) => ele._id === conversationId,
      );

      if (conversation) {
        state.type = conversation.type ?? false;
      }
    },
    setRedoMessage: (
      state: ChatState,
      action: PayloadAction<{ id: string; conversationId: string }>,
    ) => {
      const { id, conversationId } = action.payload;

      // Tìm tin nhắn đã thu hồi
      const oldMessage = state.messages.find((message) => message._id === id);
      if (!oldMessage) {
        console.error(`Message with ID ${id} not found`);
        return;
      }

      // Lấy index của tin nhắn
      const index = state.messages.findIndex((message) => message._id === id);
      if (index === -1) {
        console.error(`Message index for ID ${id} not found`);
        return;
      }

      // Tạo tin nhắn mới đã được thu hồi
      const newMessage: ILastIndividualMessage | ILastGroupMessage = {
        ...oldMessage,
        isDeleted: true, // Thuộc tính isDeleted
      };

      // Cập nhật tin nhắn đã thu hồi
      state.messages[index] = newMessage;

      // Xử lý lastMessage trong cuộc hội thoại
      if (conversationId) {
        const conversationIndex = state.conversations.findIndex(
          (ele) => ele._id === conversationId,
        );
        if (conversationIndex === -1) {
          console.error(`Conversation with ID ${conversationId} not found`);
          return;
        }

        const lastMessage = state.conversations[conversationIndex].lastMessage;
        if (lastMessage) {
          lastMessage.isDeleted = true;
        }
      }
    },

    deleteMessageClient: (state: ChatState, action: PayloadAction<string>) => {
      const id = action.payload;
      state.messages = state.messages.filter((message) => message._id !== id);
    },

    setToTalUnread: (state: ChatState) => {
      const unreadCount = state.conversations.reduce((count, conversation) => {
        return count + (conversation.numberUnread > 0 ? 1 : 0);
      }, 0);

      state.toTalUnread = unreadCount;
    },

    setReactionMessage: (
      state: ChatState,
      action: PayloadAction<{
        messageId: string;
        user: { _id: string; name: string };
        type: string;
      }>,
    ) => {
      const { messageId, user, type } = action.payload;

      const index = state.messages.findIndex(
        (message) => message._id === messageId,
      );
      if (index === -1) return;

      const currentMessage = state.messages[index];

      const existingReactionIndex = currentMessage.reacts.findIndex(
        (reaction) => reaction.user._id === user._id,
      );

      if (existingReactionIndex >= 0) {
        currentMessage.reacts[existingReactionIndex] = {
          ...currentMessage.reacts[existingReactionIndex],
          type,
        };
      } else {
        currentMessage.reacts = [...currentMessage.reacts, { user, type }];
      }
    },
    leaveGroup: (state: ChatState, action: PayloadAction<string>) => {
      const conversationId = action.payload;

      state.conversations = state.conversations.filter(
        (conversation) => conversation._id !== conversationId,
      );

      if (state.currentConversation === conversationId) {
        state.currentConversation = '';
      }
    },
    isDeletedFromGroup: (state: ChatState, action: PayloadAction<string>) => {
      const conversationId = action.payload;

      state.conversations = state.conversations.filter(
        (conversation) => conversation._id !== conversationId,
      );
    },

    setNumberUnreadForNewFriend: (
      state: ChatState,
      action: PayloadAction<string>,
    ) => {
      const id = action.payload;

      const index = state.conversations.findIndex(
        (conversation) => conversation._id === id,
      );
      if (index === -1) {
        console.error(`Conversation with ID ${id} not found`);
        return;
      }

      state.conversations[index] = {
        ...state.conversations[index],
        numberUnread: (state.conversations[index].numberUnread || 0) + 1,
      };
    },

    updateTimeForConver: (
      state: ChatState,
      action: PayloadAction<{
        isOnline: boolean;
        id: string;
        lastLogin: string;
      }>,
    ) => {
      const { isOnline, id, lastLogin } = action.payload;

      const index = state.conversations.findIndex(
        (conversation) => conversation._id === id,
      );
      if (index === -1) {
        console.error(`Conversation with ID ${id} not found`);
        return;
      }

      state.conversations[index] = {
        ...state.conversations[index],
        isOnline,
        lastLogin,
      };
    },
    updateLastViewOfMembers: (
      state: ChatState,
      action: PayloadAction<{
        conversationId?: string;
        userId: string;
        lastView: string;
        channelId?: string;
      }>,
    ) => {
      const { conversationId, userId, lastView, channelId } = action.payload;

      if (channelId && state.currentChannel === channelId) {
        const index = state.lastViewOfMember.findIndex(
          (member) => member.user._id === userId,
        );
        if (index !== -1) {
          state.lastViewOfMember[index].lastView = lastView;
        } else {
          console.error(`Member with userId ${userId} not found in channel`);
        }
      } else if (
        conversationId === state.currentConversation &&
        !state.currentChannel
      ) {
        const index = state.lastViewOfMember.findIndex(
          (member) => member.user._id === userId,
        );
        if (index !== -1) {
          state.lastViewOfMember[index].lastView = lastView;
        } else {
          console.error(
            `Member with userId ${userId} not found in conversation`,
          );
        }
      }
    },

    updateChannel: (
      state: ChatState,
      action: PayloadAction<{
        _id: string;
        name: string;
        createdAt: string;
      }>,
    ) => {
      const { _id, name, createdAt } = action.payload;

      state.channels = [{ _id, name, createdAt }, ...state.channels];
    },

    setCurrentChannel: (state: ChatState, action: PayloadAction<string>) => {
      state.currentChannel = action.payload;
    },

    removeChannel: (
      state: ChatState,
      action: PayloadAction<{
        channelId: string;
      }>,
    ) => {
      const { channelId } = action.payload;

      state.channels = state.channels.filter(
        (channel) => channel._id !== channelId,
      );
    },

    updateNameChannel: (
      state: ChatState,
      action: PayloadAction<{
        name: string;
        channelId: string;
      }>,
    ) => {
      const { name, channelId } = action.payload;

      const index = state.channels.findIndex(
        (channel) => channel._id === channelId,
      );
      if (index === -1) {
        console.error(`Channel with ID ${channelId} not found`);
        return;
      }

      state.channels[index] = { ...state.channels[index], name };
    },

    updateAvavarConver: (
      state: ChatState,
      action: PayloadAction<{
        conversationId: string;
        conversationAvatar: string;
      }>,
    ) => {
      const { conversationId, conversationAvatar } = action.payload;

      const index = state.conversations.findIndex(
        (conversation) => conversation._id === conversationId,
      );
      if (index === -1) {
        console.error(`Conversation with ID ${conversationId} not found`);
        return;
      }

      const conversation = state.conversations[index];
      if ('avatar' in conversation) {
        state.conversations[index] = {
          ...conversation,
          avatar: conversationAvatar,
        } as IIndividualConversation;
      } else {
        // TODO: Handle group conversation
        console.error('The conversation type does not support avatar update.');
      }
    },

    updateVoteMessage: (state: ChatState, action) => {
      const { voteMessage } = action.payload;

      const index = state.messages.findIndex(
        (message) => message._id === voteMessage._id,
      );
      if (index !== -1) {
        state.messages[index] = voteMessage;
      }
    },

    updateFriendChat: (
      state: ChatState,
      action: PayloadAction<{
        id: string;
      }>,
    ) => {
      const id = action.payload;

      state.friends = state.friends.filter((friend) => friend._id !== id.id);
    },

    deletedMember: (
      state: ChatState,
      action: PayloadAction<{
        conversationId: string;
      }>,
    ) => {
      const { conversationId } = action.payload;

      const index = state.conversations.findIndex(
        (conversation) => conversation._id === conversationId,
      );
      if (index !== -1) {
        state.conversations[index].totalMembers = Math.max(
          state.conversations[index].totalMembers - 1,
          0,
        );
      }
    },

    addManagers: (
      state: ChatState,
      action: PayloadAction<{
        conversationId: string;
        managerIds: string[];
      }>,
    ) => {
      const { conversationId, managerIds } = action.payload;

      if (conversationId === state.currentConversation) {
        const index = state.conversations.findIndex(
          (conversation) => conversation._id === conversationId,
        );
        if (index !== -1) {
          state.conversations[index] = {
            ...state.conversations[index],
            managerIds: Array.from(
              new Set([
                ...state.conversations[index].managerIds,
                ...managerIds,
              ]),
            ),
          };
        }
      }
    },

    deleteManager: (
      state: ChatState,
      action: PayloadAction<{ conversationId: string; managerIds: string[] }>,
    ) => {
      const { conversationId, managerIds } = action.payload;

      if (conversationId === state.currentConversation) {
        const index = state.conversations.findIndex(
          (conversation) => conversation._id === conversationId,
        );

        if (index !== -1) {
          const tempManagerIds = state.conversations[index].managerIds.filter(
            (managerId) => !managerIds.includes(managerId),
          );

          state.conversations[index] = {
            ...state.conversations[index],
            managerIds: tempManagerIds,
          };
        }
      }
    },

    updateVote: (state: ChatState, action: PayloadAction<any[]>) => {
      state.votes = action.payload;
    },

    updateMemberInconver: (
      state: ChatState,
      action: PayloadAction<{ conversationId: string; newMember: any[] }>,
    ) => {
      const { conversationId, newMember } = action.payload;

      state.memberInConversation = newMember;

      const index = state.conversations.findIndex(
        (conversation) => conversation._id === conversationId,
      );
      if (index !== -1) {
        state.conversations[index].totalMembers = newMember.length;
      }
    },

    updateAvatarWhenUpdateMember: (
      state: ChatState,
      action: PayloadAction<{
        conversationId: string;
        avatar: any;
        totalMembers: number;
      }>,
    ) => {
      const { conversationId, avatar, totalMembers } = action.payload;

      const index = state.conversations.findIndex(
        (conversation) => conversation._id === conversationId,
      );
      if (index !== -1) {
        state.conversations[index].totalMembers = totalMembers;

        if (typeof state.conversations[index].avatar === 'object') {
          state.conversations[index].avatar = avatar;
        }
      }
    },

    addTypingUser: (state, action: PayloadAction<IUser>) => {
      const user = action.payload;
      if (!state.usersTyping.find((u) => u._id === user._id)) {
        state.usersTyping.push(user);
      }
    },

    removeTypingUser: (state, action: PayloadAction<IUser>) => {
      state.usersTyping = state.usersTyping.filter(
        (u) => u._id !== action.payload._id,
      );
    },

    clearTypingUsers: (state) => {
      state.usersTyping = [];
    },

    setLastViewOfMember: (state, action: PayloadAction<any[]>) => {
      state.lastViewOfMember = action.payload;
    },

    setReplyMessage: (
      state,
      action: PayloadAction<ILastGroupMessage | ILastIndividualMessage>,
    ) => {
      state.replyMessage = action.payload;
    },

    clearReplyMessage: (state) => {
      state.replyMessage = null;
    },

    deleteMessage: (state, action: PayloadAction<string>) => {
      const messageId = action.payload;
      state.messages = state.messages.filter((msg) => msg._id !== messageId);
    },
    setInfoPanelOpen: (state, action: PayloadAction<boolean>) => {
      state.isInfoPanelOpen = action.payload;
    },
    toggleInfoPanel: (state) => {
      state.isInfoPanelOpen = !state.isInfoPanelOpen;
    },
  },
});

export const {
  addMessage,
  setMessages,
  setChannels,
  setIdNewMessage,
  setFriends,
  removeConversation,
  setTypeOfConversation,
  setRaisePage,
  setRedoMessage,
  deleteMessageClient,
  setToTalUnread,
  setReactionMessage,
  leaveGroup,
  isDeletedFromGroup,
  setCurrentConversation,
  setConversations,
  setNumberUnreadForNewFriend,
  updateTimeForConver,
  updateNameOfConver,
  updateLastViewOfMembers,
  updateChannel,
  setCurrentChannel,
  addMessageInChannel,
  updateNameChannel,
  updateAvavarConver,
  removeChannel,
  setTotalChannelNotify,
  updateVoteMessage,
  updateFriendChat,
  deletedMember,
  updateVote,
  addManagers,
  deleteManager,
  updateMemberInconver,
  updateAvatarWhenUpdateMember,
  addTypingUser,
  clearTypingUsers,
  removeTypingUser,
  setPinMessages,
  setLastViewOfMember,
  setMemberInConversation,
  setReplyMessage,
  clearReplyMessage,
  deleteMessage,
  setInfoPanelOpen,
  toggleInfoPanel,
} = chatSlice.actions;

export default chatSlice.reducer;
