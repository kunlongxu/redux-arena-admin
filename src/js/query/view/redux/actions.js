import { LogScroller } from "../logScroller";
import {
  PAGE_UPDATE_REFRESH,
  PAGE_UPDATE_NOREFRESH
} from "barcsys-dashboard/redux/actionTypes.js";
import { tapeService } from "appconfig/apiUrl";
import { showMessage } from "barcsys-dashboard/commons/commonFunc";
import { gGet, gDel, gPost, gPut } from "barcsys-dashboard/commons/httpFunc";
import { TAPE_LOAD_LOGS } from "./actionTypes";

function keyboardFlip(pageRowNum, skipRowNum, flipNum, keyCode, logScroller) {
  switch (keyCode) {
    case 34:
      logScroller.lineForOrBack(pageRowNum);
      return {
        offset: pageRowNum,
        keyDescripe: `Page Down ${flipNum + pageRowNum}`
      };
    case 33:
      logScroller.lineForOrBack(-pageRowNum);
      return {
        offset: -pageRowNum,
        keyDescripe: `Page Up ${flipNum - pageRowNum}`
      };
    case 38:
      logScroller.lineForOrBack(-1);
      return { offset: -1, keyDescripe: `Line Up ${flipNum - 1}` };
    case 40:
      logScroller.lineForOrBack(1);
      return { offset: 1, keyDescripe: `Line Down ${flipNum + 1}` };
    case 39:
    //return{offset:skipLineNum,keyDescripe:`Forward ${flipNum + skipRowNum}`};
    case 37:
    //return{offset:-skipLineNum,keyDescripe:`Backward ${flipNum - skipRowNum}`};
  }
}

function museWheelFlip(wheelDelta, flipNum, logScroller) {
  if (wheelDelta < 0)
    return {
      offset: wheelDelta,
      keyDescripe: `Backward ${flipNum + wheelDelta}`
    };
  if (wheelDelta > 0)
    return {
      offset: wheelDelta,
      keyDescripe: `Forward ${flipNum + wheelDelta}`
    };
}

function outOfBoundary(obj, index, arrayLength) {
  if (index > arrayLength - 1) {
    obj.offset = obj.offset - (index - arrayLength + 1);
    obj.keyDescripe = "Loading new data, waiting for a few seconds";
  }
  if (index < 0) {
    obj.offset = 0;
    obj.keyDescripe = "Loading new data, waiting for a few seconds";
  }
  return obj;
}

export function flipLog(e) {
  return (dispatch, getState) => {
    let {
      skipRowNum,
      pageRowNum,
      flipNum,
      cache,
      fileInfo,
      cachedData,
      loadingFlag,
      logScroller
    } = getState().page;
    let obj;
    if (e.keyCode) {
      let pointer = logScroller.getPointer();
      if (loadingFlag === false) {
        if (
          cachedData.length - pointer.index < 10 &&
          cachedData[cachedData.length - 1]
        ) {
          fileInfo.sequence = cachedData[cachedData.length - 1].sequence;
          fileInfo.timestamp = cachedData[cachedData.length - 1].timestamp;
          dispatch(loadLogs(fileInfo, 200));
        }
        if (pointer.index < 10 && cachedData[0]) {
          fileInfo.sequence = cachedData[0].sequence;
          fileInfo.timestamp = cachedData[0].timestamp;
          dispatch(loadLogs(fileInfo, -200));
        }
      }
      obj = keyboardFlip(
        pageRowNum,
        skipRowNum,
        flipNum,
        e.keyCode,
        logScroller
      );
    } else if (e.deltaY) {
      return;
      // obj = museWheelFlip((<WheelEvent>e).deltaY,flipNum,logScroller);
    } else {
      return;
    }
    if (obj == null) return;
    //outOfBoundary(obj,pointer+obj.offset,cachedData.length);
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: {
        pointer: logScroller.getPointer(),
        flipNum: flipNum + obj.offset
      }
    });
  };
}

export function stopFlipLog(e) {
  return {
    type: PAGE_UPDATE_NOREFRESH,
    state: {
      skipLineNum: 0,
      keyDescripe: ""
    }
  };
}

export function calcDefaultConfit(el, generator) {
  let { top, bottom, left, right, height, width } = el.getBoundingClientRect();
  let pageColNum = Math.floor((width - 2 * 16) / 9);
  let pageRowNum = Math.floor(height / 25);
  return {
    type: PAGE_UPDATE_REFRESH,
    state: {
      pageRowNum: pageRowNum,
      pageColNum: pageColNum
    }
  };
}

export function showPanel(showPanelFlag) {
  return {
    type: PAGE_UPDATE_REFRESH,
    state: {
      showPanelFlag: showPanelFlag
    }
  };
}

export function setDisplayConfig(configStr) {
  return {
    type: PAGE_UPDATE_REFRESH,
    state: { displayConfig: configStr }
  };
}

export function initLogScroller(lsClass, defaultTextColor) {
  return (dispatch, getState) => {
    let { cachedData, pointer, pageColNum, detailTags } = getState().page;
    dispatch({
      type: PAGE_UPDATE_NOREFRESH,
      state: {
        logScroller: new lsClass(
          cachedData,
          pointer,
          pageColNum,
          detailTags,
          defaultTextColor
        )
      }
    });
  };
}

export function applyConfig() {
  return (dispatch, getState) => {
    let { displayConfig, logScroller } = getState().page;
    let { skipLineNum, detailTags, pageLineNum } = JSON.parse(displayConfig);
    logScroller.setDetailTags(detailTags);
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: {
        skipLineNum: skipLineNum,
        detailTags: detailTags,
        pageLineNum: pageLineNum
      }
    });
  };
}

export function loadLogs(fileInfo, cnt) {
  return {
    type: TAPE_LOAD_LOGS,
    fileInfo,
    cnt
  };
}
