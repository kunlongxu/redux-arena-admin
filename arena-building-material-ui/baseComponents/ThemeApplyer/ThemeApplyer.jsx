import React from "react";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import lightBaseTheme from "material-ui/styles/baseThemes/lightBaseTheme";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import lightTheme from "./lightTheme";
import darkTheme from "./darkTheme";
import { LIGHT_THEME, DARK_THEME } from "../../constValues/theme";

function getTheme(type) {
  switch (type) {
    case "LIGHT_THEME":
      document.documentElement.style.backgroundColor =
        lightTheme.htmlBackgroundColor;
      return Object.assign({}, lightBaseTheme, lightTheme);
    case "DARK_THEME":
      document.documentElement.style.backgroundColor =
        darkTheme.htmlBackgroundColor;
      let themeObj = Object.assign({}, darkBaseTheme, darkTheme);
      themeObj.palette = Object.assign(
        {},
        darkBaseTheme.palette,
        darkTheme.palette
      );
      return Object.assign(themeObj);
    default:
    document.documentElement.style.backgroundColor =
      lightTheme.htmlBackgroundColor;
      return Object.assign({}, lightBaseTheme, lightTheme);
  }
}

export default class ThemeApplyer extends React.Component {
  render() {
    let { themeType, children } = this.props;
    return (
      <MuiThemeProvider muiTheme={getMuiTheme(getTheme(themeType))}>
        {children}
      </MuiThemeProvider>
    );
  }
}
