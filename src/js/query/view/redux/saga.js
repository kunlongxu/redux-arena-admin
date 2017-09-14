import {
  takeLatest,
  takeEvery,
  throttle,
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
import { TAPE_LOAD_LOGS } from "./actionTypes";
import {
  PAGE_UPDATE_REFRESH,
  PAGE_UPDATE_NOREFRESH
} from "barcsys-dashboard/redux/actionTypes.js";
import { tapeService } from "appconfig/apiUrl";
import { showMessage } from "barcsys-dashboard/commons/commonFunc";
import { gGet, gDel, gPost, gPut } from "barcsys-dashboard/commons/httpFunc";

function* loadLogs({ fileInfo, cnt }) {
  let { app, machine, sequence, timestamp } = fileInfo;
  let { logScroller } = yield select(state => state.page);
  let data = null;
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: {
      loadingFlag: true
    }
  });
  try {
    data = yield call(
      gGet,
      tapeService.logsScan +
        "/" +
        app +
        "/" +
        machine +
        "/" +
        sequence +
        "/" +
        timestamp +
        "/" +
        cnt
    );
  } catch (e) {
    yield put(showMessage("获取日志失败"));
    return;
  } finally {
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        loadingFlag: false
      }
    });
  }
  let { cachedData } = yield select(state => state.page);
  let appendFlag = false;
  let total = data.messages.length;
  if (cnt > 0) {
    if (cachedData.length !== 0) {
      let index = cachedData.length - 1;
      for (let i = 0; i < 1000; i++) {
        if (
          cachedData[index - i] &&
          cachedData[index - i].sequence === data.messages[0].sequence
        ) {
          data.messages = data.messages.slice(i + 1);
          total -= i + 1;
          appendFlag = true;
          break;
        }
      }
    } else {
      appendFlag = true;
    }
    if (appendFlag === false) return;
    let newCachedData = cachedData.concat(data.messages);
    let pointer = logScroller.getPointer();
    if (newCachedData.length > 10000) {
      let startNum = 10000 - newCachedData.length;
      newCachedData = newCachedData().slice(startNum);
      pointer.index -= startNum;
    }
    logScroller.setPointer(pointer);
    logScroller.setCachedData(newCachedData);
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        loadingFlag: false,
        cachedData: newCachedData,
        pointer: pointer,
        fileInfo: fileInfo
      }
    });
    if (total > 0) yield put(showMessage(`成功缓存：${total} 条日志记录`));
  }
  if (cnt < 0) {
    if (cachedData.length !== 0) {
      for (let i = 0; i < 1000; i++) {
        if (
          cachedData[i] &&
          cachedData[i].sequence ===
            data.messages[data.messages.length - 1].sequence
        ) {
          data.messages = data.messages.slice(0, data.messages.length - i - 1);
          total -= i + 1;
          appendFlag = true;
          break;
        }
      }
    } else {
      appendFlag = true;
    }
    if (appendFlag === false) return;
    let newCachedData = data.messages.concat(cachedData);
    let pointer = logScroller.getPointer();
    pointer.index += total;
    if (newCachedData.length > 10000) {
      newCachedData = newCachedData().slice(0, 10000);
    }
    logScroller.setCachedData(newCachedData);
    logScroller.setPointer(pointer);
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        cachedData: newCachedData,
        pointer: pointer,
        fileInfo: fileInfo
      }
    });
    if (total > 0) yield put(showMessage(`成功缓存：${total} 条日志记录`));
  }
}

export default function* pageSaga() {
  yield throttle(1000, TAPE_LOAD_LOGS, loadLogs);
}
