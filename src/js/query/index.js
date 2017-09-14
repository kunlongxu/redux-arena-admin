import ActionSearch from "material-ui/svg-icons/action/search";

import FastRoute from "./fast";
import ViewRoute from "./view";
import DownloadRoute from "./download";

export default {
  name: "日志查询",
  icon: ActionSearch,
  path: "query",
  childRoutes: [FastRoute, ViewRoute, DownloadRoute]
};
