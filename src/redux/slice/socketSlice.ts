import { createSlice } from '@reduxjs/toolkit';

const KEY = 'socket';

export interface SocketState {
  isConnected: boolean;
  error: string | null;
}

const initialState: SocketState = {
  isConnected: false,
  error: null,
};

const socketSlice = createSlice({
  name: KEY,
  initialState,
  reducers: {
    socketConnecting: (state) => {
      state.isConnected = false;
      state.error = null;
    },
    connectionEstablished: (state) => {
      state.isConnected = true;
    },
    connectionLost: (state) => {
      state.isConnected = false;
    },
    socketError: (state, action) => {
      state.isConnected = false;
      state.error = action.payload;
    },
  },
});

export const {
  socketConnecting,
  connectionEstablished,
  connectionLost,
  socketError,
} = socketSlice.actions;
export default socketSlice.reducer;
