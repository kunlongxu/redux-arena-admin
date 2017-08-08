import {
  FRAME_LOAD_USERAPPDATA,
  FRAME_UPDATE_NOREFRESH,
  FRAME_UPDATE_REFRESH
} from "../actionTypes";
import { takeLatest, take, put, call, fork, select } from "redux-saga/effects";
import { gGet, gDel, gPost, gPut } from "barcsys-dashboard/commons/httpFunc";
import { guardianAuth } from "appconfig/apiUrl";

function* loadUserAppData({ PageCom, loadStartTime, pageName }) {
  let appData = yield call(
    gGet,
    guardianAuth.apps + "?token=" + sessionStorage.getItem("X-Session-Token")
  );
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state: {
      userAppData: appData
    }
  });
}

export default function* frameLoadPageSaga() {
  yield takeLatest(FRAME_LOAD_USERAPPDATA, loadUserAppData);
}
