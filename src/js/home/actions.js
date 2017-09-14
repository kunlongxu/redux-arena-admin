import { LOAD_APPDATA, LOAD_TAPEDATA } from "./actionTypes";

export function loadAppData() {
  return {
    type: LOAD_APPDATA
  };
}

export function loadTapeData() {
  return {
    type: LOAD_TAPEDATA
  };
}
