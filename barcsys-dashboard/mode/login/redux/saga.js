import {
  take,
  put,
  call,
  fork,
  select,
  cancelled,
  race,
  cancel,
  takeLatest
} from "redux-saga/effects";
import {
  PAGE_UPDATE_REFRESH,
  PAGE_UPDATE_NOREFRESH,
  FRAME_UPDATE_REFRESH,
  FRAME_PAGE_JUMP
} from "barcsys-dashboard/redux/actionTypes.js";
import { loadUserInfoData } from "barcsys-dashboard/redux/saga/userInfoSaga";
import { LOGIN_INITUSER_JUMP } from "./actionTypes";

function* initUserAndJump({ token, backUrl }) {
  if (!token) return;
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: {
      isUserLegal: "pending"
    }
  });
  console.log("isUserLegal", 123);
  let isUserLegal = yield* loadUserInfoData({ token });
  console.log("isUserLegal", isUserLegal);
  if (isUserLegal) {
    sessionStorage.setItem("X-Session-Token", token);
    sessionStorage.removeItem("backUrl");
    yield put({ type: FRAME_PAGE_JUMP, url: backUrl });
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        isUserLegal: "true"
      }
    });
  } else {
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        isUserLegal: "false"
      }
    });
  }
}
export default function* saga() {
  yield takeLatest(LOGIN_INITUSER_JUMP, initUserAndJump);
}
