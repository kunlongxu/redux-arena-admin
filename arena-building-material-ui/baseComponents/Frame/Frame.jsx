import React, { Component } from "react";
import PropTypes from "prop-types";
import { ArenaSwitch } from "redux-arena";
import { Layout, Progress } from "antd";
import Header from "../Header";
import PageContainer from "../PageContainer";
import { NOMAL_PAGE, FULLSCREEN } from "../../constValues/displayMode";
import LeftNav from "./LeftNav";
const { Content } = Layout;
export default class Frame extends Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    rootRoute: PropTypes.object,
    preDefineRoutes: PropTypes.array
  };

  componentWillMount() {
    this.props.actions.registerResizeHandler();
    this.props.actions.setRootRoute(
      this.props.rootRoute,
      this.props.preDefineRoutes
    );
    this.props.actions.setState({ history: this.props.history });
  }

  componentWillUnmount() {
    this.props.actions.unregisterResizeHandler();
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.rootRoute !== nextProps.rootRoute ||
      this.props.preDefineRoutes !== nextProps.preDefineRoutes
    ) {
      nextProps.actions.setRootRoute(
        nextProps.rootRoute,
        nextProps.preDefineRoutes
      );
    }
  }

  rendLoadingBar(pageLoadingInfo, muiTheme) {
    return pageLoadingInfo.loadFlag === true ? (
      <Progress
        strokeWidth={2}
        percent={pageLoadingInfo.progress}
        showInfo={false}
        style={{ position: "absolute", zIndex: 99, fontSize: 0 }}
      />
    ) : null;
  }

  render() {
    let {
      displayModeDict,
      match,
      routeComs,
      pageLoadingInfo,
      actions,
      muiTheme
    } = this.props;
    let displayMode = displayModeDict[match.path];
    switch (displayMode) {
      case NOMAL_PAGE:
        return (
          <div style={{ height: "100%" }}>
            {this.rendLoadingBar(pageLoadingInfo)}
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
                  <ArenaSwitch vReducerKey="routerSwitch">
                    {routeComs}
                  </ArenaSwitch>
                </Content>
              </Layout>
            </Layout>
          </div>
        );
      default:
        return (
          <div style={{ height: "100%" }}>
            {this.rendLoadingBar(pageLoadingInfo)}
            <Layout style={{ height: "100%", flexDirection: "row" }}>
              <Content
                style={{
                  margin: "24px 16px",
                  padding: "0.5rem",
                  background: "#fff",
                  minHeight: 280,
                  height: "100%"
                }}
              >
                <ArenaSwitch vReducerKey="routerSwitch">
                  {routerComs}
                </ArenaSwitch>
              </Content>
            </Layout>
          </div>
        );
    }
  }
}
