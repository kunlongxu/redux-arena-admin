import React from "react";
import { Redirect, Switch } from "react-router-dom";
import PrivateRoute from "../../PrivateRoute";
import PublicRoute from "../../PublicRoute";
import { NOMAL_PAGE, FULLSCREEN, ONLY_HEADER } from "../../displayModes";
import {
  FRAME_UPDATE_REFRESH,
  FRAME_SET_ROOTROUTE,
  FRAME_ROUTE_HOTREPLACE,
  FRAME_ROUTE_REFRESH
} from "../actionTypes";
import {
  takeLatest,
  takeEvery,
  take,
  put,
  call,
  fork,
  select,
  cancel
} from "redux-saga/effects";

function buildChildren(rootRoute, parentPath, hotReplaceData) {
  let children = [];
  if (rootRoute == null) return children;
  let absolutePath =
    rootRoute.path == null
      ? null
      : (parentPath + "/" + rootRoute.path.trim()).replace(/\/+/g, "/");
  let curPathHRData;
  if (hotReplaceData && hotReplaceData.path === absolutePath) {
    curPathHRData = hotReplaceData;
  }
  if (rootRoute.indexRoutePath != null) {
    children.push(
      <Redirect
        key={absolutePath}
        exact
        from={absolutePath}
        to={rootRoute.indexRoutePath}
      />
    );
  } else if (rootRoute.component != null) {
    if (rootRoute.isLoginFree == true) {
      children.push(
        <PublicRoute
          key={absolutePath}
          exact
          path={absolutePath}
          component={({ match, location, history }) =>
            <rootRoute.component
              {...{
                match,
                location,
                history,
                displayMode: rootRoute.displayMode || NOMAL_PAGE,
                hotReplaceData: curPathHRData
              }}
            />}
        />
      );
    } else {
      children.push(
        <PrivateRoute
          key={absolutePath}
          exact
          path={absolutePath}
          component={({ match, location, history }) =>
            <rootRoute.component
              {...{
                match,
                location,
                history,
                displayMode: rootRoute.displayMode || NOMAL_PAGE,
                hotReplaceData: curPathHRData
              }}
            />}
        />
      );
    }
  }
  if (rootRoute.childRoutes != null) {
    children = rootRoute.childRoutes
      .map(childRoute =>
        buildChildren(childRoute, absolutePath, hotReplaceData)
      )
      .reduce((prev, cur) => prev.concat(cur), children);
  }
  return children;
}

function* setRootRoute({ rootRoute }) {
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      rootRoute,
      routerComs: buildChildren(rootRoute, "")
    }
  });
}

function* routeHotReplace({ hotReplaceData }) {
  let { rootRoute } = yield select(state => state.frame);
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      routerComs: buildChildren(rootRoute, "", hotReplaceData)
    }
  });
}

function* routeRefresh() {
  let { rootRoute } = yield select(state => state.frame);
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      isHotPatched: false,
      routerComs: buildChildren(rootRoute, "")
    }
  });
}

export default function* resizeEventSaga() {
  yield takeLatest(FRAME_SET_ROOTROUTE, setRootRoute);
  yield takeEvery(FRAME_ROUTE_HOTREPLACE, routeHotReplace);
  yield takeLatest(FRAME_ROUTE_REFRESH, routeRefresh);
}
