import { PAGE_UPDATE_REFRESH, PAGE_UPDATE_NOREFRESH, FRAME_UPDATE_REFRESH } from 'barcsys-dashboard/redux/actionTypes.js'
import { gGet, gDel, gPost, gPut } from 'barcsys-dashboard/commons/httpFunc'
import { tapeService } from 'appconfig/apiUrl'
import { showMessage } from 'barcsys-dashboard/commons/commonFunc'

export function loadList() {
  return (dispatch, getState) => {
    gPost(tapeService.logfileQuery, getState().page.queryData)
      .then(data => {
        dispatch({
          type: PAGE_UPDATE_REFRESH,
          state: {
            filesData: data.data,
            cnt: data.totalRecordCount,
            maxPageNum: data.totalPageCount,
            pageNumText: String(data.currentPageIdx + 1)
          }
        })
      })
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

export function turnPage(pageNum) {
  return (dispatch, getState) => {
    let state = getState().page;
    let {queryData, maxPageNum, pageNumText} = state;
    if (isNaN(pageNum)) {
      dispatch(showMessage(`页数：${pageNumText} 不是有效整数`))
      return
    }
    let curPageNum = queryData.currentPageIdx;
    if (pageNum > maxPageNum) {
      dispatch(showMessage(`页数：${pageNum} 大于最大页数`))
      return
    }
    if (pageNum < 1) {
      dispatch(showMessage(`页数：${pageNum} 小于1`))
      return
    }
    state.queryData.currentPageIdx = pageNum - 1
    dispatch(loadList())

  }
}

export function redoTask(taskId) {
  return (dispatch, getState) => {
    gGet(tapeService.redoTask + '/' + taskId).then((data) => {
      dispatch(showMessage('开始重新生成文件..'))
      dispatch(loadList())
    })
  }
}