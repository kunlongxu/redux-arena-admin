import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

export default class SceneSwitch extends Component {
  componentWillMount() {}

  render() {
    console.log(123213)
    return (
      <Switch>
        {this.props.children}
      </Switch>
    );
  }
}

SceneSwitch.propTypes = {
  children: PropTypes.any
};
