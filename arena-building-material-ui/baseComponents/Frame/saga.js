import {
  getSceneState,
  getSceneActions,
  setSceneState,
  takeLatestSceneAction
} from "redux-arena/sagaOps";
import {
  ARENA_SCENEBUNDLE_LOAD_START,
  ARENA_SCENEBUNDLE_LOAD_COMPLETE
} from "redux-arena/actionTypes";
import {
  takeLatest,
  getContext,
  take,
  call,
  cancelled,
  cancel,
  race
} from "redux-saga/effects";
import { delay, eventChannel, END } from "redux-saga";
import {
  GO_TO_URL,
  SET_ROOTROUTE,
  OBVERSE_WINDOW_SIZE_START,
  OBVERSE_WINDOW_SIZE_END
} from "./actionTypes";
import {
  ARENABUILDING_WINDOW_RESIZE,
  ARENABUILDING_USER_TOKEN_ERROR
} from "../../actionTypes";
import {
  parseRouteConfig,
  buildRouteElem,
  buildIconDict,
  buildDisplayModeDict
} from "./parseRouteConfig";
import { isRoutable } from "../../commons/routerFunc";

function* goToUrl({ url }) {
  let { routeComs, history } = yield* getSceneState();
  if (history && isRoutable(routeComs, url)) {
    history.push(url);
  } else {
    window.location.href = url;
  }
}

function* setRootRoute({ rootRoute, preDefineRoutes }) {
  let newRootRoute = Object.assign({}, rootRoute);
  if (rootRoute.path !== "/") {
    newRootRoute.path = newRootRoute.path.substring(1);
    newRootRoute = {
      path: "/",
      childRoutes: [newRootRoute]
    };
  }
  if (newRootRoute.childRoutes == null) {
    newRootRoute.childRoutes = [];
  }
  newRootRoute.childRoutes = newRootRoute.childRoutes.concat(preDefineRoutes);
  let [routeComs, iconDict, displayModeDict] = parseRouteConfig(newRootRoute, [
    buildRouteElem,
    buildIconDict,
    buildDisplayModeDict
  ]);
  yield* setSceneState({
    rootRoute,
    routeComs,
    iconDict,
    displayModeDict
  });
}

function* setMatch({ arenaSwitchVReducerKey, notifyData }) {
  if (arenaSwitchVReducerKey !== "routerSwitch") return;
  yield* setSceneState({
    match: notifyData.match
  });
}

function* observeWindowSizeStart() {
  let store = yield getContext("store");
  let { resizeHandler } = yield* getSceneState();
  if (resizeHandler) {
    window.removeEventListener("resize", resizeHandler);
  }
  let newResizeHandler = function(event) {
    store.dispatch({
      type: ARENABUILDING_WINDOW_RESIZE,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight
    });
  };
  yield* setSceneState({ resizeHandler });
  window.addEventListener("resize", newResizeHandler);
}

function* observeWindowSizeEnd() {
  let { resizeHandler } = yield* getSceneState();
  window.removeEventListener("resize", resizeHandler);
}

function progress(pValue) {
  return eventChannel(emitter => {
    const iv = setInterval(() => {
      pValue += Math.random() * 10;
      if (pValue < 95) emitter(pValue);
      else {
        emitter(END);
      }
    }, 500);
    return () => {
      clearInterval(iv);
    };
  });
}

function* startLoadingBar({ arenaSwitchVReducerKey }) {
  if (arenaSwitchVReducerKey !== "routerSwitch") return;
  yield* setSceneState({
    pageLoadingInfo: { progress: 5, loadFlag: true }
  });
  const chan = yield call(progress, 5);
  try {
    while (true) {
      let { pValue, cancel } = yield race({
        pValue: take(chan),
        cancel: take(ARENA_SCENEBUNDLE_LOAD_COMPLETE)
      });
      if (cancel) {
        yield* stopLoadingBar();
        break;
      }
      yield* setSceneState({
        pageLoadingInfo: { progress: pValue, loadFlag: true }
      });
    }
  } finally {
    if (yield cancelled()) {
      //do nothing is good
    }
    chan.close();
  }
}

function* stopLoadingBar() {
  yield* setSceneState({
    pageLoadingInfo: { progress: 100, loadFlag: true }
  });
  yield delay(500);
  yield* setSceneState({
    pageLoadingInfo: { progress: 0, loadFlag: false }
  });
}

function* userTokenError() {
  yield* goToUrl("/login");
}

export default function* saga() {
  yield* takeLatestSceneAction(GO_TO_URL, goToUrl);
  yield* takeLatestSceneAction(SET_ROOTROUTE, setRootRoute);
  yield* takeLatestSceneAction(
    OBVERSE_WINDOW_SIZE_START,
    observeWindowSizeStart
  );
  yield* takeLatestSceneAction(OBVERSE_WINDOW_SIZE_END, observeWindowSizeEnd);
  yield takeLatest(ARENA_SCENEBUNDLE_LOAD_START, setMatch);
  yield takeLatest(ARENA_SCENEBUNDLE_LOAD_START, startLoadingBar);
  yield* takeLatestSceneAction(GO_TO_URL, goToUrl);
  yield takeLatest(ARENABUILDING_USER_TOKEN_ERROR, userTokenError);
}
