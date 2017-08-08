import {
  FRAME_PAGE_JUMP,
  FRAME_PAGE_BACKWARD,
  FRAME_NAV_DIALOG,
  FRAME_UPDATE_REFRESH
} from "../redux/actionTypes";
import { showMessage } from "./commonFunc";

export function enhenceAction(plainAction) {
  return Object.assign({}, plainAction, {
    jumpTo,
    backward,
    handleNavDialog,
    showMessage,
    handleRightDrawer,
    regRightDrawerChildren
  });
}

export function jumpTo(url, saveState) {
  return {
    type: FRAME_PAGE_JUMP,
    url,
    saveState
  };
}

function backward() {
  return {
    type: FRAME_PAGE_BACKWARD
  };
}

function handleNavDialog(flag) {
  return {
    type: FRAME_NAV_DIALOG,
    flag
  };
}

function handleRightDrawer(flag) {
  return {
    type: FRAME_UPDATE_REFRESH,
    state: { isRightDrawerOpen: flag }
  };
}

function regRightDrawerChildren(children) {
  return {
    type: FRAME_UPDATE_REFRESH,
    state: {
      isRightDrawerExist: true,
      isRightDrawerOpen: true,
      RightDrawerChildren: children
    }
  };
}
