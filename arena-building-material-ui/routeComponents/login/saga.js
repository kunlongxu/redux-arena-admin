import { all, call } from "redux-saga/effects";
import {
  getSceneState,
  getSceneActions,
  setSceneState,
  takeLatestSceneAction
} from "redux-arena/sagaOps";
import { INITUSER_AND_BACK } from "./actionTypes";
import { auth, app } from "arena-building-appconfig/settings";
import { guardianAuth } from "arena-building-appconfig/apiUrl";
import { gGet, gPost, gPut } from "../../commons/httpFunc";
import { transFromGuardianMenu, transFromRouteConfig } from "./menuTansformers";
import { parseMenusData, buildBreadcrumbDict } from "./parseMenusData";

function* fetchGuardianMenu(token) {
  let menusData;
  try {
    let { data } = yield call(gGet, guardianAuth.menus + "&token=" + token);
    let { iconDict } = yield getSceneState("frame");
    if (data != null) {
      menusData = { path: app.contextRoot, name: "root", icon: null };
      menusData.subMenus = transFromGuardianMenu(
        data,
        "/" + app.contextRoot,
        iconDict
      );
    }
  } catch (err) {
    console.error(err);
  }
  return menusData;
}

function* fetchGuardianSession(token) {
  let userInfo;
  try {
    const { data, code } = yield call(
      gGet,
      guardianAuth.session + "?token=" + token
    );
    if (code === "success") {
      userInfo = data;
    }
  } catch (err) {
    console.error(err);
  }
  return userInfo;
}

function* loadUserInfoData({ token }) {
  let { rootRoute } = yield* getSceneState("frame");
  let frameActions = yield* getSceneActions("frame");
  frameActions.setState({ isLoadingUserInfo: true });
  let menusData, userInfo;
  let isUserInfoLegal = false;
  if (auth.type === "local") {
    [menusData, userInfo] = [transFromRouteConfig(rootRoute), { name: "本地用户" }];
  } else {
    let newerToken = token || sessionStorage.getItem("X-Session-Token");
    if (newerToken != null) {
      [menusData, userInfo] = yield all([
        call(fetchGuardianMenu, newerToken),
        call(fetchGuardianSession, newerToken)
      ]);
    }
  }
  isUserInfoLegal = menusData && userInfo;
  if (isUserInfoLegal) {
    let [breadcrumbDict] = parseMenusData(menusData, [buildBreadcrumbDict]);
    frameActions.setState({ menusData, userInfo, breadcrumbDict });
  }
  frameActions.setState({ isLoadingUserInfo: false });
  return isUserInfoLegal;
}

function* initUserAndBack({ token, backUrl }) {
  yield* setSceneState({
    isUserLegal: "pending"
  });
  let isUserLegal = yield* loadUserInfoData({ token });
  let frameActions = yield* getSceneActions("frame");
  if (isUserLegal) {
    sessionStorage.setItem("X-Session-Token", token);
    sessionStorage.removeItem("backUrl");
    yield* setSceneState({
      isUserLegal: "true"
    });
    frameActions.goToUrl(backUrl);
  } else {
    yield setSceneState({
      isUserLegal: "false"
    });
  }
}
export default function* saga() {
  yield* takeLatestSceneAction(INITUSER_AND_BACK, initUserAndBack);
}
