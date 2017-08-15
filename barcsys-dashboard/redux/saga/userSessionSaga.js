import {
  FRAME_LOAD_MENUDATA,
  FRAME_UPDATE_REFRESH,
  FRAME_USER_LOGIN,
  FRAME_USER_TOKEN_ERROR,
  FRAME_USER_LOGOUT,
  FRAME_PAGE_JUMP
} from "../actionTypes";
import {
  take,
  put,
  call,
  fork,
  select,
  all,
  takeLatest
} from "redux-saga/effects";
import { auth } from "appconfig/settings";
import { guardianUrl } from "appconfig/apiUrl";
import { gGet, gPost, gPut } from "../../commons/httpFunc";
import { app } from "appconfig/settings";

function* userLogin() {
  while (true) {
    const { uniId, pwd } = yield take(FRAME_USER_LOGIN);
  }
}
function* userLogout() {
  while (true) {
    yield take(FRAME_USER_LOGOUT);
    let token = sessionStorage.getItem("X-Session-Token");
    sessionStorage.removeItem("X-Session-Token");
    window.location = guardianUrl + "/logout?token=" + token;
  }
}

function* tockenError() {
  while (true) {
    yield take(FRAME_USER_TOKEN_ERROR);
    sessionStorage.removeItem("X-Session-Token");
    if (window.location.pathname !== "/" + app.contextRoot + "/login") {
      sessionStorage.setItem("backUrl", window.location.pathname);
    }
    yield put({ type: FRAME_UPDATE_REFRESH, state: { userInfo: null } });
    yield put({ type: FRAME_PAGE_JUMP, url: "/" + app.contextRoot + "/login" });
  }
}

export default function* userSessionSaga() {
  yield 
  yield all([fork(tockenError), fork(userLogin), fork(userLogout)]);
}
