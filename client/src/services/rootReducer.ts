// features/index.ts
import { combineReducers } from "redux";
import userSlice from "./userSlice.ts";

const rootReducer = combineReducers({
  user: userSlice,
  // Add more reducers here if needed
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
