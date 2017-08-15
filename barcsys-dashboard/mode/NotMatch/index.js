import React from "react";
import PageBundle from "barcsys-components/PageBundle";
import { FULLSCREEN } from "barcsys-dashboard/displayModes";

const asyncNotMatch = import("./NotMatch");
export default {
  path: null,
  displayMode: FULLSCREEN,
  isLoginFree: true,
  component: parentProps =>
    <PageBundle asyncModule={asyncNotMatch} {...parentProps} />
};
