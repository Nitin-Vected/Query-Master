// src/slices/leadSlice.js
import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchAllProductsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchAllProductsSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchAllProductsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAllProductsStart,
  fetchAllProductsSuccess,
  fetchAllProductsFailure,
} = productSlice.actions;

export default productSlice.reducer;
