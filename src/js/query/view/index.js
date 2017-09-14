import React, { Component } from "react";
import ActionDescription from "material-ui/svg-icons/action/description";
import { initState } from "./redux/initState";
import pageSaga from "./redux/saga";
import PageBundle from "barcsys-components/PageBundle";

const ayncLogView = import("./LogView");

module.exports = {
  name: "浏览",
  icon: ActionDescription,
  path: "view/:app/:machine/:sequence/:timestamp",
  component: ({ match, location, history }) =>
    <PageBundle
      asyncModule={ayncLogView}
      pageSaga={pageSaga}
      initState={initState()}
      {...{ match, location, history }}
    />
};
