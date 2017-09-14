import { call } from "redux-saga/effects";
import {
  takeLatestSceneAction,
  getSceneState,
  setSceneState
} from "redux-arena/sagaOps";
import { gGet, gPost } from "arena-building-material-ui/commons/httpFunc";
import moment from "moment";
import { snackbarMessage } from "arena-building-material-ui/sagaOps";
import {
  tapeService,
  guardianAuth,
  opentsdbServer
} from "arena-building-appconfig/apiUrl";
import { LOAD_APPDATA, LOAD_TAPEDATA } from "./actionTypes";

function dpsToArray(dpsData) {
  let dataArray = [];
  let logCnt = 0;
  let lastTimestamp = null;
  for (let key in dpsData) {
    let timestamp = parseInt(key);
    // if (lastTimestamp != null) {
    //   let gapNum = (timestamp - lastTimestamp) / 60
    //   if (gapNum > 0) {
    //     for (let i = 1; i < gapNum + 1; i++) {
    //       array.push({
    //         date: parseInt((lastTimestamp + 60 * i) + '000'),
    //         tps: dpsData[key] / gapNum
    //       })
    //     }
    //     lastTimestamp = timestamp
    //     continue;
    //   }
    // }
    logCnt += dpsData[key];
    dataArray.push({
      date: timestamp * 1000,
      value: dpsData[key]
    });
    lastTimestamp = timestamp;
  }
  return { dataArray, logCnt };
}

function* loadTapeData() {
  try {
    let tapeBaseData = yield call(gGet, tapeService.repositorySpace);
    yield* setSceneState(tapeBaseData);
  } catch (e) {
    console.error(e);
  }
}

function* loadAppData() {
  try {
    let data = yield call(
      gGet,
      guardianAuth.apps + "?token=" + sessionStorage.getItem("X-Session-Token")
    );
    yield setSceneState({
      appData: data
    });
  } catch (e) {
    console.error(e);
    yield* snackbarMessage(`读取APP列表失败`);
  }
}

function* getTapeTpsData() {
  try {
    let data = yield call(gPost, opentsdbServer.query, {
      start: moment()
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .valueOf(),
      queries: [
        {
          aggregator: "zimsum",
          metric: "com.barcsys.tape.storage.process.record.count"
        }
      ]
    });
    if (data.length === 0 || data[0].dps.length === 0) {
      return;
    }
    let { dataArray } = dpsToArray(data[0].dps);
    yield* setSceneState({
      tapeTpsData: dataArray
    });
  } catch (e) {
    console.error(e);
    yield* snackbarMessage("读取指标数据失败");
  }
}

export default function* pageSaga() {
  yield* takeLatestSceneAction(LOAD_APPDATA, loadAppData);
  yield* takeLatestSceneAction(LOAD_TAPEDATA, loadTapeData);
  yield* takeLatestSceneAction(LOAD_TAPEDATA, getTapeTpsData);
}
