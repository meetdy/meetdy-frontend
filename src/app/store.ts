import global from './globalSlice';
import chat from './chatSlice';

import { configureStore } from '@reduxjs/toolkit';

const rootReducer = {
  global,
  chat,
};

const store = configureStore({
  reducer: rootReducer,
});

export default store;
