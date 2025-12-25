import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import InfoWebApi from '@/api/infoWebApi';

const KEY = 'HOME';

// Async thunk
export const fetchInfoWebs = createAsyncThunk(
  `${KEY}/fetchInfoWebApp`,
  async () => {
    const data = await InfoWebApi.getInfoWeb();
    return data;
  },
);

const initialState: {
  developers: any[];
  infoApp: Record<string, any>;
  isLoading: boolean;
  features: any[];
  infoWebApps: Record<string, any>;
} = {
  developers: [],
  infoApp: {},
  isLoading: false,
  features: [],
  infoWebApps: {},
};

const homeSlice = createSlice({
  name: KEY,
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInfoWebs.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInfoWebs.fulfilled, (state, action) => {
        const data = action.payload;

        const findValue = (name: string) => {
          if (!Array.isArray(data)) return null;
          return data.find((ele: any) => ele.name === name)?.value ?? null;
        };

        state.infoWebApps = findValue('infoweb') || {};
        state.developers = findValue('developers') || [];
        state.infoApp = findValue('infoapp') || {};
        state.features = findValue('features') || [];
        state.isLoading = false;
      })
      .addCase(fetchInfoWebs.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setLoading } = homeSlice.actions;
export default homeSlice.reducer;
