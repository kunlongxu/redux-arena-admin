import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { enhenceAction } from "../commons/actions";
import { PublicScene, PrivateScene } from "redux-arena";
import { withRouter } from "react-router-dom";
import { app } from "../../appconfig/settings";
import * as actions from "./actions";

@withRouter
class AdminPage extends Component {
  onReject = () => {
    console.log("onReject");
    sessionStorage.setItem("backUrl", window.location.pathname);
    this.props.jumpTo("/" + app.contextRoot + "/login");
  };

  render() {
    let {
      isLoginFree,
      asyncSceneBundle,
      path,
      validateUser,
      jumpTo
    } = this.props;
    console.log(isLoginFree, path);
    if (isLoginFree) {
      return <PublicScene exact {...{ path, asyncSceneBundle }} />;
    }
    return (
      <PrivateScene
        exact
        {...{ path, asyncSceneBundle }}
        onValidate={cb => validateUser(cb)}
        onPass={() => {
          console.log("onValidate====================");
        }}
        onReject={this.onReject}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction(actions), dispatch);
}

function mapStateToProps(state) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
