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
  FRAME_UPDATE_REFRESH,
  FRAME_SCROLL_TO_TOP
} from "barcsys-dashboard/redux/actionTypes.js";
import { gGet, gDel, gPost, gPut } from "barcsys-dashboard/commons/httpFunc";
import { showMessage } from "barcsys-dashboard/commons/commonFunc";
import { tapeService } from "appconfig/apiUrl";
import Immutable from "immutable";
import { TAPE_DO_SEARCH, TAPE_GENERATE_FILE } from "./actionTypes";
import moment from "moment";

function* doSearch() {
  let { queryData } = yield select(state => state.page);
  if (queryData.get("appFilter") == null) return;
  let momentStart = moment(
    queryData.get("fromTimeFilter"),
    "YYYY-MM-DD HH-mm-ss"
  );
  let momentEnd = moment(queryData.get("toTimeFilter"), "YYYY-MM-DD HH-mm-ss");
  if (!(momentStart.isValid && momentEnd.isValid)) {
    yield put(showMessage("时间格式不正确"));
    return;
  }
  let fromTimeFilter = momentStart.format("YYYYMMDDHHmmss000");
  let toTimeFilter = momentEnd.format("YYYYMMDDHHmmss000");
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: { isLoading: true }
  });
  let data = null;
  let queryObj = queryData.merge({ fromTimeFilter, toTimeFilter }).toObject();
  try {
    data = yield call(gPost, tapeService.logsSearch, queryObj);
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        logsData: data,
        isLoading: false,
        searchedText: queryData.get("contentFilter")
      }
    });
    yield put({
      type: "FRAME_SCROLL_TO_TOP"
    });
  } catch (e) {
    yield put(showMessage("查询失败"));
  }
  if (data == null || data.total === 0) {
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: { downloadQueryData: null, isLoading: false }
    });
  } else {
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: { downloadQueryData: queryObj, isLoading: false }
    });
  }
}

function* generateFile() {
  let { downloadQueryData } = yield select(state => state.page);
  try {
    yield call(gPost, tapeService.logfileGenerate, downloadQueryData);
    yield put(showMessage("日志生成任务已创建"));
  } catch (e) {
    yield put(showMessage("日志生成任务创建失败"));
  }
}

export default function* pageSaga() {
  yield takeLatest(TAPE_DO_SEARCH, doSearch);
  yield takeLatest(TAPE_GENERATE_FILE, generateFile);
}
