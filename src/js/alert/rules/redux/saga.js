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
import { tapeService, siren, guardianAuth } from "appconfig/apiUrl";
import Immutable from "immutable";
import {
  TAPE_OPEN_RULEPANEL,
  TAPE_CLOSE_RULEPANEL,
  TAPE_EDIT_RULEPANEL,
  TAPE_NEXTSTEPPER,
  TAPE_LASTSTEPPER,
  TAPE_ADD_RULEITEM,
  TAPE_DISPATCH_RULEDATA,
  TAPE_DELETE_RULEITEM,
  TAPE_DISPATCH_ALERTDATA,
  TAPE_DELETE_ALERTITEM,
  TAPE_ADD_ALERTITEM,
  TAPE_ADD_RULE_TASK,
  TAPE_UPDATE_RULE_TASK,
  TAPE_SELECT_APP,
  TAPE_DELETE_RULE_TASK,
  TAPE_DEFDEL_RULE_TASK,
  TAPE_LOAD_APPDATA
} from "./actionTypes";
import {
  defaultRuleData,
  ruleObjToPanelData,
  rulePanelDataToObj,
  defaultAlertData,
  alertObjToPanelData,
  alertPanelDataToObj
} from "./actions";

function* rulePanel() {
  while (true) {
    let { ruleData, alertData, editFlag } = yield take(TAPE_OPEN_RULEPANEL);
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        rulePanelOpenFlag: true,
        ruleData,
        alertData,
        editFlag: editFlag,
        stepIndex: 0
      }
    });
    let stepperTask = yield fork(stepper);
    yield take(TAPE_CLOSE_RULEPANEL);
    yield cancel(stepperTask);
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        rulePanelOpenFlag: false
      }
    });
  }
}

function* nextStepper() {
  let { stepIndex } = yield select(state => state.page);
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: {
      stepIndex: stepIndex + 1
    }
  });
}

function* lastStepper() {
  let { stepIndex } = yield select(state => state.page);
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: {
      stepIndex: stepIndex - 1
    }
  });
}

function* stepper() {
  yield takeLatest(TAPE_NEXTSTEPPER, nextStepper);
  yield takeLatest(TAPE_LASTSTEPPER, lastStepper);
}

function* editRulePanel({ ruleData }) {
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: {
      doingSubmit: true
    }
  });
  try {
    let data = yield call(gGet, siren.scheduleRule + "/" + ruleData.get("_id"));
    yield put({
      type: TAPE_OPEN_RULEPANEL,
      ruleData,
      alertData: Immutable.fromJS(alertObjToPanelData(data)),
      editFlag: true
    });
  } catch (e) {
    yield put(showMessage(`规则数据异常`));
  }
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: {
      doingSubmit: false
    }
  });
}

function* editRuleData({ fieldNameArray, value }) {
  let { ruleData } = yield select(state => state.page);
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: { ruleData: ruleData.setIn(fieldNameArray, value) }
  });
}

function* editAlertData({ fieldNameArray, value }) {
  let { alertData } = yield select(state => state.page);
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: { alertData: alertData.setIn(fieldNameArray, value) }
  });
}

function* deleteRuleItem({ index }) {
  let { ruleData } = yield select(state => state.page);
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: { ruleData: ruleData.deleteIn(["ruleList", index]) }
  });
}

function* addRuleItem({ item }) {
  let { ruleData } = yield select(state => state.page);
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: {
      ruleData: ruleData.update("ruleList", value =>
        value.push(Immutable.Map(item))
      )
    }
  });
}

function* addAlertItem({ item }) {
  let { alertData } = yield select(state => state.page);
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: {
      alertData: alertData.update("receiver", value =>
        value.push(Immutable.Map(item))
      )
    }
  });
}

function* deleteAlertItem({ index }) {
  let { alertData } = yield select(state => state.page);
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: { alertData: alertData.deleteIn(["receiver", index]) }
  });
}

function* addRuleTask() {
  while (true) {
    yield take(TAPE_ADD_RULE_TASK);
    yield put({ type: TAPE_CLOSE_RULEPANEL });
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        doingSubmit: true
      }
    });
    let { alertData, selectedApp, ruleData } = yield select(
      state => state.page
    );
    let { userInfo } = yield select(state => state.frame);
    let ruleObj = rulePanelDataToObj(ruleData.toJS());
    ruleObj.app = selectedApp;
    ruleObj.createdBy = userInfo.name;
    try {
      let response = yield call(gPut, tapeService.streamAdd, ruleObj);
      let obj = alertPanelDataToObj(alertData.toJS());
      Object.assign(obj, {
        appId: selectedApp,
        targetId: response._id,
        ruleName: "TAPEBIND_" + response.title,
        _id: response._id
      });
      let data = yield call(gPost, siren.scheduleRules + "/" + obj.appId, obj);
      yield put(showMessage(`Stream[${ruleObj.title}]新增成功`));
    } catch (e) {
      yield put(showMessage(`Stream[${ruleObj.title}]新增失败`));
    }
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        doingSubmit: false
      }
    });
    yield put({
      type: TAPE_SELECT_APP
    });
  }
}

