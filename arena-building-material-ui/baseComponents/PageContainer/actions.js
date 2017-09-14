import { ARENA_SCENE_SET_STATE } from "redux-arena/actionTypes";
import {
  PAGECONTAINER_RESIZE,
  SNACKBAR_CLOSE,
  SNACKBAR_MESSAGE_CANCEL,
  SNACKBAR_MESSAGE_PUSH,
  SNACKBAR_MESSAGE_SHOW
} from "./actionTypes";

export function setState(state) {
  return {
    type: ARENA_SCENE_SET_STATE,
    state
  };
}

export function showSnackbarMessage() {
  return {
    type: SNACKBAR_MESSAGE_SHOW
  };
}

export function registerRightDrawer(rightDrawer) {
  return {
    type: ARENA_SCENE_SET_STATE,
    state: {
      rightDrawer
    }
  };
}

export function pageContainerResize() {
  return {
    type: PAGECONTAINER_RESIZE
  };
}

export function registerPageContainer(element) {
  return {
    type: ARENA_SCENE_SET_STATE,
    state: {
      pageContainer: element
    }
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
      type: SNACKBAR_MESSAGE_PUSH,
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
      type: SNACKBAR_CLOSE
    };
  }
}

export function cancelSnackbarAction() {
  return {
    type: SNACKBAR_MESSAGE_CANCEL
  };
}
