import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  email: string;
  name: string;
  token: string;
  role: string;
}

interface AuthState {
  userData: UserData | null;
  loading: boolean;
  error: string | null; // Add error state
}

const initialState: AuthState = {
  userData: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearUserData(state) {
      console.log("clearUserData", state);
      state.userData = initialState.userData;
    },
    loginWithGoogle(state) {
      state.loading = true; // Set loading to true when logging in
    },
    loginWithGoogleSuccess(state, action: PayloadAction<UserData>) {
      console.log("sss", action.payload);
      state.userData = action.payload; // Set user data on success
      state.loading = false; // Stop loading
      state.error = null; // Clear error
    },
    loginWithGoogleFailure(state, action: PayloadAction<string>) {
      state.loading = false; // Stop loading
      state.error = action.payload; // Set error message
    },
  },
});

export const {
  setLoading,
  clearUserData,
  loginWithGoogle,
  loginWithGoogleSuccess,
  loginWithGoogleFailure,
} = authSlice.actions;

export default authSlice.reducer;
