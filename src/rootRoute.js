import { ONLY_HEADER } from "barcsys-dashboard/displayModes";
import { app } from "appconfig/settings";
import PageABundle from "./pageABundle"

const rootRoute = {
  path: "/" + app.contextRoot,
  indexRoutePath: "/" + app.contextRoot + "/app",
  name: "统一配置系统",
  displayMode: ONLY_HEADER,
  childRoutes: [
    PageABundle
  ]
};
export default rootRoute
