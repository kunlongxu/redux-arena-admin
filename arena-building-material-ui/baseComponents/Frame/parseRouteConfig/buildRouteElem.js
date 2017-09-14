import React from "react";
import { Redirect } from "react-router-dom";
import { RouteScene } from "redux-arena";
import ABRouteScene from "../../ABRouteScene";
import { calcAbsolutePath } from "../../../commons/routerFunc";

export function map(rootRoute, lastTuple = [""]) {
  let curPath = calcAbsolutePath(lastTuple[0], rootRoute.path);
  let routeElem;
  if (rootRoute.indexRoutePath != null) {
    routeElem = (
      <Redirect
        key={curPath}
        exact
        from={curPath}
        to={rootRoute.indexRoutePath}
      />
    );
  } else if (rootRoute.bundle != null || rootRoute.asyncBundle != null) {
    if (rootRoute.isLoginFree == true) {
      routeElem = (
        <RouteScene
          key={curPath}
          path={curPath}
          exact
          sceneBundle={rootRoute.bundle}
          asyncSceneBundle={rootRoute.asyncBundle}
        />
      );
    } else {
      routeElem = (
        <ABRouteScene
          key={curPath}
          exact
          path={curPath}
          sceneBundle={rootRoute.bundle}
          asyncSceneBundle={rootRoute.asyncBundle}
        />
      );
    }
  }
  return [curPath, routeElem];
}

export function reduce(prev, cur) {
  return cur[1] == null ? prev : prev.concat(cur[1]);
}

export const defaultValue = [];
