import React, { Component } from "react";
import FileFileDownload from "material-ui/svg-icons/file/file-download";
import initState from "./redux/initState";
import PageBundle from "barcsys-components/PageBundle";

const ayncLogDownload = import("./LogDownload");

export default {
  name: "下载",
  icon: FileFileDownload,
  path: "download",
  component: parentProps =>
    <PageBundle
      asyncModule={ayncLogDownload}
      initState={initState}
      {...parentProps}
    />
};
