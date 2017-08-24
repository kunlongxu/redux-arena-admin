import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { enhenceAction } from "./commons/actions";
import { connect } from "react-redux";
import * as frameActions from "./redux/frameActions";
// import MenusList from "./MenusList";
import { app } from "appconfig/settings";
import { Layout, Menu, Icon } from "antd";
const { Sider } = Layout;

const LogoIcon = props =>
  <SvgIcon {...props}>
    <path d="M 50 0 L 100 14 L 92 80 Z" fill="rgba(139, 195, 74, 0.5)" />
    <path d="M 92 80 L 50 0 L 50 100 Z" fill="rgba(139, 195, 74, 0.8)" />
    <path d="M 8 80 L 50 0 L 50 100 Z" fill="#f3f3f3" />
    <path d="M 50 0 L 8 80 L 0 14 Z" fill="rgba(220, 220, 220, 0.6)" />
  </SvgIcon>;

class LeftNav extends Component {
  constructor(props) {
    super(props);
  }
  jumpToPath(item, key, selectKey) {
    console.log(item.key);
    this.props.history.push("/" + item.key);
  }
  render() {
    let {
      leftNavOpenFlag,
      handleNavDialog,
      frameSize,
      rootRoute,
      match,
      jumpTo,
      menusData,
      setUserInfo,
      isLoadingMenu,
      setBreadcrumb,
      handleLeftNav
    } = this.props;
    return (
      <Sider
        style={{ background: "#fff" }}
        trigger={null}
        collapsible
        collapsedWidth={0}
        collapsed={leftNavOpenFlag}
      >
        <div
          style={{
            height: "64px",
            background: "#404040",
            color: "#fff",
            fontSize: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          新浪大数据
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          onSelect={(item, key, selectKey) =>
            this.jumpToPath(item, key, selectKey)}
        >
          <Menu.Item key="arena/app">
            <Icon type="user" />
            <span>nav 1</span>
          </Menu.Item>
          <Menu.Item key="arena/pagea">
            <Icon type="video-camera" />
            <span>nav 2</span>
          </Menu.Item>
          <Menu.Item key="3">
            <Icon type="upload" />
            <span>nav 3</span>
          </Menu.Item>
        </Menu>
      </Sider>
    );
  }
}

function mapStateToProps(state) {
  return {
    leftNavOpenFlag: state.frame.leftNavOpenFlag,
    history: state.frame.history,
    match: state.frame.match,
    frameSize: state.frame.frameSize,
    menusData: state.frame.menusData,
    isLoadingMenu: state.frame.isLoadingMenu,
    rootRoute: state.frame.rootRoute
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction(frameActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftNav);
