// import chat from '@/redux/slice/chat/chatSlice';
import chatUi from '@/redux/slice/chatUiSlice';
// import media from '@/redux/slice/chat/mediaSlice';
import friend from '@/redux/slice/friendSlice';
import global from '@/redux/slice/globalSlice';
// import socket from '@/redux/slice/socketSlice';

import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  global,
  friend,
  // chat,
  chatUi,
  // media,
  // socket,
});

export default rootReducer;
