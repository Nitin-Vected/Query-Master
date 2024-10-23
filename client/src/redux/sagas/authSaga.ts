import { call, put, takeLatest } from "redux-saga/effects";
import {
  loginWithGoogle,
  loginWithGoogleSuccess,
  loginWithGoogleFailure,
  setLoading,
} from "../slices/authSlice";
import { loginWithGoogleApi } from "../../services/api/userApi";

function* loginWithGoogleSaga(action: ReturnType<typeof loginWithGoogle>) {
  try {
    yield put(setLoading(true));
    const { access_token }: any = action.payload;
    const { data } = yield call(loginWithGoogleApi, access_token);
    console.log("Response Data:", data);
    const { userData, token } = data;
    const userDataObj = {
      email: userData.email,
      name: userData.name,
      token,
      role: userData.role,
    };
    yield put(loginWithGoogleSuccess(userDataObj));
  } catch (err: any) {
    console.error("Login failed:", err);
    const errorMessage =
      err.response?.data?.message || "An unexpected error occurred.";
    yield put(loginWithGoogleFailure(errorMessage));
  } finally {
    yield put(setLoading(false));
  }
}

export default function* rootSaga() {
  yield takeLatest(loginWithGoogle.type, loginWithGoogleSaga);
}
