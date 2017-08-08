import {
  FRAME_UPDATE_NOREFRESH,
  PAGE_APPLY_REDUX,
  PAGE_SET_STATE
} from "../actionTypes";
import { delay, eventChannel, END } from "redux-saga";
import {
  takeLatest,
  takeEvery,
  take,
  put,
  call,
  fork,
  select,
  cancel
} from "redux-saga/effects";

// let curPageReducerTask = null;
// let curPageSagaTask = null;

export function* emptyPageSaga() {}

function reducerToSaga(pageReducer) {
  return function*(action) {
    if (action.type !== PAGE_SET_STATE) {
      let pageState = yield select(state => state.page);
      yield put({
        type: PAGE_SET_STATE,
        state: pageReducer(pageState, action)
      });
    }
  };
}

function* pageApplyRedux({ reducer, saga, loadStartTime }) {
  // yield [cancel(curPageReducerTask), cancel(curPageSagaTask)]
  // [curPageReducerTask, curPageSagaTask] =
  let { pageBirthTime, historyPageState } = yield select(state => state.frame);
  if (loadStartTime < pageBirthTime) {
    console.warn("PageCom Redux is out of date");
    return;
  }
  if (reducer) yield takeEvery("*", reducerToSaga(reducer));
  if (saga) yield fork(saga || emptyPageSaga);
}

export default function* pageReduxSaga() {
  // [curPageReducerTask, curPageSagaTask] = yield [
  //   fork(reducerToSaga(emptyPageReducer)),
  //   fork(emptyPageSaga)
  // ]
  yield takeLatest(PAGE_APPLY_REDUX, pageApplyRedux);
}
