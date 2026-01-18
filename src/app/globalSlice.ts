import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ServiceMe from '@/api/meApi';

const KEY = 'global';

// Async thunk
export const fetchUserProfile = createAsyncThunk(
  `${KEY}/fetchUser`,
  async (_, thunkApi) => {
    const user = await ServiceMe.getProfile();
    return user;
  },
);

const initialState = {
  isLoading: false,
  isLogin: false,
  user: null,
  isJoinChatLayout: false,
  isJoinFriendLayout: false,
  tabActive: 0,
};

const globalSlice = createSlice({
  name: KEY,
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setLogin: (state, action) => {
      state.isLogin = action.payload;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLogin = true;
        state.user = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state) => {
        state.isLoading = false;
        state.isLogin = false;
        localStorage.removeItem('token');
      });
  },
});

export const {
  setLoading,
  setLogin,
  setJoinChatLayout,
  setJoinFriendLayout,
  setTabActive,
  setAvatarProfile,
} = globalSlice.actions;

export default globalSlice.reducer;
