import { LOGIN_INITUSER_JUMP } from "./actionTypes.js";
import { gGet, gDel, gPost, gPut } from "barcsys-dashboard/commons/httpFunc";
import { jumpTo } from "barcsys-dashboard/commons/actions";
import { app } from "appconfig/settings";

export function initUserAndJump(token) {
  let backUrl = sessionStorage.getItem("backUrl");
  if (backUrl == null || backUrl === "/" + app.contextRoot + "/login")
    backUrl = "/" + app.contextRoot;
  return {
    type: LOGIN_INITUSER_JUMP,
    token,
    backUrl
  };
}
