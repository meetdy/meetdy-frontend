/**
 * chatUiSlice – Minimal Redux slice for chat UI-only state.
 *
 * ## What stays in Redux (UI state)
 * - currentConversation / currentChannel selection
 * - conversation `type` (group vs individual flag)
 * - typing indicators
 * - info panel open/close
 *
 * ## What moved to React Query (server state)
 * - conversations list        → useConversations()
 * - messages                  → useMessages()
 * - memberInConversation      → useGetMemberInConversation()
 * - lastViewOfMember          → useGetLastViewOfMembers()
 * - channels                  → useGetChannel()
 * - pinMessages               → usePinnedMessages()
 *
 * The old `chatSlice.ts` (both src/app/ and src/redux/slice/chat/) can be
 * deleted once all consumers are migrated to this file + React Query hooks.
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatUiState {
  currentConversation: string;
  currentChannel: string;
  type: boolean; // true = group, false = individual
  isInfoPanelOpen: boolean;
  usersTyping: Array<{ _id: string; name: string }>;
}

const initialState: ChatUiState = {
  currentConversation: '',
  currentChannel: '',
  type: false,
  isInfoPanelOpen: true,
  usersTyping: [],
};

const chatUiSlice = createSlice({
  name: 'chatUi',
  initialState,
  reducers: {
    setCurrentConversation(state, action: PayloadAction<string>) {
      state.currentConversation = action.payload;
      // Reset typing when switching conversations
      state.usersTyping = [];
    },

    setCurrentChannel(state, action: PayloadAction<string>) {
      state.currentChannel = action.payload;
    },

    setConversationType(state, action: PayloadAction<boolean>) {
      state.type = action.payload;
    },

    setInfoPanelOpen(state, action: PayloadAction<boolean>) {
      state.isInfoPanelOpen = action.payload;
    },

    toggleInfoPanel(state) {
      state.isInfoPanelOpen = !state.isInfoPanelOpen;
    },

    addTypingUser(state, action: PayloadAction<{ _id: string; name: string }>) {
      const user = action.payload;
      if (!state.usersTyping.find((u) => u._id === user._id)) {
        state.usersTyping.push(user);
      }
    },

    removeTypingUser(state, action: PayloadAction<string>) {
      state.usersTyping = state.usersTyping.filter(
        (u) => u._id !== action.payload,
      );
    },

    clearTypingUsers(state) {
      state.usersTyping = [];
    },
  },
});

export const {
  setCurrentConversation,
  setCurrentChannel,
  setConversationType,
  setInfoPanelOpen,
  toggleInfoPanel,
  addTypingUser,
  removeTypingUser,
  clearTypingUsers,
} = chatUiSlice.actions;

export default chatUiSlice.reducer;
