import React, { Component } from "react";
import ActionAlarmOn from "material-ui/svg-icons/action/alarm-on";
import initState from "./redux/initState";
import pageSaga from "./redux/saga";
import PageBundle from "barcsys-components/PageBundle";

const ayncAlertLogs = import("./AlertLogs");

export default {
  path: "logs",
  name: "报警信息",
  icon: ActionAlarmOn,
  component: parentProps =>
    <PageBundle
      asyncModule={ayncAlertLogs}
      pageSaga={pageSaga}
      initState={initState}
      {...parentProps}
    />
};
if (module.hot) {
  module.hot.accept("./AlertLogs", () => {
    window.reduxStore.dispatch({
      type: "FRAME_ROUTE_HOTREPLACE",
      hotReplaceData: {
        path: "/tape/alert/logs",
        component: require("./AlertLogs").default
      }
    });
  });

  module.hot.accept("./redux/saga", () => {
    window.reduxStore.dispatch({
      type: "FRAME_ROUTE_HOTREPLACE",
      hotReplaceData: {
        path: "/tape/alert/logs",
        saga: require("./redux/saga").default
      }
    });
  });
}