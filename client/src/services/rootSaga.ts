// // sagas/rootSaga.ts
// import { all } from "redux-saga/effects";
// import { watchFetchUser } from "./userSaga";

// export default function* rootSaga() {
//   yield all([
//     watchFetchUser(), // Add other sagas here if needed
//   ]);
// }
import { all } from "redux-saga/effects";
import authSaga from "./authSaga"; // Example auth saga, you need to create this

// Root saga where you can combine all your sagas
export default function* rootSaga() {
  yield all([
    authSaga(), // Include your other sagas here
  ]);
}
