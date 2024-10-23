// src/slices/leadSlice.js
import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
    name: "order",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        fetchOrderDataStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchOrderDataSuccess(state, action) {
            state.loading = false;
            state.data = action.payload;
        },
        fetchOrderDataFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchOrderDataStart,
    fetchOrderDataSuccess,
    fetchOrderDataFailure,
} = orderSlice.actions;

export default orderSlice.reducer;
