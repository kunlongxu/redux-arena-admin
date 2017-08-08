import {
  FRAME_REGISTER_PAGECONTAINER,
  FRAME_UPDATE_REFRESH,
  FRAME_UPDATE_NOREFRESH,
  FRAME_SCROLL_TO_TOP,
  FRAME_WINDOW_RESIZE
} from "../actionTypes";
import {
  takeLatest,
  takeEvery,
  take,
  put,
  call,
  fork,
  select
} from "redux-saga/effects";
import { delay, eventChannel, END } from "redux-saga";
import { calcFrameSize } from "../layoutCalc";

function* registerPageContainer({ com }) {
  yield put({
    type: FRAME_UPDATE_NOREFRESH,
    state: { pageContainerCom: com }
  });
}

function* windowResize() {
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      frameSize: calcFrameSize(window.innerWidth)
    }
  });
}

function* scrollToTop() {
  let { pageContainerCom } = yield select(state => state.frame);
  if (pageContainerCom == null) return;
  pageContainerCom.scrollToTop();
}

export default function* resizeEventSaga() {
  yield takeLatest(FRAME_REGISTER_PAGECONTAINER, registerPageContainer);
  yield takeLatest(FRAME_WINDOW_RESIZE, windowResize);
  yield takeLatest(FRAME_SCROLL_TO_TOP, scrollToTop);
}
