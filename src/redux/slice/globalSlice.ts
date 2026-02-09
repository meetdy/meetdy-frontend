import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  isLogin: false,
  user: null,
  isJoinChatLayout: false,
  isJoinFriendLayout: false,
  tabActive: 0,
  numberOfNotification: 0,
};

const globalSlice = createSlice({
  name: 'global',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setUser: (state, action) => {
      state.isLogin = true;
      state.user = action.payload;
    },
    setJoinChatLayout: (state, action) => {
      state.isJoinChatLayout = action.payload;
    },
    setJoinFriendLayout: (state, action) => {
      state.isJoinFriendLayout = action.payload;
    },
    setTabActive: (state, action) => {
      state.tabActive = action.payload;
    },
    setAvatarProfile: (state, action) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
    setNumberOfNotification: (state, action: PayloadAction<number>) => {
      state.numberOfNotification = action.payload;
    },
  },
});

export const {
  setLoading,
  setLogin,
  setUser,
  setJoinChatLayout,
  setJoinFriendLayout,
  setTabActive,
  setAvatarProfile,
  setNumberOfNotification,
} = globalSlice.actions;

export default globalSlice.reducer;
