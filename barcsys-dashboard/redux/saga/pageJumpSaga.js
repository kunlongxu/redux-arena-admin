import {
  FRAME_PAGE_JUMP,
  FRAME_UPDATE_REFRESH,
  FRAME_UPDATE_NOREFRESH,
  FRAME_ROUTE_REFRESH,
  FRAME_PAGE_BACKWARD,
  FRAME_PAGE_REFRESH
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
import { isExistPath } from "../../commons/commonFunc";

function* pageJump({ url, saveState }) {
  const {
    // jumpHistory,
    // historyPageState,
    // match,
    history,
    rootRoute
    // frameSize,
    // isHotPatched
  } = yield select(state => state.frame);
  // if (isHotPatched) yield put({ type: FRAME_ROUTE_REFRESH });
  // if (saveState === true) {
  //   let tmpState = yield select(state => state.page);
  //   historyPageState[match.path] = Object.assign({}, tmpState);
  // } else delete historyPageState[match.path];
  // jumpHistory.push(window.location.pathname);
  // let newFrameState = {
  //   jumpHistory,
  //   historyPageState
  // };
  // if (frameSize !== "largeL") newFrameState.leftNavOpenFlag = false;
  // yield put({ type: FRAME_UPDATE_REFRESH, state: newFrameState });
  if (isExistPath(rootRoute, url)) {
    history.push(url);
  } else {
    window.location.href = url;
  }
}

function* pageBackward() {
  while (true) {
    yield take(FRAME_PAGE_BACKWARD);
    let { jumpHistory, history } = yield select(state => state.frame);
    let flag = true;
    do {
      let url = jumpHistory.pop();
      if (url == null) break;
      if (url.indexOf("/login") > -1) continue;
      history.push(url);
      flag = false;
    } while (flag);
  }
}

export default function* framePageJumpSaga() {
  yield takeLatest(FRAME_PAGE_JUMP, pageJump);
  yield fork(pageBackward);
}
