import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import mediaApi from 'api/mediaApi';

const KEY = 'MEDIA';

export const fetchAllMedia = createAsyncThunk(
    `${KEY}/fetchAllMedia`,
    async ({ conversationId }, thunkApi) => {
        const media = await mediaApi.fetchAllMedia(conversationId);
        return media;
    }
);

const initialState = {
    media: {},
    isLoading: false,
};

const mediaSlice = createSlice({
    name: KEY,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllMedia.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllMedia.fulfilled, (state, action) => {
                state.isLoading = false;
                state.media = action.payload;
            })
            .addCase(fetchAllMedia.rejected, (state) => {
                state.isLoading = false;
            });
    },
});

export default mediaSlice.reducer;
