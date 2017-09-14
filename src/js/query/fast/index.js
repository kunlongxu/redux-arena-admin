import React, { Component } from "react";
import ActionZoomOut from "material-ui/svg-icons/action/zoom-out";
import initState from "./redux/initState";
import pageSaga from "./redux/saga";
import PageBundle from "barcsys-components/PageBundle";

const ayncFastQuery = import("./FastQuery");

module.exports = {
  name: "查询",
  icon: ActionZoomOut,
  path: "query",
  component: parentProps =>
    <PageBundle
      asyncModule={ayncFastQuery}
      pageSaga={pageSaga}
      initState={initState}
      {...parentProps}
    />
};
