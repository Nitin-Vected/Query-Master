// sagas/rootSaga.ts
import { all } from "redux-saga/effects";
import { watchFetchUser } from "./userSaga";

export default function* rootSaga() {
  yield all([
    watchFetchUser(), // Add other sagas here if needed
  ]);
}
