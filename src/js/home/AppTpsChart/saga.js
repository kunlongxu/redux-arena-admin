import { call } from "redux-saga/effects";
import {
  getSceneState,
  setSceneState,
  takeLatestSceneAction
} from "redux-arena/sagaOps";
import { gPost } from "arena-building-material-ui/commons/httpFunc";
import { snackbarMessage } from "arena-building-material-ui/sagaOps";
import { opentsdbServer } from "arena-building-appconfig/apiUrl";
import { LOAD_APP_TPS_DATA } from "./actionTypes";
import moment from "moment";
import OpentsdbEscape from "opentsdb-escape";

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

function* loadAppTpsData({ appId }) {
  try {
    let code = OpentsdbEscape.escape(appId);
    let [tpsData, streamData] = yield call(gPost, opentsdbServer.query, {
      start: moment()
        .set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
        .valueOf(),
      queries: [
        {
          aggregator: "zimsum",
          tags: {
            app: code
          },
          metric: "com.barcsys.tape.storage.process.record.count"
        },
        {
          aggregator: "zimsum",
          tags: {
            app: code
          },
          metric: "com.barcsys.tape.storage.stream.notification.count"
        }
      ]
    });
    let { dataArray, logCnt } = dpsToArray(tpsData.dps);
    let streamCnt = 0;
    for (let key in streamData.dps) {
      streamCnt += streamData.dps[key];
    }
    let { appCardsData } = yield* getSceneState();
    yield* setSceneState({
      tpsData: dataArray,
      streamCnt,
      logCnt
    });
  } catch (e) {
    console.log(e);
    // yield put(showMessage('读取指标数据失败'))
  }
}

export default function* pageSaga() {
  yield* takeLatestSceneAction(LOAD_APP_TPS_DATA, loadAppTpsData);
}
