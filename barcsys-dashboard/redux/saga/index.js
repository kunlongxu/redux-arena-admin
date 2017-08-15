/* eslint-disable no-constant-condition */
import { take, put, call, fork, select, all } from "redux-saga/effects";
import userInfoSaga from "./userInfoSaga";
import userSessionSaga from "./userSessionSaga";
import frameLoadPageSaga from "./frameLoadPageSaga";
import pageJumpSaga from "./pageJumpSaga";
import componentSaga from "./componentSaga";
import pageReduxSaga from "./pageReduxSaga";
import customReduxSaga from "./customReduxSaga";
import themeSaga from "./themeSaga";
import resizeEventSaga from "./resizeEventSaga";
import frameLoadCommonDataSaga from "./frameLoadCommonDataSaga";
import routerSaga from "./routerSaga";

export default function* root() {
  yield all([
    fork(pageJumpSaga),
    // fork(frameLoadPageSaga),
    // fork(pageReduxSaga),
    // fork(customReduxSaga),
    fork(userSessionSaga),
    fork(userInfoSaga),
    fork(componentSaga),
    // fork(themeSaga),
    // fork(resizeEventSaga),
    // fork(frameLoadCommonDataSaga),
    fork(routerSaga)
  ]);
}
