import {
  FRAME_LOAD_PAGE,
  FRAME_UPDATE_REFRESH,
  FRAME_USER_LOGIN,
  FRAME_USER_LOGOUT,
  FRAME_SNACKBAR_CLOSE,
  FRAME_UPDATE_NOREFRESH,
  PAGE_SET_CUR_MENU_DATA,
  PAGE_SET_REDUCER,
  PAGE_SET_SAGA,
  PAGE_SET_STATE,
  PAGE_APPLY_REDUX
} from "../actionTypes";
import { takeLatest, take, put, call, fork, select } from "redux-saga/effects";

function* loadPage({
  state,
  reducer,
  saga,
  match,
  location,
  PageCom,
  loadStartTime,
  newHRData,
  displayMode
}) {
  let { pageBirthTime, historyPageState } = yield select(state => state.frame);
  if (loadStartTime < pageBirthTime) {
    console.warn("PageCom is out of date");
    return;
  }
  if (newHRData) {
    yield put({
      type: FRAME_UPDATE_REFRESH,
      state: { isHotPatcheded: true }
    });
    if (newHRData.saga || newHRData.reducer) {
      yield put({
        type: PAGE_APPLY_REDUX,
        saga: newHRData.saga,
        reducer: newHRData.reducer,
        loadStartTime
      });
    }
    yield put({
      type: FRAME_UPDATE_REFRESH,
      state: { pageBirthTime: loadStartTime }
    });
  } else {
    yield put({ type: FRAME_SNACKBAR_CLOSE });
    let newFrameState = {
      match,
      location,
      breadcrumb: [],
      footprint: null,
      PageCom,
      pageBirthTime: loadStartTime,
      navDialogOpenFlag: false,
      isRightDrawerExist: false,
      isRightDrawerOpen: false,
      RightDrawerChildren: null,
      displayMode
    };
    let cachedPageState = historyPageState[match.path];
    if (cachedPageState != null) {
      state = cachedPageState;
      delete historyPageState[match.path];
    }
    yield put({
      type: PAGE_SET_STATE,
      state
    });
    yield put({
      type: PAGE_APPLY_REDUX,
      reducer,
      saga,
      loadStartTime
    });
    yield put({ type: FRAME_UPDATE_REFRESH, state: newFrameState });
    yield put({ type: PAGE_SET_CUR_MENU_DATA });
  }
}

export default function* frameLoadPageSaga() {
  yield takeLatest(FRAME_LOAD_PAGE, loadPage);
}
