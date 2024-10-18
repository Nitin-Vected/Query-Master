// features/user/userSaga.ts
import { call, put, takeLatest } from "redux-saga/effects";

import { fetchUserApi } from "./api/userApi";
import { User } from "./api/userTypes";
import { fetchUserFailure, fetchUserSuccess } from "./userSlice.ts";

// Define a generator type for your saga
type SagaReturnType = Generator<any, void, any>;

function* fetchUserSaga(): any {
  try {
    const data: User = yield call(fetchUserApi); // Specify that the data returned is of type User
    yield put(fetchUserSuccess(data));
  } catch (error: any) {
    yield put(fetchUserFailure(error.message));
  }
}

// Watcher saga
export function* watchFetchUser(): SagaReturnType {
  yield takeLatest(fetchUserSaga, fetchUserSaga);
}
