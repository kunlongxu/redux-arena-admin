import { FULLSCREEN } from "../../constValues/displayMode";
import { app } from "arena-building-appconfig/settings";
import bundle from "./bundle";

export default {
  path: app.contextRoot + "/login",
  displayMode: FULLSCREEN,
  isLoginFree: true,
  bundle
};
