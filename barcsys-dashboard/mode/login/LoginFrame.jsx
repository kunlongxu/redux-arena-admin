import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "./redux/actions";
import { guardianOAuthUrl } from "appconfig/apiUrl";
import { enhenceAction } from "barcsys-dashboard/commons/actions";
import { app } from "appconfig/settings";

class LoginFrame extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let token = sessionStorage.getItem("X-Session-Token");
    this.props.initUserAndJump(token);
    window.initUserAndJump = this.props.initUserAndJump;
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

function mapStateToProps(state) {
  return {
    userInfo: state.frame.userInfo,
    location: state.frame.location
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction(actions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginFrame)
