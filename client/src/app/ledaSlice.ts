// src/slices/ledaSlice.js
import { createSlice } from "@reduxjs/toolkit";

const ledaSlice = createSlice({
  name: "leda",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    fetchLedaDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchLedaDataSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchLedaDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchLedaDataStart,
  fetchLedaDataSuccess,
  fetchLedaDataFailure,
} = ledaSlice.actions;

export default ledaSlice.reducer;
