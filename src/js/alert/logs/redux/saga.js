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
  cancel
} from "redux-saga/effects";
import { delay, eventChannel, END } from "redux-saga";
import {
  PAGE_UPDATE_REFRESH,
  PAGE_UPDATE_NOREFRESH,
  FRAME_UPDATE_REFRESH
} from "barcsys-dashboard/redux/actionTypes.js";
import { gGet, gDel, gPost, gPut } from "barcsys-dashboard/commons/httpFunc";
import {
  serializeForm,
  showMessage
} from "barcsys-dashboard/commons/commonFunc";
import { guardianAuth, siren } from "appconfig/apiUrl";
import Immutable from "immutable";
import {
  TAPE_LOAD_APPLIST,
  TAPE_SELECT_APP,
  TAPE_SEARCH_ALERT,
  TAPE_TURN_PAGE,
  TAPE_REFRESH_DATA,
  TAPE_STATUS_FILTER
} from "./actionTypes";

function* loadAppData() {
  let { pageHeight } = yield select(state => state.frame);
  let { queryData } = yield select(state => state.page);
  let perPageSize = parseInt((pageHeight - 146) / 51);
  try {
    let data = yield call(
      gGet,
      guardianAuth.apps + "?token=" + sessionStorage.getItem("X-Session-Token")
    );
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        appData: data,
        queryData: queryData.set("perPageSize", perPageSize),
        defaultAppName: data[0].name
      }
    });
    yield put({
      type: TAPE_SELECT_APP,
      appId: data[0].appId
    });
  } catch (e) {
    console.log(e);
    yield put(showMessage(`读取APP列表失败`));
  }
}

function* selectApp({ appId }) {
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: { isLoading: true }
  });
  try {
    let { queryData } = yield select(state => state.page);
    queryData = queryData
      .setIn(["queryCondition", "appId"], appId || selectedApp)
      .set("currentPageIdx", 0);
    let data = yield call(gPost, siren.alertItems, queryData.toJS());
    queryData = queryData.set("totalPageCount", data.totalPageCount);
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        selectedApp: appId || selectedApp,
        queryData,
        instancesData: data.data
      }
    });
  } catch (e) {
    yield put(showMessage(`读取报警规则失败`));
  }
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: { isLoading: false }
  });
}

function* searchAlert({ text }) {
  let { queryData } = yield select(state => state.page);
  yield put({
    type: PAGE_UPDATE_REFRESH,
    queryData: queryData
  });
}

function* turnPage({ pageNum }) {
  let { queryData, instancesData, pageNumText } = yield select(
    state => state.page
  );
  let perPageSize = queryData.get("perPageSize");
  let curPageNum = queryData.get("currentPageIdx");
  let totalPageCount = queryData.get("totalPageCount");
  if (isNaN(pageNum)) {
    yield put(showMessage(`页数：${pageNumText} 不是有效整数`));
    return;
  }
  let forwardNum = pageNum - curPageNum;
  if (forwardNum === 0) {
    yield put(showMessage(`页数：${pageNum + 1} 为当前页`));
    return;
  }
  if (pageNum > totalPageCount - 1) {
    yield put(showMessage(`页数：${pageNum + 1} 大于最大页数`));
    return;
  }
  if (pageNum < 0) {
    yield put(showMessage(`页数：${pageNum + 1} 小于1`));
    return;
  }
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: {
      queryData: queryData.set("currentPageIdx", pageNum),
      pageNumText: String(pageNum + 1)
    }
  });
  yield put({
    type: TAPE_REFRESH_DATA
  });
}

function* refreshData() {
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: { isLoading: true }
  });
  let { queryData, selectedApp } = yield select(state => state.page);
  try {
    let data = yield call(gPost, siren.alertItems, queryData.toJS());
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        instancesData: data.data
      }
    });
  } catch (e) {
    yield put(showMessage(`读取报警规则失败`));
  }
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: { isLoading: false }
  });
}

function* statusFilter({ value }) {
  let { queryData } = yield select(state => state.page);
  if (value === "all") {
    queryData = queryData.deleteIn(["queryCondition", "status"]);
  } else {
    queryData = queryData.setIn(["queryCondition", "status"], value);
  }
  yield put({
    type: PAGE_UPDATE_NOREFRESH,
    state: { queryData: queryData.set("currentPageIdx", 0) }
  });
  yield put({
    type: TAPE_REFRESH_DATA
  });
}

export default function* pageSaga() {
  yield takeLatest(TAPE_LOAD_APPLIST, loadAppData);
  yield takeLatest(TAPE_SELECT_APP, selectApp);
  yield takeLatest(TAPE_TURN_PAGE, turnPage);
  yield takeLatest(TAPE_REFRESH_DATA, refreshData);
  yield takeLatest(TAPE_STATUS_FILTER, statusFilter);
  // yield takeLatest(TAPE_SEARCH_ALERT, searchAlert)
}
