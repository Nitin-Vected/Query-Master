import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import queryReducer from "./querySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    queries: queryReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
