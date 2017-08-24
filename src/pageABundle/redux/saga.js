import { fork, put } from "redux-saga/effects";
import { delay } from "redux-saga";
import { setSceneState } from "redux-arena/sceneStateOps";

function* dynamicState() {
  while (true) {
    yield delay(500);
    yield setSceneState({ dynamicState: Math.floor(Math.random() * 100) });
  }
}

export default function* saga() {
  yield fork(dynamicState);
}
