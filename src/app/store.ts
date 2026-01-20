import global from './globalSlice';
import chat from './chatSlice';
import friend from './friendSlice';
import media from './mediaSlice';

import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {
  global,
  chat,
  friend,
  media,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
