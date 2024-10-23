import { createSlice } from "@reduxjs/toolkit";

const studentSlice = createSlice({
    name: "student",
    initialState: {
        data: null,
        loading: false,
        error: null,
    },
    reducers: {
        fetchStudentDataStart(state) {
            state.loading = true;
            state.error = null;
        },
        fetchStudentDataSuccess(state, action) {
            state.loading = false;
            state.data = action.payload;
        },
        fetchStudentDataFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const {
    fetchStudentDataStart,
    fetchStudentDataSuccess,
    fetchStudentDataFailure,
} = studentSlice.actions;

export default studentSlice.reducer;
