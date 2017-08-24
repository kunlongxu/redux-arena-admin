import React from "react";
import RouteScene from "redux-arena/RouteScene";
import { FULLSCREEN } from "barcsys-dashboard/displayModes";
import { app } from "appconfig/settings";

export default {
  path: app.contextRoot + "/login",
  name: "登录",
  displayMode: FULLSCREEN,
  isLoginFree: true,
  asyncBundle: import("./asyncBundle")
};
