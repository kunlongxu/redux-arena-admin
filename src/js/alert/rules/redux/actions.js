import { PAGE_UPDATE_REFRESH, PAGE_UPDATE_NOREFRESH, FRAME_UPDATE_REFRESH } from 'barcsys-dashboard/redux/actionTypes.js'
import {
  TAPE_OPEN_RULEPANEL, TAPE_CLOSE_RULEPANEL, TAPE_EDIT_RULEPANEL,
  TAPE_NEXTSTEPPER, TAPE_LASTSTEPPER, TAPE_DISPATCH_RULEDATA, TAPE_DELETE_RULEITEM,
  TAPE_ADD_RULEITEM, TAPE_DISPATCH_ALERTDATA, TAPE_DELETE_ALERTITEM, TAPE_ADD_ALERTITEM,
  TAPE_ADD_RULE_TASK, TAPE_SELECT_APP, TAPE_UPDATE_RULE_TASK,
  TAPE_DEFDEL_RULE_TASK, TAPE_LOAD_APPDATA
} from './actionTypes'
import { gGet, gDel, gPost, gPut } from 'barcsys-dashboard/commons/httpFunc'
import { serializeForm, showMessage } from 'barcsys-dashboard/commons/commonFunc'
import { tapeService } from 'appconfig/apiUrl'
import Immutable from 'immutable';

export function rulePanelDataToObj(obj) {
  obj.isDisabled = obj.isDisabled === 'true';
  obj.shouldTriggerEvent = obj.shouldTriggerEvent === 'true';
  obj.ruleList.forEach(item => item.operator = parseInt(item.operator))
  return obj;
}

export function ruleObjToPanelData(obj) {
  if (obj.ruleList == null) return obj;
  let newRuleList = obj.ruleList.map(
    item => Object.assign({}, item, { operator: String(item.operator) }))
  return Object.assign({}, obj, {
    isDisabled: String(obj.isDisabled),
    shouldTriggerEvent: String(obj.shouldTriggerEvent),
    ruleList: newRuleList
  })
}

export function alertPanelDataToObj(panelData) {
  return Object.assign({},
    panelData,
    {
      maxSize: parseInt(panelData.maxSize),
      timeSpan: parseInt(parseInt(panelData.timeSpan * 60 * 1000)),
      minSize: parseInt(panelData.minSize),
    })
}

export function alertObjToPanelData(obj) {
  return Object.assign({}, obj,
    {
      maxSize: String(obj.maxSize),
      minSize: String(obj.minSize),
      timeSpan: String(parseInt(obj.timeSpan / 1000 / 60)),
    })
}

export const defaultAlertData = {
  appId: null, ruleName: '',
  timeSpan: 0, maxSize: 0, minSize: 0, emergency: 'low',
  trigger: 'period_size', src: 'tape',
  receiver: [{ address: '', addressType: 'sms' }],
  status: 'enabled', regExpression: '.*',
  targetId: ''
}

export const defaultRuleData = {
  shouldTriggerEvent: true,
  description: '',
  createdWhen: null,
  ruleList: [{ field: '', operator: 1, value: '' }],
  createdBy: '',
  app: null,
  title: '',
  isDisabled: false,
  ruleDSL: ""
}

export function savePanel() {
  return {
    type: TAPE_ADD_RULE_TASK,
  }
}

export function dispatchRuleData(fieldNameArray, value) {
  return {
    type: TAPE_DISPATCH_RULEDATA,
    fieldNameArray, value
  }
}

export function dispatchAlertData(fieldNameArray, value) {
  return {
    type: TAPE_DISPATCH_ALERTDATA,
    fieldNameArray, value
  }
}

export function setStateValue(fieldName, value) {
  let newFieldData = {};
  newFieldData[fieldName] = value;
  return {
    type: PAGE_UPDATE_REFRESH,
    state: newFieldData
  }
}

export function addRuleDataItem() {
  return {
    type: TAPE_ADD_RULEITEM,
    item: { field: '', operator: '1', value: '' }
  }
}

