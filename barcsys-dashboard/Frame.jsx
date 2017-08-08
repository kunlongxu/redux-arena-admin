import React, { Component } from "react";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as frameActions from "./redux/frameActions";
// import Header from "./Header";
import { NOMAL_PAGE, FULLSCREEN, ONLY_HEADER } from "./displayModes";
import { Layout, Menu, Icon, Button } from 'antd';
const { Header, Sider, Content } = Layout;
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
  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  }
  componentWillMount() {
    // this.props.setRootRoute(this.props.rootRoute);
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
  jumpToPath(item, key, selectKey) {
    console.log(item, key, selectKey)
    this.props.history.push("/" + item.key)
  }
  render() {
    let {
      rootRoute,
      match,
      userInfo,
      muiTheme,
      pageLoading,
      displayMode,
      routerComs,
      children
    } = this.props;
    return <Layout style={{ height: "100%" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={this.state.collapsed}
      >
        <div className="logo" />
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onSelect={(item, key, selectKey) => this.jumpToPath(item, key, selectKey)}>
          <Menu.Item key="1">
            <Icon type="user" />
            <span>nav 1</span>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="video-camera" />
            <span>nav 2</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="upload" />
            <span>nav 3</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }}>
          <Icon
            className="trigger"
            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={this.toggle}
          />
        </Header>
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
          Contfdf33333df<Button type="primary">Primary</Button>
          <Button>Default</Button>
        </Content>

      </Layout>
    </Layout>

    // switch (displayMode) {
    //   case NOMAL_PAGE:
    //     return (
    //       <div>
    //         {pageLoading.loadFlag === true
    //           ? <LinearProgress
    //             color={muiTheme.palette.accent1Color}
    //             style={{ position: "fixed", zIndex: "1102" }}
    //             mode="determinate"
    //             value={pageLoading.progress}
    //           />
    //           : null}
    //         <Header />
    //           {routerComs}
    //       </div>
    //     );
    //   case ONLY_HEADER:
    //     return (
    //       <div>
    //         {pageLoading.loadFlag === true
    //           ? <LinearProgress
    //             color={muiTheme.palette.accent1Color}
    //             style={{ position: "fixed", zIndex: "1102" }}
    //             mode="determinate"
    //             value={pageLoading.progress}
    //           />
    //           : null}
    //         <Switch>
    //           {routerComs}
    //         </Switch>
    //       </div>
    //     );

    //   default:
    //     return (
    //       <div>
    //         {pageLoading.loadFlag === true
    //           ? <LinearProgress
    //             color={muiTheme.palette.accent1Color}
    //             style={{ position: "fixed", zIndex: "1102" }}
    //             mode="determinate"
    //             value={pageLoading.progress}
    //           />
    //           : null}
    //         <Switch>
    //           {routerComs}
    //         </Switch>
    //       </div>
    //     );
    // }
  }
}

function mapStateToProps(state) {
  console.log(state)
  return {
    history: state.arena.history,
    snackbar: state.frame.snackbar,
    match: state.frame.match,
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
