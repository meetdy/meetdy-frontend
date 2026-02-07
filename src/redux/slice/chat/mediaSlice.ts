import { IMedia } from '@/api/mediaApi';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MediaState {
  media: IMedia | null;
}

const initialState: MediaState = {
  media: null,
};

const mediaSlice = createSlice({
  name: 'MEDIA',
  initialState,
  reducers: {
    setMedia: (state, action: PayloadAction<IMedia>) => {
      state.media = action.payload;
    },
  },
});

const { reducer, actions } = mediaSlice;

export const { setMedia } = actions;
export default reducer;
