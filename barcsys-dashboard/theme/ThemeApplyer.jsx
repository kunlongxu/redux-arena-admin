import React from 'react';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { connect } from 'react-redux'
import lightTheme from './lightTheme'
import darkTheme from './darkTheme'

export function getTheme(type) {
  switch (type) {
    case 'light':
      document.documentElement.style.backgroundColor = lightTheme.htmlBackgroundColor
      return Object.assign({}, lightBaseTheme, lightTheme)
    case 'dark':
      document.documentElement.style.backgroundColor = darkTheme.htmlBackgroundColor
      let themeObj = Object.assign({}, darkBaseTheme, darkTheme)
      themeObj.palette = Object.assign({}, darkBaseTheme.palette, darkTheme.palette)
      return Object.assign(themeObj)
    default:
      return Object.assign({}, lightBaseTheme, lightTheme)
  }
}

class ThemeApplyer extends React.Component {
  render() {
    let {themeType, children} = this.props;
    return <MuiThemeProvider muiTheme={getMuiTheme(getTheme(themeType))}>
      {children}
    </MuiThemeProvider>
  }
}

function mapStateToProps(state) {
  return {
    themeType: state.frame.themeType
  }
}

export default connect(mapStateToProps)(ThemeApplyer)
