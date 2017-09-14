import {
  ARENA_SCENE_CLEAR_REDUX,
  ARENA_SCENE_REPLACE_STATE,
  ARENA_SWITCH_SET_STATE
} from "../actionTypes";
import { ARENA_SCENE_SET_STATE } from "../../actionTypes";
import {
  takeEvery,
  take,
  put,
  call,
  fork,
  spawn,
  select,
  cancel,
  cancelled,
  getContext,
  setContext
} from "redux-saga/effects";
import { bindActionCreators } from "redux";
import { bindArenaActionCreators } from "../enhencedRedux";
import createSenceReducer from "../reducers/createSenceReducer";
import {
  sceneAddReducer,
  sceneReplaceReducer,
  sceneRmAndAddReducer
} from "../../utils";
import { getArenaSwitchInitState } from "../reducers";

const defaultActions = {
  setState: state => ({ type: ARENA_SCENE_SET_STATE, state })
};

function calcNewReduxInfo(reduxInfo, newReduxInfo, dispatch, isPlainActions) {
  let connectedActions = reduxInfo.connectedActions;
  let newArenaReducerDict = reduxInfo.arenaReducerDict;
  if (
    reduxInfo.reducerKey !== newReduxInfo.reducerKey ||
    reduxInfo.vReducerKey !== newReduxInfo.vReducerKey ||
    reduxInfo.parentArenaReducerDict !== newReduxInfo.parentArenaReducerDict ||
    reduxInfo.actions !== newReduxInfo.actions
  ) {
    //calc actions
    if (
      reduxInfo.actions !== newReduxInfo.actions ||
      connectedActions == null
    ) {
      if (isPlainActions === true) {
        connectedActions = bindActionCreators(
          newReduxInfo.actions || defaultActions,
          dispatch
        );
      } else {
        connectedActions = bindArenaActionCreators(
          newReduxInfo.actions || defaultActions,
          dispatch,
          newReduxInfo.reducerKey
        );
      }
    }
    //calc arena reducer dict
    let item = {
      reducerKey: newReduxInfo.reducerKey,
      vReducerKey: newReduxInfo.vReducerKey,
      actions: connectedActions
    };
    newArenaReducerDict = Object.assign(newReduxInfo.parentArenaReducerDict, {
      [newReduxInfo.reducerKey]: item,
      _curScene: item
    });
    if (newReduxInfo.vReducerKey != null)
      newArenaReducerDict[newReduxInfo.vReducerKey] = item;
  }
  return Object.assign({}, newReduxInfo, {
    connectedActions,
    arenaReducerDict: newArenaReducerDict
  });
}

function* forkSagaWithContext(saga, ctx) {
  yield setContext(ctx);
  yield fork(saga);
}

export function* sceneApplyRedux({
  parentArenaReducerDict,
  state,
  saga,
  actions,
  reducer,
  options,
  curSceneBundle,
  reduxInfo
}) {
  let newReducerKey = reduxInfo.reducerKey;
  let arenaStore = yield getContext("store");
  try {
    if (saga !== curSceneBundle.saga) {
      if (reduxInfo.sagaTask) yield cancel(reduxInfo.sagaTask);
    }
  } finally {
    if (yield cancelled()) {
    }
  }
  let reducerFactory = bindingReducerKey =>
    createSenceReducer(
      reducer,
      bindingReducerKey,
      state,
      parentArenaReducerDict
    );
  if (reduxInfo.reducerKey == null) {
    newReducerKey = sceneAddReducer(
      arenaStore,
      options.reducerKey,
      reducerFactory
    );
  } else if (
    options.reducerKey == null ||
    options.reducerKey === reduxInfo.reducerKey
  ) {
    if (reducer !== curSceneBundle.reducer || state !== curSceneBundle.state) {
      newReducerKey = sceneReplaceReducer(
        arenaStore,
        reduxInfo.reducerKey,
        reducerFactory
      );
    }
  } else if (options.reducerKey !== reduxInfo.reducerKey) {
    newReducerKey = sceneRmAndAddReducer(
      arenaStore,
      reduxInfo.reducerKey,
      options.reducerKey,
      reducerFactory
    );
  }

  let newReduxInfo = calcNewReduxInfo(
    reduxInfo,
    {
      reducerKey: newReducerKey,
      vReducerKey: options.vReducerKey,
      parentArenaReducerDict,
      actions
    },
    arenaStore.dispatch,
    options.isPlainActions
  );

  if (saga) {
    if (
      saga !== curSceneBundle.saga ||
      newReducerKey !== reduxInfo.reducerKey ||
      reduxInfo.sagaTask.isCancelled()
    ) {
      newReduxInfo.sagaTask = yield spawn(forkSagaWithContext, saga, {
        arenaReducerDict: newReduxInfo.arenaReducerDict
      });
    }
  }
  return newReduxInfo;
}

function* sceneClearRedux({ arenaSwitchReducerKey, reduxInfo }) {
  let arenaStore = yield getContext("store");
  if (reduxInfo.sagaTask) yield cancel(reduxInfo.sagaTask);
  if (reduxInfo.reducerKey) {
    yield put({
      type: ARENA_SWITCH_SET_STATE,
      arenaSwitchReducerKey: arenaSwitchReducerKey,
      state: {
        PlayingScene: null,
        curSceneBundle: {},
        reduxInfo: {}
      }
    });
    arenaStore.removeReducer(reduxInfo.reducerKey);
  }
}

export default function* saga() {
  yield takeEvery(ARENA_SCENE_CLEAR_REDUX, sceneClearRedux);
}
