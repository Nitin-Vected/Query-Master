// src/slices/leadSlice.js
import { createSlice } from "@reduxjs/toolkit";

const counsellorSlice = createSlice({
  name: "product",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchAllCounsellorsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllCounsellorsSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchAllCounsellorsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAllCounsellorsStart,
  fetchAllCounsellorsSuccess,
  fetchAllCounsellorsFailure,
} = counsellorSlice.actions;

export default counsellorSlice.reducer;
