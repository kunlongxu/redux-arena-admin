import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as frameActions from "./redux/frameActions";
import Header from "./Header";
import { NOMAL_PAGE, FULLSCREEN, ONLY_HEADER } from "./displayModes";
import { Layout, Menu, Icon, Button, Progress } from "antd";
import { withRouter } from "react-router-dom";
import SceneSwitch from "../arena/SceneSwitch";
import LeftNav from "./LeftNav";

const { Sider, Content } = Layout;

// @withRouter
class Frame extends Component {
  // static propTypes = {
  //   history: PropTypes.object.isRequired
  // };

  constructor(props) {
    super(props);
  }
  componentWillMount() {
    this.props.setRootRoute(this.props.rootRoute);
    this.props.registerHistory(this.props.history);
    // this.props.registerResizeHandler();
  }

  // componentWillUnmount() {
  //   // this.props.unregisterResizeHandler();
  // }

  componentWillReceiveProps(nextProps) {
    if (this.props.rootRoute !== nextProps.rootRoute) {
      nextProps.setRootRoute(this.props.rootRoute);
    }
  }
  findDisMode(routerComs, location) {
    let curItem = routerComs.find(i => i.key == location.pathname);
    console.log(curItem)
    return curItem
      ? curItem.props.displayMode ? curItem.props.displayMode : NOMAL_PAGE
      : NOMAL_PAGE;
  }
  render() {
    let {
      rootRoute,
      userInfo,
      muiTheme,
      pageLoading,
      routerComs,
      match,
      location
    } = this.props;
    let displayMode = this.findDisMode(routerComs, location);
    console.log(routerComs, location, "-----------------frame", match, displayMode);
    switch (displayMode) {
      case ONLY_HEADER:
        return (
          <div style={{ height: "100%" }}>
            <Progress
              strokeWidth={2}
              percent={40}
              showInfo={false}
              style={{ position: "absolute", zIndex: 99, fontSize: 0 }}
            />
            <Layout style={{ height: "100%", flexDirection: "row" }}>
              <Header />
              <Content
                style={{
                  margin: "24px 16px",
                  padding: "0.5rem",
                  background: "#fff",
                  minHeight: 280
                }}
              >
                <SceneSwitch>
                  {routerComs}
                </SceneSwitch>
              </Content>
            </Layout>
          </div>
        );
      case FULLSCREEN:
        return (
          <div style={{ height: "100%" }}>
            <Layout style={{ height: "100%", flexDirection: "row" }}>
              <SceneSwitch>
                {routerComs}
              </SceneSwitch>
            </Layout>
          </div>
        );
      default:
        return (
          <div style={{ height: "100%" }}>
            <Progress
              strokeWidth={2}
              percent={40}
              showInfo={false}
              style={{ position: "absolute", zIndex: 99, fontSize: 0 }}
            />
            <Layout style={{ height: "100%", flexDirection: "row" }}>
              <LeftNav />
              <Layout>
                <Header />
                <Content
                  style={{
                    margin: "24px 16px",
                    padding: "0.5rem",
                    background: "#fff",
                    minHeight: 280
                  }}
                >
                  <SceneSwitch>
                    {routerComs}
                  </SceneSwitch>
                </Content>
              </Layout>
            </Layout>
          </div>
        );
    }
  }
}

function mapStateToProps(state) {
  return {
    history: state.arena.history,
    snackbar: state.frame.snackbar,
    userInfo: state.frame.userInfo,
    pageLoading: state.frame.pageLoading,
    // displayMode: state.frame.displayMode,
    routerComs: state.frame.routerComs
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(frameActions, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Frame));
