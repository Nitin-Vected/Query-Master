// src/features/user/userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./api/userTypes";

interface UserState {
  data: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Action to initiate fetching user
    fetchUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Action for successful fetching of user
    fetchUserSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.data = action.payload;
    },
    // Action for failed fetching of user
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const { fetchUserRequest, fetchUserSuccess, fetchUserFailure } =
  userSlice.actions;

// Export reducer
export default userSlice.reducer;
