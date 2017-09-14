import { INITUSER_AND_BACK } from "./actionTypes.js";
import { app } from "arena-building-appconfig/settings";

export function initUserAndBack(token) {
  let backUrl = sessionStorage.getItem("backUrl");
  if (backUrl == null || backUrl === "/" + app.contextRoot + "/login")
    backUrl = "/" + app.contextRoot;
  return {
    type: INITUSER_AND_BACK,
    token,
    backUrl
  };
}
