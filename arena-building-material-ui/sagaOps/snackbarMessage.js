import { getSceneActions } from "redux-arena/sagaOps";

export default function* showMessage(message, delayFunc, failCb) {
  let { handleSnackbar } = yield* getSceneActions("pageContainer");
  if (delayFunc != null) {
    return handleSnackbar(
      true,
      message,
      "撤销",
      new Date().getTime(),
      delayFunc,
      failCb
    );
  } else {
    return handleSnackbar(true, message);
  }
}
