import home from "./home";
// import FastQueryRoute from "./query/fast";
// import DownloadQueryRoute from "./query/download";
// import ViewQueryRoute from "./query/view";
// import DatapumpRoute from "./datapump";
// import AlertRoute from "./alert";
import { app } from "arena-building-appconfig/settings";

export default {
  name: "统一日志系统",
  path: "/" + app.contextRoot,
  indexRoutePath: "/" + app.contextRoot + "/home",
  childRoutes: [
    home
    // FastQueryRoute,
    // DownloadQueryRoute,
    // ViewQueryRoute,
    // DatapumpRoute,
    // AlertRoute
  ]
};
