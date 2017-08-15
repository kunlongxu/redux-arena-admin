import React from "react";
import { FULLSCREEN } from "barcsys-dashboard/displayModes";
import { app } from "appconfig/settings";


export default {
  path: app.contextRoot + "/OAuthCallBack",
  displayMode: FULLSCREEN,
  isLoginFree: true,
  asyncBundle: import("./asyncBundle")
};
