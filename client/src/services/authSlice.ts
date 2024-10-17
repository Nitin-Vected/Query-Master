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
}

const initialState: AuthState = {
  userData: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData(state, action: PayloadAction<UserData>) {
      state.userData = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    clearUserData(state) {
      state.userData = initialState.userData;
    },
  },
});

export const { setUserData, setLoading, clearUserData } = authSlice.actions;
export default authSlice.reducer;
