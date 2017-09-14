import { FULLSCREEN } from "../../constValues/displayMode";
import { app } from "arena-building-appconfig/settings";
import bundle from "./bundle";

export default {
  path: app.contextRoot + "/OAuthCallBack",
  displayMode: FULLSCREEN,
  isLoginFree: true,
  bundle
};
