import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { enhenceAction } from "./commons/actions";

class PublicRoute extends Component {
  render() {
    let { userInfo: userInfo, match: match, ...rest } = this.props;
    return <Route {...rest} />;
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction({}), dispatch);
}

function mapStateToProps(state) {
  return {
    userInfo: state.frame.userInfo,
    match: state.frame.match
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PublicRoute);
