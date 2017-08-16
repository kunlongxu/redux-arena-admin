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

@withRouter
class AdminPage extends Component {
  render() {
    let {
      isLoginFree,
      match,
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
          console.log("onValidate====================")
        }}
        onReject={() => {
          this.props.history.push(app.contextRoot + "/login")
          console.log("onReject------------------")
        }}
      />
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction(actions), dispatch);
}

function mapStateToProps(state) {
  return {
    match: state.frame.match
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminPage);