export function delRuleDataItem(index) {
  return {
    type: TAPE_DELETE_RULEITEM,
    index
  }
}

export function updatePanel() {
  return {
    type: TAPE_UPDATE_RULE_TASK
  }
}

export function updateService(card) {
  return dispatch => {
    gPost(tapeService.streamUpdate, card).then(function (data) {
      dispatch(selectApp());
      data && dispatch(showMessage(`Stream[${card.title}]已${card.isDisabled ? '禁用' : '启用'}`));
    })
  }
}

export function deleteService(obj) {
  return {
    type: TAPE_DEFDEL_RULE_TASK,
    obj
  }
}

export function selectApp(appId) {
  return {
    type: TAPE_SELECT_APP,
    appId
  }
}

export function loadAppData(selectedApp) {
  return {
    type: TAPE_LOAD_APPDATA
  }
}

export function showAddRulePanel() {
  return {
    type: TAPE_OPEN_RULEPANEL,
    editFlag: false,
    ruleData: Immutable.fromJS(ruleObjToPanelData(defaultRuleData)),
    alertData: Immutable.fromJS(alertObjToPanelData(defaultAlertData)),
  }
}

export function showEditRulePanel(obj) {
  return {
    type: TAPE_EDIT_RULEPANEL,
    ruleData: Immutable.fromJS(ruleObjToPanelData(obj)),
  }
}

export function hideRulePanel() {
  return {
    type: TAPE_CLOSE_RULEPANEL,
  }
}

export function lastStep() {
  return {
    type: TAPE_LASTSTEPPER,
  }
}

export function nextStep() {
  return {
    type: TAPE_NEXTSTEPPER,
  }
}

export function setStep(i) {
  return {
    type: PAGE_UPDATE_REFRESH,
    state: { stepIndex: i }
  }
}

export function setFootprint(footprint) {
  return {
    type: FRAME_UPDATE_REFRESH,
    state: { footprint }
  }
}

export function setAppId(appId) {
  return (dispatch, getState) => {
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: {
        appId: appId,
      }
    })
    dispatch(loadAppData(appId))
  }
}

export function doQuery() {
  return (dispatch, getState) => {
    let queryData = getState().page.queryData.set('currentPageIdx', 0);
    let searchText = getState().page.searchText.trim();
    if (searchText !== '') queryData = queryData.set('queryCondition',
      Immutable.fromJS({ title: getState().page.searchText.trim() }))
    dispatch({
      type: PAGE_UPDATE_NOREFRESH,
      state: { queryData }
    })
    dispatch(selectApp())
  }
}

export function turnPage(pageNum) {
  return (dispatch, getState) => {
    let state = getState().page;
    let {queryData, instancesData, pageNumText} = state;
    let perPageSize = queryData.get('perPageSize');
    let curPageNum = queryData.get('currentPageIdx');
    let totalPageCount = queryData.get('totalPageCount');
    if (isNaN(pageNum)) {
      dispatch(showMessage(`页数：${pageNumText} 不是有效整数`))
      return
    }
    let forwardNum = pageNum - curPageNum;
    if (forwardNum === 0) {
      dispatch(showMessage(`页数：${pageNum + 1} 为当前页`))
      return;
    }
    if (pageNum > totalPageCount - 1) {
      dispatch(showMessage(`页数：${pageNum + 1} 大于最大页数`))
      return
    }
    if (pageNum < 0) {
      dispatch(showMessage(`页数：${pageNum + 1} 小于1`))
      return
    }
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: { queryData: queryData.set('currentPageIdx', pageNum), pageNumText: String(pageNum) }
    })
    dispatch(selectApp())
  }
}

export function addReceiverDataItem() {
  return {
    type: TAPE_ADD_ALERTITEM,
    item: { address: '', addressType: 'sms' }
  }
}

export function delReceiverDataItem(index) {
  return {
    type: TAPE_DELETE_ALERTITEM,
    index
  }
}