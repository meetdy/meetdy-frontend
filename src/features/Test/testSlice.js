import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import conversationApi from '@/api/conversationApi';
import messageApi from '@/api/messageApi';

const KEY = 'chat';

// Fetch conversations
export const fetchListConversations = createAsyncThunk(
  `${KEY}/fetchListConversations`,
  async () => {
    const conversations = await conversationApi.fetchListConversations();
    return conversations;
  },
);

// Fetch messages for a conversation
export const fetchListMessages = createAsyncThunk(
  `${KEY}/fetchListMessages`,
  async ({ conversationId }) => {
    const messages = await messageApi.fetchListMessages(conversationId);
    return messages;
  },
);

const initialState = {
  isLoading: false,
  conversations: [],
  messages: [],
};

const chatSlice = createSlice({
  name: KEY,
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Conversations
      .addCase(fetchListConversations.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchListConversations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchListConversations.rejected, (state) => {
        state.isLoading = false;
      })

      // Messages
      .addCase(fetchListMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchListMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages = action.payload;
      })
      .addCase(fetchListMessages.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
