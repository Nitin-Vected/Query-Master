import { createSlice } from "@reduxjs/toolkit";

const transactionSlice = createSlice({
    name: "transaction",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        fetchTransactionDataStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchTransactionDataSuccess(state, action) {
            state.loading = false;
            state.data = action.payload;
        },
        fetchTransactionDataFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchTransactionDataStart,
    fetchTransactionDataSuccess,
    fetchTransactionDataFailure,
} = transactionSlice.actions;

export default transactionSlice.reducer;
