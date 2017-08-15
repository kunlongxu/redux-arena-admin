import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { enhenceAction } from "./commons/actions";
import PublicScene from "../arena/PublicScene";
import PrivateScene from "../arena/PrivateScene";
import { withRouter } from "react-router-dom";
import { app } from "../appconfig/settings"


@withRouter
class SceneBundle extends Component {
  checkLogin() {
    let { userInfo, isLoadingUser } = this.props
    return new Promise((resolve, reject) => {
      if (userInfo == null && isLoadingUser === false) {
        sessionStorage.setItem("backUrl", window.location.pathname);
        resolve(false)
      } else {
        resolve(true)
      }
    })
  }
  render() {
    let {
      isLoginFree,
      isLoadingUser,
      userInfo,
      match,
      asyncSceneBundle,
      path
    } = this.props;
    if (isLoadingUser) return <div>登录验证中...</div>;
    if (isLoginFree) {
      return <PublicScene exact {...{ path, asyncSceneBundle }} />
    }
    // if (userInfo == null && match.path !== "login") {
    //   return <div>登录页跳转中...</div>
    // }
    return <PrivateScene
      exact
      {...{ path, asyncSceneBundle }}
      onValidate={this.checkLogin.bind(this)}
      onPass={() => { }}
      onReject={() => {
        console.log("onReject")
        /* this.props.history.push("/" + app.contextRoot + "/login"); */
      }}
    />;
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

export default connect(mapStateToProps, mapDispatchToProps)(SceneBundle);
