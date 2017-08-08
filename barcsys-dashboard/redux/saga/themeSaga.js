import {
  FRAME_CHANGE_THEME, FRAME_PAGE_REFRESH,FRAME_UPDATE_REFRESH
} from '../actionTypes'
import { takeLatest,takeEvery,take, put, call, fork, select, cancel } from 'redux-saga/effects'

function* changeTheme({themeType}) {
  localStorage.setItem('themeType', themeType)
  yield put({
    type: FRAME_UPDATE_REFRESH,
    state:{themeType}
  })
  yield put({
    type: FRAME_PAGE_REFRESH,
  })
}

export default function* framePageJumpSaga() {
  yield takeLatest(FRAME_CHANGE_THEME, changeTheme)
}