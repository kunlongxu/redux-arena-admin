import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import invariant from "invariant";
import { ARENA_SWITCH_SET_STATE } from "../../core/actionTypes";
import { arenaSwitchConnect } from "../SceneBundle";

class RouteScene extends Component {
  static contextTypes = {
    arenaReducerDict: PropTypes.object,
    arenaSwitchDictItem: PropTypes.object,
    store: PropTypes.any
  };

  static propTypes = {
    asyncSceneBuldle: PropTypes.any,
    sceneBundle: PropTypes.any,
    SceneLoadingComponent: PropTypes.any,
    sceneProps: PropTypes.object,
    isNotifyOn: PropTypes.bool,
    notifyData: PropTypes.object,
    exact: PropTypes.bool,
    path: PropTypes.string,
    strict: PropTypes.bool
  };

  static defaultProps = {
    isNotifyOn: true,
    exact: true
  };

  componentWillMount() {
    let { arenaReducerDict, arenaSwitchDictItem } = this.context;
    invariant(
      arenaSwitchDictItem,
      "You should not use <RouteScene> outside a <ArenaSwitch>"
    );
    let newArenaReducerDict = Object.assign({}, arenaReducerDict, {
      _curSwitch: arenaSwitchDictItem
    });
    let {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent,
      sceneProps,
      isNotifyOn
    } = this.props;
    let wrappedSceneBundle = arenaSwitchConnect(newArenaReducerDict);
    let sceneBundleElement = React.createElement(wrappedSceneBundle, {
      asyncSceneBundle,
      sceneBundle,
      SceneLoadingComponent,
      sceneProps,
      isNotifyOn
    });
    this.state = {
      wrappedSceneBundle,
      sceneBundleElement
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    let refreshFlag = false;
    let {
      asyncSceneBundle,
      sceneBundle,
      sceneProps,
      isNotifyOn,
      SceneLoadingComponent
    } = nextProps;
    if (
      this.context.arenaReducerDict !== nextContext.arenaReducerDict ||
      this.context.arenaSwitchDictItem !== nextContext.arenaSwitchDictItem
    ) {
      let newArenaReducerDict = Object.assign(
        {},
        nextContext.arenaReducerDict,
        {
          _curSwitch: arenaSwitchDictItem
        }
      );
      this.state.wrappedSceneBundle = arenaSwitchConnect(newArenaReducerDict);
      refreshFlag = true;
    }
    if (
      asyncSceneBundle !== this.props.asyncSceneBundle ||
      sceneBundle !== this.props.sceneBundle ||
      sceneProps !== this.props.sceneBundle ||
      SceneLoadingComponent !== this.props.SceneLoadingComponent ||
      isNotifyOn !== this.props.isNotifyOn ||
      refreshFlag === true
    ) {
      this.setState({
        sceneBundleElement: React.createElement(this.state.wrappedSceneBundle, {
          asyncSceneBundle,
          sceneBundle,
          sceneProps,
          isNotifyOn,
          SceneLoadingComponent
        })
      });
    }
  }

  render() {
    let {
      exact,
      strict,
      path,
      computedMatch,
      location,
      notifyData
    } = this.props;
    let { store, arenaReducerDict } = this.context;
    return (
      <Route
        location={location}
        computedMatch={computedMatch}
        exact={exact}
        path={path}
        strict={strict}
        render={props => {
          store.dispatch({
            type: ARENA_SWITCH_SET_STATE,
            arenaSwitchReducerKey: arenaReducerDict._curSwitch.reducerKey,
            state: props
          });
          return React.cloneElement(this.state.sceneBundleElement, {
            notifyData: Object.assign({}, props, notifyData)
          });
        }}
      />
    );
  }
}

export default RouteScene;
