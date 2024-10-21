// src/slices/leadSlice.js
import { createSlice } from "@reduxjs/toolkit";

const leadSlice = createSlice({
  name: "lead",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchLeadDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchLeadDataSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchLeadDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchLeadDataStart,
  fetchLeadDataSuccess,
  fetchLeadDataFailure,
} = leadSlice.actions;

export default leadSlice.reducer;
