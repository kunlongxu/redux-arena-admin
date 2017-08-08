const settings = require("./settings");
const settingsFunc = require("./settings.func");
const settingsProd = require("./settings.prod");

let exportModule = null;
switch (process.env.BUILD_ENV) {
  case "prod":
    exportModule = settingsProd;
    break;
  case "func":
    exportModule = settingsFunc;
    break;
  case "dev":
    exportModule = settings;
    break;
  default:
    exportModule = settings;
}

module.exports = exportModule;
