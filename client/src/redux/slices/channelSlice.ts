// src/slices/leadSlice.js
import { createSlice } from "@reduxjs/toolkit";

const channelSlice = createSlice({
  name: "product",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchAllChannelsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllChannelsSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchAllChannelsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAllChannelsStart,
  fetchAllChannelsSuccess,
  fetchAllChannelsFailure,
} = channelSlice.actions;

export default channelSlice.reducer;
