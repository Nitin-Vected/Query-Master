import { takeLatest, put, call } from "redux-saga/effects";
import { loginSuccess, loginFailure } from "./authSlice"; // Example actions

// Example saga for handling login
function* loginSaga(action) {
  try {
    const response = yield call(apiLogin, action.payload); // Call an API function
    yield put(loginSuccess(response)); // Dispatch success action
  } catch (error) {
    yield put(loginFailure(error)); // Dispatch failure action
  }
}

// Watcher saga
export default function* authSaga() {
  yield takeLatest("auth/loginRequest", loginSaga); // Watch for the login request action
}
