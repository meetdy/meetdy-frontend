import { createSlice } from '@reduxjs/toolkit';

const KEY = 'ADMIN';

const adminSlice = createSlice({
    name: KEY,
    initialState: {
        isLoading: false,
    },
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

const { reducer, actions } = adminSlice;
export const { setLoading } = actions;

export default reducer;
