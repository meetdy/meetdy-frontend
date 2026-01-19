import { configureStore } from '@reduxjs/toolkit';
import global from './globalSlice';
import account from '@/features/Account/accountSlice';
import chat from '@/features/Chat/slice/chatSlice';
import friend from '@/features/Friend/friendSlice';
import media from '@/features/Chat/slice/mediaSlice';
import home from '@/features/Home/homeSlice';

const rootReducer = {
  global,
  account,
  chat,
  friend,
  media,
  home,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
