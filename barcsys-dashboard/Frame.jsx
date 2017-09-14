import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as frameActions from "./redux/frameActions";
import Header from "./Header";
import { NOMAL_PAGE, FULLSCREEN, ONLY_HEADER } from "./displayModes";
import { Layout, Menu, Icon, Button, Progress } from "antd";
import { withRouter } from "react-router-dom";
import { ArenaSwitch } from "redux-arena";
import LeftNav from "./LeftNav";

const { Sider, Content } = Layout;
class Frame extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.setRootRoute(this.props.rootRoute);
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
    return curItem
      ? curItem.props.displayMode ? curItem.props.displayMode : NOMAL_PAGE
      : NOMAL_PAGE;
  }

  rendLoadingBar(pageLoading) {
    return pageLoading.loadFlag ? (
      <Progress
        strokeWidth={2}
        percent={pageLoading.progress}
        showInfo={false}
        style={{ position: "absolute", zIndex: 99, fontSize: 0 }}
      />
    ) : null;
  }
  render() {
    let {
      rootRoute,
      userInfo,
      muiTheme,
      routerComs,
      displayMode,
      pageLoading
    } = this.props;
    switch (0) {
      case ONLY_HEADER:
        return (
          <div style={{ height: "100%" }}>
            {this.rendLoadingBar(pageLoading)}
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
                <ArenaSwitch>{routerComs}</ArenaSwitch>
              </Content>
            </Layout>
          </div>
        );
      case FULLSCREEN:
        return (
          <div style={{ height: "100%" }}>
            {this.rendLoadingBar(pageLoading)}
            <Layout style={{ height: "100%", flexDirection: "row" }}>
              <ArenaSwitch>{routerComs}</ArenaSwitch>
            </Layout>
          </div>
        );
      default:
        return (
          <div style={{ height: "100%" }}>
            {this.rendLoadingBar(pageLoading)}
            <Layout style={{ height: "100%", flexDirection: "row" }}>
              <LeftNav />
              <Layout>
                <Header />
                <Content
                  style={{
                    margin: "24px 16px",
                    padding: "0.5rem",
                    background: "#fff",
                    minHeight: 280,
                    height: "100%"
                  }}
                >
                  <ArenaSwitch>{routerComs}</ArenaSwitch>
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
    snackbar: state.frame.snackbar,
    displayMode: state.frame.displayMode,
    routerComs: state.frame.routerComs,
    pageLoading: state.frame.pageLoading
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(frameActions, dispatch);
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Frame));
