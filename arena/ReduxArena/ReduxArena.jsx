import React, { Component } from "react";
import PropTypes from "prop-types";
import { Router, Switch } from "react-router-dom";
import createHistory from "history/createBrowserHistory";

export default class ReduxArena extends Component {
  componentWillMount() {
    this.history = createHistory(this.props);
    this.props.setArenaHistory(this.history);
  }

  render() {
    return (
      <Router history={this.history}>
        {this.props.children}
      </Router>
    );
  }
}

ReduxArena.propTypes = {
  basename: PropTypes.string,
  forceRefresh: PropTypes.bool,
  getUserConfirmation: PropTypes.func,
  onHistoryChange: PropTypes.func,
  keyLength: PropTypes.number,
  children: PropTypes.any
};
