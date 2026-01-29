import global from './globalSlice';
import chat from './chatSlice';
import friend from './friendSlice';

import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {
  global,
  chat,
  friend,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
