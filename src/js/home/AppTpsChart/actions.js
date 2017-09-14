import { LOAD_APP_TPS_DATA } from "./actionTypes";

export function loadAppTpsData(appId) {
  return {
    type: LOAD_APP_TPS_DATA,
    appId
  };
}
