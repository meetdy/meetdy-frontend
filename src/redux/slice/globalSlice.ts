import { IUserProfile } from '@/models/auth.model';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const KEY = 'global';

interface GlobalState {
  isLoading: boolean;
  isLogin: boolean;
  user: IUserProfile | null;
  isJoinChatLayout: boolean;
  isJoinFriendLayout: boolean;
  tabActive: number;
  conversationInfo: string | null;
  numberOfNotification: number;
}

const initialState: GlobalState = {
  isLoading: false,
  isLogin: false,
  user: null,
  isJoinChatLayout: false,
  isJoinFriendLayout: false,
  tabActive: 0,
  conversationInfo: null,
  numberOfNotification: 0,
};

const globalSlice = createSlice({
  name: KEY,
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    setJoinChatLayout: (state, action: PayloadAction<boolean>) => {
      state.isJoinChatLayout = action.payload;
    },
    setJoinFriendLayout: (state, action: PayloadAction<boolean>) => {
      state.isJoinFriendLayout = action.payload;
    },
    setTabActive: (state, action: PayloadAction<number>) => {
      state.tabActive = action.payload;
    },
    setNumberOfNotification: (state, action: PayloadAction<number>) => {
      state.numberOfNotification = action.payload;
    },
    setAvatarProfile: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.avatar = action.payload;
      }
    },
    setConversationInfo: (state, action: PayloadAction<string | null>) => {
      state.conversationInfo = action.payload;
    },
    setUser: (state, action: PayloadAction<IUserProfile>) => {
      state.isLogin = true;
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.isLogin = false;
      state.user = null;
      localStorage.removeItem('token');
    },
    updateUserProfile: (
      state,
      action: PayloadAction<Partial<IUserProfile>>,
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },
});

const { reducer, actions } = globalSlice;
export const {
  setLoading,
  setLogin,
  setJoinChatLayout,
  setJoinFriendLayout,
  setTabActive,
  setAvatarProfile,
  setUser,
  setConversationInfo,
  clearUser,
  updateUserProfile,
  setNumberOfNotification,
} = actions;
export default reducer;
