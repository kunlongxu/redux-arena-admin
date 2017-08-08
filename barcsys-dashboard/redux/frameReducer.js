import React, { Component } from "react";
import {
  FRAME_UPDATE_REFRESH,
  FRAME_UPDATE_NOREFRESH,
  FRAME_SNACKBAR_SHOW,
  FRAME_SNACKBAR_CLOSE,
  FRAME_REFRESH
} from "./actionTypes.js";
import { calcFrameSize } from "./layoutCalc";
import { emptyPageSaga, emptyPageReducer } from "./saga/pageReduxSaga";
import { FULLSCREEN } from "../displayModes";

let frameSize = calcFrameSize(window.innerWidth);
const displayAttr = {
  leftNavOpenFlag: frameSize === "largeL" ? true : false,
  frameSize: frameSize,
  navDialogOpenFlag: false,
  snackbar: {
    showFlag: false,
    message: "",
    actionText: null,
    acceptTime: new Date().getTime(),
    startTime: new Date().getTime(),
    closeTime: new Date().getTime()
  },
  isLoadingMenu: false,
  isLoadingUser: false,
  pageWidth: window.innerWidth,
  pageHeight: window.innerHeight - 64,
  pageLoading: { progress: 0, loadFlag: false },
  themeType: localStorage.getItem("themeType") || "light",
  isRightDrawerExist: false,
  isRightDrawerOpen: false,
  RightDrawerChildren: null,
  displayMode: FULLSCREEN
};

const functionAttr = {
  history: null,
  resizeHandler: null
};

const pageAttr = {
  pageBirthTime: 0,
  isHotPatched: false,
  PageCom: null,
  customReduxDict: {},
  pageSaga: emptyPageSaga,
  pageReducer: emptyPageReducer,
  match: {
    isExact: true,
    params: {},
    path: "*",
    url: "*"
  },
  routerComs: [],
  location: null
};

const dataAttr = {
  historyPageState: {},
  menusData: { path: "/", childRoutes: [] },
  userInfo: null,
  footprint: null,
  jumpHistory: [],
  breadcrumb: [],
  pageContainerCom: null,
  rootRoute: null,
  userAppData: []
};

const initialState = Object.assign(
  {},
  pageAttr,
  displayAttr,
  functionAttr,
  dataAttr
);

export default function frameReducer(state = initialState, action) {
  switch (action.type) {
    case FRAME_UPDATE_REFRESH:
      return Object.assign({}, state, action.state);

    case FRAME_UPDATE_NOREFRESH:
      return Object.assign(state, action.state);

    case FRAME_REFRESH:
      return Object.assign({}, state);

    default:
      return state;
  }
}
