import React from "react";
import { FULLSCREEN } from "barcsys-dashboard/displayModes";

const asyncNotMatch = import("./NotMatch");
export default {
  path: null,
  displayMode: FULLSCREEN,
  isLoginFree: true,
  asyncBundle: import("./asyncBundle")
};