function* editRuleTask() {
  while (true) {
    yield take(TAPE_UPDATE_RULE_TASK);
    yield put({ type: TAPE_CLOSE_RULEPANEL });
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        doingSubmit: true
      }
    });
    let { alertData, ruleData } = yield select(state => state.page);
    let ruleObj = rulePanelDataToObj(ruleData.toJS());
    try {
      let response = yield call(gPost, tapeService.streamUpdate, ruleObj);
      let obj = alertPanelDataToObj(alertData.toJS());
      Object.assign(obj, {
        ruleName: "TAPEBIND_" + response.title
      });
      let data = yield call(gPut, siren.scheduleRule + "/" + obj.appId, obj);
      yield put(showMessage(`Stream[${ruleObj.title}]修改成功`));
    } catch (e) {
      yield put(showMessage(`Stream[${ruleObj.title}]修改失败`));
    }
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        doingSubmit: false
      }
    });
    yield put({
      type: TAPE_SELECT_APP
    });
  }
}

function* selectApp({ appId }) {
  let { queryData, selectedApp } = yield select(state => state.page);
  queryData = queryData.setIn(["queryCondition", "app"], appId || selectedApp);
  try {
    let data = yield call(gPost, tapeService.streamQuery, queryData.toJS());
    queryData = queryData.set("totalPageCount", data.totalPageCount);
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: {
        selectedApp: appId || selectedApp,
        instancesData: data.data,
        queryData
      }
    });
  } catch (e) {
    console.error(e)
    yield put(showMessage("读取规则列表失败"));
  }
}

function* deleteRuleTask({ obj }) {
  try {
    let data = yield call(gDel, siren.scheduleRule + "/" + obj._id);
    data = yield call(gDel, tapeService.streamDelete, obj);
    if (data) {
      yield put(showMessage(`规则:[${obj.title}]已删除`));
    }
  } catch (e) {
    yield put(showMessage(`规则[${obj.title}]删除失败`));
  }
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: {
      doingSubmit: false
    }
  });
  yield put({
    type: TAPE_SELECT_APP
  });
}

function* defDeleteRuleTask({ obj }) {
  yield put({
    type: PAGE_UPDATE_REFRESH,
    state: {
      doingSubmit: true
    }
  });
  yield put(
    showMessage(
      `规则:[${obj.title}]删除中`,
      function() {
        window.reduxStore.dispatch({
          type: TAPE_DELETE_RULE_TASK,
          obj
        });
      },
      function() {
        window.reduxStore.dispatch({
          type: PAGE_UPDATE_REFRESH,
          state: {
            doingSubmit: false
          }
        });
      }
    )
  );
}

function* loadAppData() {
  let { pageWidth, pageHeight } = yield select(state => state.frame);
  let { queryData } = yield select(state => state.page);
  // let perPageSize = parseInt(pageWidth / 352) * parseInt((pageHeight-80) / 254);
  try {
    let data = yield call(
      gGet,
      guardianAuth.apps + "?token=" + sessionStorage.getItem("X-Session-Token")
    );
    yield put({
      type: PAGE_UPDATE_NOREFRESH,
      state: {
        appData: data
        // queryData: queryData.set('perPageSize', perPageSize)
      }
    });
    yield put({
      type: PAGE_UPDATE_REFRESH,
      state: { appData: data, defaultAppName: data[0].name }
    });
    yield put({
      type: TAPE_SELECT_APP,
      appId: data[0].appId
    });
  } catch (e) {
    console.log(e);
    yield put(showMessage("读取APP列表失败"));
  }
}

export default function* pageSaga() {
  yield takeLatest(TAPE_EDIT_RULEPANEL, editRulePanel);
  yield takeEvery(TAPE_DISPATCH_RULEDATA, editRuleData);
  yield takeEvery(TAPE_DISPATCH_ALERTDATA, editAlertData);
  yield takeEvery(TAPE_DELETE_RULEITEM, deleteRuleItem);
  yield takeEvery(TAPE_ADD_RULEITEM, addRuleItem);
  yield takeEvery(TAPE_DELETE_ALERTITEM, deleteAlertItem);
  yield takeEvery(TAPE_ADD_ALERTITEM, addAlertItem);
  yield takeLatest(TAPE_SELECT_APP, selectApp);
  yield takeEvery(TAPE_DELETE_RULE_TASK, deleteRuleTask);
  yield takeLatest(TAPE_DEFDEL_RULE_TASK, defDeleteRuleTask);
  yield takeLatest(TAPE_LOAD_APPDATA, loadAppData);
  yield fork(addRuleTask);
  yield fork(editRuleTask);
  yield fork(rulePanel);
}
