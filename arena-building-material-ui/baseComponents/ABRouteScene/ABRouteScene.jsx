import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { RouteScene } from "redux-arena";
import { app } from "arena-building-appconfig/settings";

const LoadingComponent = () => <div>Loading User Info</div>;

export default class ABRouteScene extends Component {
  static propTypes = {
    asyncSceneBundle: PropTypes.any,
    sceneBundle: PropTypes.object,
    sceneProps: PropTypes.object,
    SceneLoadingComponent: PropTypes.any,
    SceneValidatingComponent: PropTypes.any,
    exact: PropTypes.bool,
    strict: PropTypes.bool,
    path: PropTypes.string
  };

  static defaultProps = { exact: true };

  componentWillMount() {
    this.verifyUser(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.verifyUser(nextProps);
  }

  verifyUser = props => {
    if (!props.isLoadingUserInfo) {
      if (props.userInfo != null) {
        props.actions.setState({ isValid: true });
      } else {
        sessionStorage.setItem("backUrl", window.location.pathname);
        props.frameActions.goToUrl("/" + app.contextRoot + "/login");
      }
    }
  };

  render() {
    let {
      isValid,
      exact,
      sceneBundle,
      asyncSceneBundle,
      path,
      computedMatch,
      location,
      isLoadingUserInfo,
      notifyData
    } = this.props;
    return isLoadingUserInfo ? (
      <Route {...{ exact, path, component: LoadingComponent }} />
    ) : (
      <RouteScene
        {...{
          exact,
          path,
          sceneBundle,
          asyncSceneBundle,
          computedMatch,
          location,
          notifyData
        }}
      />
    );
  }
}
