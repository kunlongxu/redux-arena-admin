import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { enhenceAction } from "./commons/actions";
import { connect } from "react-redux";
import * as frameActions from "./redux/frameActions";
// import MenusList from "./MenusList";
import { app } from "appconfig/settings";
import { Layout, Menu, Icon, Spin } from "antd";
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
    const headBackgroundUrl = require("./images/sinapaylogo.png");
    return (
      <Sider
        style={{ background: "#fff" }}
        width="224"
        trigger={null}
        collapsible
        collapsedWidth={0}
        collapsed={!leftNavOpenFlag}
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
          <img src={headBackgroundUrl} alt="" height="100%" />
        </div>
        {isLoadingMenu
          ? <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(0,0,0,0.05)",
                height: "calc(100vh - 4rem)"
              }}
            >
              <Spin tip="Loading" />
            </div>
          : <Menu
              mode="inline"
              defaultSelectedKeys={["1"]}
              onSelect={(item, key, selectKey) =>
                this.jumpToPath(item, key, selectKey)}
            >
              {menusData.childRoutes.map(menu =>
                <Menu.Item key={menusData.path + "/" + menu.path}>
                  <Icon type="user" />
                  <span>
                    {menu.name}
                  </span>
                </Menu.Item>
              )}
              <Menu.Item key={"arena/pagea"}>
                <Icon type="user" />
                <span>pageA</span>
              </Menu.Item>
              <Menu.Item key={"arena/pageb"}>
                <Icon type="user" />
                <span>pageB</span>
              </Menu.Item>
            </Menu>}
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
