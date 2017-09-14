import {PAGE_UPDATE_REFRESH, PAGE_UPDATE_NOREFRESH} from 'barcsys-dashboard/redux/actionTypes.js'
import {gGet, gDel, gPost, gPut} from 'barcsys-dashboard/commons/httpFunc'
import {serializeForm, showMessage, applyDataFilter} from 'barcsys-dashboard/commons/commonFunc'
import {siren} from 'appconfig/apiUrl'
import {
  TAPE_LOAD_APPLIST, TAPE_SELECT_APP,
  TAPE_SEARCH_ALERT, TAPE_TURN_PAGE,
  TAPE_REFRESH_DATA,TAPE_STATUS_FILTER
} from './actionTypes'

export function initInstanceData() {
  return {
    type: TAPE_LOAD_APPLIST
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

export function reloadAlertData() {
  return {
    type: TAPE_REFRESH_DATA,
  }
}

export function doQuery(text) {
  return {
    type: TAPE_SEARCH_ALERT,
    text
  }
}

export function selectApp(appId) {
  return {
    type: TAPE_SELECT_APP,
    appId
  }
}

function setInstancesData(data, queryData) {
  return {
    type: PAGE_UPDATE_REFRESH,
    state: { instancesData: data, isLoading: false, queryData }
  }
}

export function turnPage(pageNum) {
  return {
    type: TAPE_TURN_PAGE,
    pageNum
  }
}

export function changeStatusFilter(value) {
  return {
    type: TAPE_STATUS_FILTER,
    value
  }
}