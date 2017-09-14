import ActionAlarm from "material-ui/svg-icons/action/alarm";
import RulesRoute from "./rules";
import LogsRoute from "./logs";
import { app } from "appconfig/settings";

export default {
  path: "alert",
  name: "报警",
  icon: ActionAlarm,
  indexRoutePath: "/" + app.contextRoot + "/alert/rules",
  childRoutes: [RulesRoute, LogsRoute]
};
