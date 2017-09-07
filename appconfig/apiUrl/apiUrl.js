const guardianAuthRoot = "/dev_com_barcsys_guardian-aal";

export const guardianAuth = {
  root: guardianAuthRoot,
  login: guardianAuthRoot + "/login",
  apps: guardianAuthRoot + "/apps",
  menus: guardianAuthRoot + "/v1/menus?sysCode=Collie",
  session: guardianAuthRoot + "/v1/session"
};
export const guardianUrl =
  "http://func-inf.wexfin.com/func_com_barcsys_guardianui";
export const guardianOAuthUrl =
  "http://func-inf.wexfin.com/func_com_barcsys_guardianui/OAuth";
