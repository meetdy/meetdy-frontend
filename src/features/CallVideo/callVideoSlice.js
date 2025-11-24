import { createSlice } from '@reduxjs/toolkit';

const KEY = 'CALL-VIDEO';

const callVideoSlice = createSlice({
    name: KEY,
    initialState: {},
    reducers: {},
});

const { reducer, actions } = callVideoSlice;

export default reducer;
