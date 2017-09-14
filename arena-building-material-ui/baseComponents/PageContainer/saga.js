import {
  takeLatestSceneAction,
  takeEverySceneAction,
  getSceneState,
  setSceneState,
  getSceneActions
} from "redux-arena/sagaOps";
import { delay } from "redux-saga";
import {
  PAGECONTAINER_RESIZE,
  SNACKBAR_MESSAGE_PUSH,
  SNACKBAR_MESSAGE_SHOW,
  SNACKBAR_MESSAGE_CANCEL,
  SNACKBAR_CLOSE
} from "./actionTypes";

function* showSnackbarMessage() {
  let { messageQueue, snackbarInfo } = yield* getSceneState();
  if (messageQueue.length > 0) {
    let newSnackBarInfo = messageQueue[0];
    yield* setSceneState({ messageQueue: messageQueue.slice(1) });
    if (snackbarInfo.showFlag === false) {
      let gapTime = new Date().getTime() - snackbarInfo.closeTime;
      if (gapTime < 500) {
        yield delay(500 - gapTime);
      }
      newSnackBarInfo.startTime = new Date().getTime();
      yield* setSceneState({ snackbarInfo: newSnackBarInfo });
    }
  }
}

function* closeSnackbar() {
  let { snackbarInfo } = yield* getSceneState();
  let { showSnackbarMessage } = yield* getSceneActions();
  if (snackbarInfo.showFlag === true) {
    if (snackbarInfo.delayFunc != null) {
      snackbarInfo.delayFunc();
    }
    yield setSceneState({
      snackbarInfo: {
        showFlag: false,
        message: "",
        closeTime: new Date().getTime()
      }
    });
    showSnackbarMessage();
  }
}

function* pushSnackbarMessage({ payload }) {
  let { messageQueue } = yield* getSceneState();
  let { showSnackbarMessage } = yield* getSceneActions();
  yield setSceneState({ messageQueue: messageQueue.concat(payload) });
  showSnackbarMessage();
}

function* cancelDelayFunc() {
  let { snackbarInfo } = yield* getSceneState();
  if (snackbarInfo.showFlag === true) {
    if (snackbarInfo.delayFunc != null) {
      snackbarInfo.delayFunc = null;
      if (snackbarInfo.failCb != null) {
        snackbarInfo.failCb();
      }
      yield setSceneState({
        snackbar: { showFlag: true, message: "撤销成功" }
      });
    }
  } else {
    console.warn("Too late to cancel delay function :(");
  }
}

function* pageContainerResize() {
  let { pageContainer } = yield* getSceneState();
  if (pageContainer == null) {
    yield* setSceneState({
      pageWidth: 0,
      pageHeight: 0
    });
  } else {
    let dom = ReactDOM.findDOMNode(pageContainerCom);
    let { width, height } = dom.getBoundingClientRect();
    let style = window.getComputedStyle(dom);
    let margin = {
      left: parseInt(style["margin-left"]),
      right: parseInt(style["margin-right"]),
      top: parseInt(style["margin-top"]),
      bottom: parseInt(style["margin-bottom"])
    };
    let padding = {
      left: parseInt(style["padding-left"]),
      right: parseInt(style["padding-right"]),
      top: parseInt(style["padding-top"]),
      bottom: parseInt(style["padding-bottom"])
    };
    let border = {
      left: parseInt(style["border-left"]),
      right: parseInt(style["border-right"]),
      top: parseInt(style["border-top"]),
      bottom: parseInt(style["border-bottom"])
    };
    yield* setSceneState({
      pageWidth: width - padding.left - padding.right,
      pageHeight: height - padding.top - padding.bottom
    });
  }
}
export default function* componentSaga() {
  yield* takeEverySceneAction(SNACKBAR_MESSAGE_PUSH, pushSnackbarMessage);
  yield* takeLatestSceneAction(SNACKBAR_MESSAGE_SHOW, showSnackbarMessage);
  yield* takeLatestSceneAction(SNACKBAR_CLOSE, closeSnackbar);
  yield* takeLatestSceneAction(SNACKBAR_MESSAGE_CANCEL, cancelDelayFunc);
  yield* takeLatestSceneAction(PAGECONTAINER_RESIZE, pageContainerResize);
}
