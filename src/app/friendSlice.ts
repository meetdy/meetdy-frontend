import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const KEY = 'friend';

interface FriendState {
  amountNotify: number;
}

const initialState: FriendState = {
  amountNotify: 0,
};

const friendSlice = createSlice({
  name: KEY,
  initialState,
  reducers: {
    setAmountNotify: (state, action: PayloadAction<number>) => {
      state.amountNotify = action.payload;
    },
    incrementNotify: (state) => {
      state.amountNotify += 1;
    },
    decrementNotify: (state) => {
      if (state.amountNotify > 0) {
        state.amountNotify -= 1;
      }
    },
    resetNotify: (state) => {
      state.amountNotify = 0;
    },
  },
});

const { reducer, actions } = friendSlice;

export const {
  setAmountNotify,
  incrementNotify,
  decrementNotify,
  resetNotify,
} = actions;

export default reducer;
