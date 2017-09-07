import {
  FRAME_UPDATE_REFRESH,
  FRAME_UPDATE_NOREFRESH,
  FRAME_NAV_DIALOG,
  FRAME_SNACKBAR_SHOW,
  FRAME_SNACKBAR_ADD,
  FRAME_SNACKBAR_CLOSE,
  FRAME_SNACKBAR_CANCEL,
  FRAME_LEFTNAVBAR,
  PAGE_LOAD_START,
  PAGE_LOAD_END,
  FRAME_WINDOW_RESIZE
} from "../actionTypes";

import {
  SCENE_LOAD_START,
  SCENE_LOAD_END
} from "../../../redux-arena/redux/actionTypes";
import {
  takeLatest,
  takeEvery,
  take,
  put,
  call,
  fork,
  select,
  cancelled,
  race
} from "redux-saga/effects";
import { delay, eventChannel, END } from "redux-saga";

let messageQueue = [];

function* navDialog({ flag }) {
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      navDialogOpenFlag: flag
    }
  });
}

function* showSnackbar() {
  while (true) {
    yield take(FRAME_SNACKBAR_SHOW);
    if (messageQueue.length > 0) {
      let curSnackbar = yield select(state => state.frame.snackbar);
      if (curSnackbar.showFlag === false) {
        if (curSnackbar.closeTime == null) {
          console.error(
            "Closed snackbar has no closeTime, it should not happen! Wtf?"
          );
          curSnackbar.closeTime = new Date().getTime();
        }
        let gapTime = new Date().getTime() - curSnackbar.closeTime;
        let snackBarAction = messageQueue.shift();
        if (gapTime < 500) {
          yield call(delay, 500 - gapTime);
        }
        snackBarAction.startTime = new Date().getTime();
        yield put({
          type: FRAME_UPDATE_REFRESH,
          state: { snackbar: snackBarAction }
        });
      }
    }
  }
}

function* hideSnackbar() {
  let curSnackbar = yield select(state => state.frame.snackbar);
  // gapTime = new Date().getTime() - curSnackbar.startTime;
  // if (gapTime < 4000) return state;
  if (curSnackbar.showFlag === true) {
    if (curSnackbar.delayFunc != null) {
      curSnackbar.delayFunc();
    }
    yield put({
      type: FRAME_UPDATE_REFRESH,
      state: {
        snackbar: {
          showFlag: false,
          message: "",
          closeTime: new Date().getTime()
        }
      }
    });
    yield put({ type: FRAME_SNACKBAR_SHOW });
  }
}

function* addSnackbar({ payload }) {
  payload.acceptTime = new Date().getTime();
  let { pageBirthTime } = yield select(state => state.frame);
  messageQueue.push(payload);
  if (payload.timeStamp == null || payload.timeStamp > pageBirthTime) {
    yield put({ type: FRAME_SNACKBAR_SHOW });
  }
}

function* cancelDelayFunc() {
  let curSnackbar = yield select(state => state.frame.snackbar);
  if (curSnackbar.showFlag === true) {
    if (curSnackbar.delayFunc != null) {
      curSnackbar.delayFunc = null;
      if (curSnackbar.failCb != null) {
        curSnackbar.failCb();
      }
      yield put({
        type: FRAME_UPDATE_REFRESH,
        state: { snackbar: { showFlag: true, message: "撤销成功" } }
      });
    }
  } else {
    console.warn("Too late to cancel delay function :(");
  }
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

function* pageLoadStart() {
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      pageLoading: { progress: 5, loadFlag: true }
    }
  });
  const chan = yield call(progress, 5);
  try {
    while (true) {
      let { pValue, cancel } = yield race({
        pValue: take(chan),
        cancel: take(SCENE_LOAD_END)
      });
      if (cancel) {
        yield call(pageLoadEnd);
        break;
      }
      yield put({
        type: FRAME_UPDATE_REFRESH,
        state: {
          pageLoading: { progress: pValue, loadFlag: true }
        }
      });
    }
  } finally {
    if (yield cancelled()) {
      //do nothing is good
    }
    chan.close();
  }
}

function* pageLoadEnd() {
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      pageLoading: { progress: 100, loadFlag: true }
    }
  });
  yield call(delay, 500);
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      pageLoading: { progress: 0, loadFlag: false }
    }
  });
}

export function* pageLoad() {
  messageQueue = [];
  let curTime = new Date().getTime();
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      showFlag: false,
      message: "",
      closeTime: curTime
    }
  });
  yield fork(pageLoadStart);
}

function* leftNavbar({ flag }) {
  if (flag == null) {
    let { leftNavOpenFlag } = yield select(state => state.frame);
    yield put({
      type: FRAME_UPDATE_REFRESH,
      state: {
        leftNavOpenFlag: !leftNavOpenFlag
      }
    });
  } else {
    yield put({
      type: FRAME_UPDATE_REFRESH,
      state: {
        leftNavOpenFlag: flag
      }
    });
  }
}

export default function* componentSaga() {
  yield takeLatest(FRAME_NAV_DIALOG, navDialog);
  yield takeEvery(FRAME_SNACKBAR_ADD, addSnackbar);
  yield fork(showSnackbar);
  yield takeLatest(FRAME_SNACKBAR_CLOSE, hideSnackbar);
  yield takeLatest(FRAME_SNACKBAR_CANCEL, cancelDelayFunc);
  yield takeLatest(FRAME_LEFTNAVBAR, leftNavbar);
  yield takeEvery(SCENE_LOAD_START, pageLoadStart);
  // yield takeEvery(SCENE_LOAD_END, pageLoadEnd);
}
