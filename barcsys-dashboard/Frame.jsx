import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as frameActions from "./redux/frameActions";
import Header from "./Header";
import { NOMAL_PAGE, FULLSCREEN, ONLY_HEADER } from "./displayModes";
import { Layout, Menu, Icon, Button, Progress } from 'antd';
import LeftNav from "./LeftNav"
import ReduxArena from "../arena/ReduxArena";
const { Sider, Content } = Layout;
class Frame extends Component {
  // static propTypes = {
  //   history: PropTypes.object.isRequired
  // };

  constructor(props) {
    super(props);
  }
  state = {
    collapsed: false,
  };
  componentWillMount() {
    this.props.setRootRoute(this.props.rootRoute);
    // this.props.registerHistory(this.props.history);
    // this.props.registerResizeHandler();
  }

  componentWillUnmount() {
    // this.props.unregisterResizeHandler();
  }

  componentWillReceiveProps(nextProps) {
    // if (this.props.rootRoute !== nextProps.rootRoute) {
    //   nextProps.setRootRoute(this.props.rootRoute);
    // }
  }

  render() {
    let {
      rootRoute,
      userInfo,
      muiTheme,
      pageLoading,
      displayMode,
      routerComs
    } = this.props;
    switch (displayMode) {
      case NOMAL_PAGE:
        return <div style={{ height: "100%" }}>
          <Progress
            strokeWidth={2}
            percent={40}
            showInfo={false}
            style={{ position: "absolute", zIndex: 99, fontSize: 0 }} />
          <Layout style={{ height: "100%", flexDirection: "row" }}>
            <LeftNav />
            <Layout>
              <Header />
              <Content style={{ margin: '24px 16px', padding: "0.5rem", background: '#fff', minHeight: 280 }}>
                <ReduxArena>
                  {routerComs}
                </ReduxArena>
              </Content>
            </Layout>
          </Layout>
        </div>
      case FULLSCREEN:
        return <div style={{ height: "100%" }}>
          <Layout style={{ height: "100%", flexDirection: "row" }}>
            <ReduxArena>
              {routerComs}
            </ReduxArena>
          </Layout>
        </div>
      default:
        return <div style={{ height: "100%" }}>
          <Progress
            strokeWidth={2}
            percent={40}
            showInfo={false}
            style={{ position: "absolute", zIndex: 99, fontSize: 0 }} />
          <Layout style={{ height: "100%", flexDirection: "row" }}>
            <LeftNav />
            <Layout>
              <Header />
              <Content style={{ margin: '24px 16px', padding: "0.5rem", background: '#fff', minHeight: 280 }}>
                <ReduxArena>
                  {routerComs}
                </ReduxArena>
              </Content>
            </Layout>
          </Layout>
        </div>
    }
  }
}

function mapStateToProps(state) {
  return {
    history: state.arena.history,
    snackbar: state.frame.snackbar,
    // match: state.frame.match,
    userInfo: state.frame.userInfo,
    pageLoading: state.frame.pageLoading,
    displayMode: state.frame.displayMode,
    routerComs: state.frame.routerComs
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(frameActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Frame);
