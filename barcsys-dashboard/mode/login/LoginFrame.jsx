import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { guardianOAuthUrl } from "appconfig/apiUrl";
import { app } from "appconfig/settings";

export default class LoginFrame extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let token = sessionStorage.getItem("X-Session-Token");
    this.props.initUserAndJump(token);
    window.initUserAndJump = this.props.initUserAndJump;
  }

  render() {
    console.log(this.props)
    return (
      <iframe
        style={{
          width: "100%",
          height: "calc(100% - 3px)"
        }}
        frameBorder="0"
        src={
          guardianOAuthUrl +
          "?returnUrl=http://" +
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
