import React, { Component } from "react";
import ActionAlarmAdd from "material-ui/svg-icons/action/alarm-add";
import initState from "./redux/initState";
import pageSaga from "./redux/saga";
import loadAlertRules from "bundle-loader?lazy!./AlertRules";
import PageBundle from "barcsys-components/PageBundle";

const ayncAlertRules = import("./AlertRules");

module.exports = {
  path: "rules",
  name: "报警规则",
  icon: ActionAlarmAdd,
  component: parentProps =>
    <PageBundle
      asyncModule={ayncAlertRules}
      pageSaga={pageSaga}
      initState={initState}
      {...parentProps}
    />
};
