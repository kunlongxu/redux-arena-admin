import React, { Component } from "react";
import CommunicationCallSplit from "material-ui/svg-icons/communication/call-split";
import initState from "./redux/initState";
import PageBundle from "barcsys-components/PageBundle";
import loadDataPump from "bundle-loader?lazy!./DataPump";

const ayncDataPump = import("./DataPump");

export default {
  name: "数据抽取",
  icon: CommunicationCallSplit,
  path: "datapump",
  component: parentProps =>
    <PageBundle
      asyncModule={ayncDataPump}
      initState={initState}
      {...parentProps}
    />
};
