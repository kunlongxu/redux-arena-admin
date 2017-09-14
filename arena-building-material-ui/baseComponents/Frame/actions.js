import { ARENA_SCENE_SET_STATE } from "redux-arena/actionTypes";
import {
  SET_ROOTROUTE,
  GO_TO_URL,
  OBVERSE_WINDOW_SIZE_START,
  OBVERSE_WINDOW_SIZE_END
} from "./actionTypes";
import { guardianUrl } from "arena-building-appconfig/apiUrl";
import { app } from "arena-building-appconfig/settings";

export function setState(state) {
  return {
    type: ARENA_SCENE_SET_STATE,
    state
  };
}

export function setRootRoute(rootRoute, preDefineRoutes) {
  return {
    type: SET_ROOTROUTE,
    rootRoute,
    preDefineRoutes
  };
}

export function goToUrl(url) {
  return {
    type: GO_TO_URL,
    url
  };
}

export function registerResizeHandler() {
  return {
    type: OBVERSE_WINDOW_SIZE_START
  };
}

export function unregisterResizeHandler() {
  return { type: OBVERSE_WINDOW_SIZE_START };
}

export function logout() {
  let token = sessionStorage.getItem("X-Session-Token");
  sessionStorage.removeItem("X-Session-Token");
  window.location.href =
    guardianUrl +
    "/logout/" +
    token +
    "?returnUrl=http://" +
    window.location.host +
    "/" +
    app.contextRoot +
    "/login";
}

export function handleLeftNav(isOpen) {
  return {
    type: ARENA_SCENE_SET_STATE,
    state: {
      isLeftNavOpen: isOpen
    }
  };
}
