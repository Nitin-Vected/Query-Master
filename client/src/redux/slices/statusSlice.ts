// src/slices/leadSlice.js
import { createSlice } from "@reduxjs/toolkit";

const statusSlice = createSlice({
  name: "status",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchAllStatusStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllStatusSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchAllStatusFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAllStatusStart,
  fetchAllStatusSuccess,
  fetchAllStatusFailure,
} = statusSlice.actions;

export default statusSlice.reducer;
