import global from './globalSlice';
import account from '@/features/Account/accountSlice';
import chat from '@/features/Chat/slice/chatSlice';
import friend from '@/features/Friend/friendSlice';
import media from '@/features/Chat/slice/mediaSlice';

import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {
  global,
  account,
  chat,
  friend,
  media,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
