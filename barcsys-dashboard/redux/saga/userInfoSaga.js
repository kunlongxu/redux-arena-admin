import {
  FRAME_LOAD_MENUDATA,
  FRAME_UPDATE_REFRESH,
  FRAME_USER_TOKEN_ERROR,
  PAGE_SET_CUR_MENU_DATA,
  FRAME_PAGE_JUMP,
  FRAME_VALIDATE_USER
} from "../actionTypes";
import {
  takeLatest,
  takeEvery,
  take,
  put,
  call,
  fork,
  all,
  select
} from "redux-saga/effects";
import { delay, eventChannel, END } from "redux-saga";
import { auth, app } from "appconfig/settings";
import { guardianAuth } from "appconfig/apiUrl";
import { gGet, gPost, gPut } from "../../commons/httpFunc";

function changeGuardianMenuToRoute(guardianData) {
  if (guardianData == null) return null;
  return guardianData.map(item => {
    let childRoute = {
      name: item.name,
      icon: item.icon,
      path: item.url
    };
    childRoute.childRoutes = changeGuardianMenuToRoute(item.subMenus);
    return childRoute;
  });
}

function* fetchGuardianMenu(token) {
  let isMenuLegal = false;
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: { isLoadingMenu: true }
  });
  try {
    let { data } = yield call(gGet, guardianAuth.menus + "&token=" + token);
    console.log("code---------");
    if (data != null) {
      let menusData = { path: app.contextRoot, name: "root", icon: null };
      menusData.childRoutes = changeGuardianMenuToRoute(data);
      yield put({
        type: FRAME_UPDATE_REFRESH,
        state: { menusData: menusData, isLoadingMenu: false }
      });
      isMenuLegal = true;
    } else {
      yield put({
        type: FRAME_USER_TOKEN_ERROR
      });
    }
  } catch (err) {
    console.error(err);
  }
  return isMenuLegal;
}

function* fetchGuardianSession(token) {
  let isSessionLegal = false;
  try {
    const { data, code } = yield call(
      gGet,
      guardianAuth.session + "?token=" + token
    );
    if (code === "success") {
      console.log("code---------");
      isSessionLegal = true;
      yield put({
        type: FRAME_UPDATE_REFRESH,
        state: { userInfo: data }
      });
    } else {
      yield put({
        type: FRAME_USER_TOKEN_ERROR
      });
    }
  } catch (err) {
    console.error(err);
  }
  return isSessionLegal;
}

export function* loadUserInfoData({ token }) {
  let { rootRoute } = yield select(state => state.frame);
  let isUserInfoLegal = false;
  if (auth.type === "local") {
    yield put({
      type: FRAME_UPDATE_REFRESH,
      state: { menusData: rootRoute, userInfo: { name: "本地用户" } }
    });
    isUserInfoLegal = true;
  } else {
    let newerToken = token;
    if (newerToken != null) {
      console.log("load user menu and session");
      let [isMenuLegal, isSessionLegal] = yield all([
        call(fetchGuardianMenu, newerToken),
        call(fetchGuardianSession, newerToken)
      ]);
      console.log("成功了");
      isUserInfoLegal = isMenuLegal && isSessionLegal;
    } else {
      yield put({
        type: FRAME_USER_TOKEN_ERROR
      });
    }
  }
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: { isLoadingUser: false }
  });
  return isUserInfoLegal;
}

function* validUser({cb}) {
  let { userInfo } = yield select(state => state.frame);
  if (userInfo != null) {
    cb(true);
  } else {
    cb(false);
  }
}

export default function* userMenuSaga() {
  yield takeEvery(FRAME_VALIDATE_USER, validUser);
  yield takeLatest(FRAME_LOAD_MENUDATA, loadUserInfoData);
}
