import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { enhenceAction } from "./commons/actions";
import { app } from "appconfig/settings";

class PrivateRoute extends Component {
  componentWillMount() {
    if (this.props.userInfo == null && this.props.isLoadingUser === false) {
      sessionStorage.setItem("backUrl", window.location.pathname);
      this.props.jumpTo("/" + app.contextRoot + "/login", true);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userInfo == null && nextProps.isLoadingUser === false) {
      sessionStorage.setItem("backUrl", window.location.pathname);
      this.props.jumpTo("/" + app.contextRoot + "/login", true);
    }
  }

  render() {
    let {
      userInfo: userInfo,
      match: match,
      isLoadingUser: isLoadingUser,
      ...rest
    } = this.props;
    if (isLoadingUser) return <div>登录验证中...</div>;
    if (userInfo == null && match.path !== "login") {
      return <div>登录页跳转中...</div>;
    }
    return <Route {...rest} />;
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction({}), dispatch);
}

function mapStateToProps(state) {
  return {
    userInfo: state.frame.userInfo,
    match: state.frame.match,
    isLoadingUser: state.frame.isLoadingUser
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);
