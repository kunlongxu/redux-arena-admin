import {
  PAGE_UPDATE_REFRESH,
  PAGE_UPDATE_NOREFRESH,
  FRAME_UPDATE_REFRESH
} from "barcsys-dashboard/redux/actionTypes.js";
import { gGet, gDel, gPost, gPut } from "barcsys-dashboard/commons/httpFunc";
import { tapeService, platformService } from "appconfig/apiUrl";
import { showMessage } from "barcsys-dashboard/commons/commonFunc";
import { TAPE_DO_SEARCH, TAPE_GENERATE_FILE } from "./actionTypes";

export function changeField(fieldName, value) {
  return (dispatch, getState) => {
    let { queryData } = getState().page;
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: { queryData: queryData.set(fieldName, value) }
    });
  };
}

export function setStateValue(fieldName, value) {
  let newFieldData = { dropDwonFlag: false, [fieldName]: value };
  let dropDwonFlag = false;
  return {
    type: PAGE_UPDATE_REFRESH,
    state: newFieldData
  };
}

export function closeDetail() {
  return (dispatch, getState) => {
    let state = getState().page;
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: Object.assign(state, { isDetailOpen: false })
    });
  };
}

export function openDetail(detailContent) {
  return (dispatch, getState) => {
    let state = getState().page;
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: Object.assign(state, {
        isDetailOpen: true,
        detailContent: detailContent
      })
    });
  };
}

export function addCondition() {
  return (dispatch, getState) => {
    let {
      queryData,
      fieldNames,
      fieldValue,
      dropDownValue
    } = getState().page;
    if (fieldValue === "") return;
    let key = fieldNames.find(item => item.name === dropDownValue);
    if (key == null) {
      let newObj = {};
      newObj[dropDownValue] = fieldValue;
      queryData = queryData.mergeIn(["additionalFilter"], newObj);
    } else {
      queryData = queryData.set(key.value, fieldValue);
    }
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: { queryData }
    });
  };
}

export function deleteField(value) {
  return (dispatch, getState) => {
    let { queryData, fieldNames } = getState().page;
    let key = fieldNames.find(item => item.name === value);
    if (key == null)
      queryData = queryData.removeIn(["additionalFilter", value]);
    else queryData = queryData.remove(key.value);
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: { queryData }
    });
  };
}

export function resetPageNum() {
  return (dispatch, getState) => {
    let state = getState().page;
    state.queryData.from = 0;
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: Object.assign(state, { pageNumText: "1" })
    });
  };
}

export function doSearch() {
  return {
    type: TAPE_DO_SEARCH
  };
}

export function turnPage(pageNum) {
  return (dispatch, getState) => {
    let state = getState().page;
    let { queryData, logsData, pageNumText } = state;
    if (isNaN(pageNum)) {
      dispatch(showMessage(`页数：${pageNumText} 不是有效整数`));
      return;
    }
    if (pageNum > 200) {
      dispatch(showMessage(`不允许查看200页以后的日志`));
      return;
    }
    let curPageNum = queryData.get("offset") / 50 + 1;
    let forwardNum = pageNum - curPageNum;
    if (forwardNum === 0) {
      dispatch(showMessage(`页数：${pageNum} 为当前页`));
      return;
    }
    let newFrom = queryData.get("offset") + forwardNum * 50;
    if (newFrom > logsData.total) {
      dispatch(showMessage(`页数：${pageNum} 大于最大页数`));
      return;
    }
    if (newFrom < 0) {
      dispatch(showMessage(`页数：${pageNum} 小于1`));
      return;
    }
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: {
        queryData: queryData.set("offset", newFrom),
        pageNumText: String(pageNum)
      }
    });
    dispatch(doSearch());
  };
}

export function generateFile() {
  return {
    type: TAPE_GENERATE_FILE
  };
}
