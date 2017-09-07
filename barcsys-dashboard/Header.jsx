import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { enhenceAction } from "./commons/actions";
import { connect } from "react-redux";
import * as frameActions from "./redux/frameActions";
import headerCss from "./css/header.css";
import { Layout, Menu, Icon } from "antd";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Header } = Layout;
class HeaderComponent extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  componentWillMount() {}

  componentWillUnmount() {}

  componentWillReceiveProps(nextProps) {
    let { frameSize, handleLeftNav } = nextProps;
    let oldFrameSize = this.props.frameSize;
    if (oldFrameSize !== frameSize) {
      if (frameSize === "largeL") handleLeftNav(true);
      else handleLeftNav(false);
    }
  }

  calcStyle(frameSize, leftNavOpenFlag) {
    let headerStyle = { width: "100%", position: "fixed", top: 0 };
    if (frameSize === "largeL" && leftNavOpenFlag) {
      headerStyle = {
        width: "calc(100% - 16rem)",
        marginLeft: "16rem",
        position: "fixed",
        top: 0
      };
    }
    return headerStyle;
  }

  render() {
    let {
      navDialogOpenFlag,
      leftNavOpenFlag,
      handleNavDialog,
      handleLeftNav,
      breadcrumb,
      rootRoute,
      themeType,
      setTheme,
      frameSize,
      match,
      jumpTo,
      menusData,
      setUserInfo,
      userInfo,
      logout
    } = this.props;
    let headerStyle = this.calcStyle(frameSize, leftNavOpenFlag);
    return (
      <Header style={{ padding: 0, display: "flex", zIndex: 100 }}>
        <Icon
          style={{
            alignSelf: "center",
            fontSize: "18px",
            color: "#fff",
            padding: "0 20px",
            cursor: "pointer"
          }}
          type={leftNavOpenFlag ? "menu-fold" : "menu-unfold"}
          onClick={() => handleLeftNav()}
        />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          style={{ lineHeight: "64px", marginLeft: "3rem" }}
        >
          <Menu.Item key="1">黑名单监控</Menu.Item>
          <Menu.Item key="2">反洗钱</Menu.Item>
          <Menu.Item key="3">微财富</Menu.Item>
        </Menu>
        {userInfo
          ? <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              style={{
                lineHeight: "64px",
                marginLeft: "3rem",
                flex: "1 1 auto",
                display: "flex",
                justifyContent: "flex-end",
                paddingRight: "1rem"
              }}
              onSelect={(item, key, selectKey) => {
                item.key == "logout" && logout();
              }}
            >
              <SubMenu
                title={
                  <span>
                    <Icon type="user" />
                    {userInfo && userInfo.name}
                  </span>
                }
              >
                <Menu.Item key="logout">退出</Menu.Item>
                <Menu.Item key="setting:2">切换主题</Menu.Item>
                <Menu.Item key="setting:3">返回首页</Menu.Item>
              </SubMenu>
            </Menu>
          : null}
      </Header>
    );
  }
}

function mapStateToProps(state) {
  return {
    leftNavOpenFlag: state.frame.leftNavOpenFlag,
    navDialogOpenFlag: state.frame.navDialogOpenFlag,
    match: state.frame.match,
    frameSize: state.frame.frameSize,
    themeType: state.frame.themeType,
    menusData: state.frame.menusData,
    userInfo: state.frame.userInfo,
    breadcrumb: state.frame.breadcrumb,
    rootRoute: state.frame.rootRoute
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction(frameActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderComponent);
