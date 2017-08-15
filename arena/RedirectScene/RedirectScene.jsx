import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect, Switch } from "react-router-dom";

class RedirectScene extends Component {
  render() {
    let { exact, from, to, ...rest } = this.props;
    return <Redirect exact={exact} push={push} from={from} to={to} {...rest} />;
  }
}

RedirectScene.propTypes = {
  exact: PropTypes.bool,
  push: PropTypes.bool,
  from: PropTypes.string,
  to: PropTypes.string.isRequired
};
export default RedirectScene;
