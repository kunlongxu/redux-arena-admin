import React, { Component } from "react";
import muiThemeable from "material-ui/styles/muiThemeable";
import { guardianUrl } from "arena-building-appconfig/apiUrl";
import { app } from "arena-building-appconfig/settings";

class LoginFrame extends Component {

  componentWillMount() {
    let token = sessionStorage.getItem("X-Session-Token");
    this.props.actions.initUserAndBack(token);
    window.initUserAndBack = this.props.actions.initUserAndBack;
  }

  render() {
    return (
      <iframe
        style={{
          width: "100%",
          height: "calc(100% - 3px)"
        }}
        frameBorder="0"
        src={
          guardianUrl +
          "/OAuth?returnUrl=http://" +
          window.location.host +
          "/" +
          app.contextRoot +
          "/OAuthCallBack"
        }
        scrolling="no"
      />
    );
  }
}

export default muiThemeable()(LoginFrame);
