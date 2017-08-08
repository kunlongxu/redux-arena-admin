import { combineReducers } from "redux";
import {
  takeLatest,
  takeEvery,
  take,
  put,
  call,
  fork,
  select,
  cancelled,
  race,
  spawn,
  cancel
} from "redux-saga/effects";
import { delay, eventChannel, END } from "redux-saga";

import frameReducer from "../frameReducer";
import {
  PAGE_INIT_CUSTOM_REDUX,
  PAGE_DSTY_CUSTOM_REDUX,
  PAGE_APPL_CUSTOM_REDUX,
  FRAME_LOAD_PAGE
} from "../actionTypes";

function* initCustomRedux({ name, reducer, saga, batchFlag = false }) {
  let { customReduxDict } = yield select(state => state.frame);
  if (customReduxDict[name] != null && customReduxDict[name].task != null) {
    yield cancel(customReduxDict[name].task);
  }
  customReduxDict[name] = { reducer, saga };
  if (!batchFlag) {
    yield put({ type: PAGE_APPL_CUSTOM_REDUX });
  }
}

function* applCustomRedux() {
  let { customReduxDict } = yield select(state => state.frame);
  let reducers = {};
  for (name in customReduxDict) {
    let { reducer, saga, task } = customReduxDict[name];
    if (task != null) {
      yield cancel(customReduxDict[name].task);
    }
    customReduxDict[name].task = yield spawn(saga);
    reducers[name] = reducer;
  }
  Object.assign(reducers, {
    frame: frameReducer
  });
  window.reduxStore.replaceReducer(combineReducers(reducers));
}

function* dstyCustomRedux({ name, nameList, batchFlag = false }) {
  if (nameList == null) nameList = [];
  nameList.push(name);
  let { frame } = yield select(state => state);
  let { customReduxDict } = frame;
  for (let i = 0; i < nameList.length; i++) {
    name = nameList[i];
    if (customReduxDict[name] == null) continue;
    let { task } = customReduxDict[name];
    if (task != null) yield cancel(task);
    delete customReduxDict[name];
    delete frame[name];
  }
  if (!batchFlag) {
    yield put({ type: PAGE_APPL_CUSTOM_REDUX });
  }
}

function* clearAllCustomRedux() {
  let { frame } = yield select(state => state);
  let { customReduxDict } = frame;
  for (name in customReduxDict) {
    let { task } = customReduxDict[name];
    if (task != null) yield cancel(task);
    delete customReduxDict[name];
    delete frame[name];
  }
  yield put({ type: PAGE_APPL_CUSTOM_REDUX });
}

export default function* frameLoadPageSaga() {
  yield takeEvery(PAGE_INIT_CUSTOM_REDUX, initCustomRedux);
  yield takeEvery(PAGE_DSTY_CUSTOM_REDUX, dstyCustomRedux);
  yield takeLatest(PAGE_APPL_CUSTOM_REDUX, applCustomRedux);
  // yield takeLatest(FRAME_LOAD_PAGE, clearAllCustomRedux);
}
