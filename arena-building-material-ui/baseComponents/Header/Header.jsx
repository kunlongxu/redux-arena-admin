import React, { Component } from "react";
import LeftNav from "../LeftNav";
import { DARK_THEME, LIGHT_THEME } from "../../constValues/theme";
import { Layout, Menu, Icon } from "antd";
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const { Header } = Layout;

export default class Header extends Component {
  calcStyle(isDocked, isLeftNavOpen) {
    if (isDocked && isLeftNavOpen) {
      return {
        position: "fixed",
        width: "calc(100% - 16rem)",
        marginLeft: "16rem"
      };
    } else {
      return {
        position: "fixed",
        width: "100%"
      };
    }
  }

  closeDrawer = () => {
    this.props.frameActions.handleLeftNav(false);
  };

  openDrawer = () => {
    this.props.frameActions.handleLeftNav(true);
  };

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
    let headerStyle = this.calcStyle(isLeftNavDocked, isLeftNavOpen);
    let breadcrumb,
      breadcrumbArray = breadcrumbDict[match.path];
    if (breadcrumbArray != null) {
      breadcrumb = breadcrumbArray.slice(1).join("/");
    }
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
          onClick={leftNavOpenFlag ? this.closeDrawer : this.openDrawer}
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
        <Menu
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
            item.key == "logout" && frameActions.logout();
            item.key == "darkTheme" && themeActions.applyDarkTheme();
            item.key == "lightTheme" && frameActions.applyLightTheme();
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
            {themeType === LIGHT_THEME ? (
              <Menu.Item key="darkTheme">切换dark主题</Menu.Item>
            ) : (
              <Menu.Item key="lightTheme">切换light主题</Menu.Item>
            )}
          </SubMenu>
        </Menu>
      </Header>
    );
  }
}
