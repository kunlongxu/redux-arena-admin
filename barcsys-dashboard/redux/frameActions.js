import ReactDOM from "react-dom";
import {
  FRAME_UPDATE_REFRESH,
  FRAME_UPDATE_NOREFRESH,
  FRAME_SNACKBAR_CLOSE,
  FRAME_LOAD_MENUDATA,
  FRAME_SNACKBAR_ADD,
  FRAME_REFRESH,
  PAGE_REFRESH,
  FRAME_HISTORY_REGISTER,
  FRAME_USER_LOGOUT,
  FRAME_CHANGE_THEME,
  FRAME_LEFTNAVBAR,
  FRAME_WINDOW_RESIZE,
  FRAME_SET_ROOTROUTE
} from "./actionTypes.js";
import React, { Component } from "react";
import { guardianUrl } from "appconfig/apiUrl";
import { auth } from "appconfig/settings";
import { gGet, gPost } from "../commons/httpFunc";
import { jumpTo } from "../commons/commonFunc";

export function setTheme(themeType) {
  return {
    type: FRAME_CHANGE_THEME,
    themeType
  };
}

export function registerHistory(history) {
  return {
    type: FRAME_HISTORY_REGISTER,
    history
  };
}

export function setPageState(state) {
  return {
    type: PAGE_UPDATE_NOREFRESH,
    state: state
  };
}

export function handleSnackbar(
  flag,
  message,
  action,
  timeStamp,
  delayFunc,
  failCb
) {
  if (flag === true) {
    return {
      type: FRAME_SNACKBAR_ADD,
      payload: {
        showFlag: true,
        message: message,
        actionText: action,
        delayFunc: delayFunc,
        timeStamp: timeStamp,
        failCb: failCb
      }
    };
  } else {
    return {
      type: FRAME_SNACKBAR_CLOSE
    };
  }
}

export function registerResizeHandler() {
  return (dispatch, getState) => {
    let resizeHandler = function(event) {
      dispatch({
        type: FRAME_WINDOW_RESIZE
      });
    };
    window.addEventListener("resize", resizeHandler);
  };
}

export function unregisterResizeHandler() {
  return (dispatch, getState) => {
    window.removeEventListener("resize", getState().frame.resizeHandler);
    dispatch({
      type: FRAME_UPDATE_NOREFRESH,
      state: {
        resizeHandler: null
      }
    });
  };
}

export function handleLeftNav(flag) {
  return {
    type: FRAME_LEFTNAVBAR,
    flag
  };
}

export function setUserInfo() {
  return {
    type: FRAME_LOAD_MENUDATA
  };
}

export function logout() {
  return {
    type: FRAME_USER_LOGOUT
  };
}

export function setBreadcrumb(breadcrumb) {
  return {
    type: FRAME_UPDATE_REFRESH,
    state: { breadcrumb }
  };
}

export function setRootRoute(rootRoute) {
  return {
    type: FRAME_SET_ROOTROUTE,
    rootRoute
  };
}
