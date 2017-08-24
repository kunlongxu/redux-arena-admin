import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { enhenceAction } from "../commons/actions";
import PublicScene from "../../arena/PublicScene";
import PrivateScene from "../../arena/PrivateScene";
import { withRouter } from "react-router-dom";
import { app } from "../../appconfig/settings";
import * as actions from "./actions";

class AdminPage extends Component {
  onReject = () => {
    console.log("onReject");
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
    if (isLoginFree) {
      return <PublicScene exact {...{ path, asyncSceneBundle }} />;
    }
    return (
      <PrivateScene
        exact
        {...{ path, asyncSceneBundle }}
        onValidate={cb => validateUser(cb)}
        onPass={() => {
          console.log("onPass");
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

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AdminPage)
);
