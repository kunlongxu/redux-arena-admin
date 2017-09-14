import React, { Component } from "react";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import SvgIcon from "material-ui/SvgIcon";
import MenuList from "../MenuList";
import muiThemeable from "material-ui/styles/muiThemeable";
import { app } from "arena-building-appconfig/settings";
import Logo from "arena-building-appconfig/Logo";

const LogoIcon = props => (
  <SvgIcon {...props}>
    <path d="M 50 0 L 100 14 L 92 80 Z" fill="rgba(139, 195, 74, 0.5)" />
    <path d="M 92 80 L 50 0 L 50 100 Z" fill="rgba(139, 195, 74, 0.8)" />
    <path d="M 8 80 L 50 0 L 50 100 Z" fill="#f3f3f3" />
    <path d="M 50 0 L 8 80 L 0 14 Z" fill="rgba(220, 220, 220, 0.6)" />
  </SvgIcon>
);

class LeftNav extends Component {
  rendAppBar(closeDrawer) {
    return (
      <AppBar
        onClick={closeDrawer}
        style={{ cursor: "pointer" }}
        title="基础设施门户"
        titleStyle={{ WebkitUserSelect: "none" }}
        iconElementLeft={
          <IconButton>
            <LogoIcon viewBox="0 0 100 100" />
          </IconButton>
        }
      />
    );
  }

  rendNavHeader(muiTheme) {
    const headBackgroundUrl = require("../../images/card-head-background.png");
    return (
      <div
        style={{
          backgroundImage: `url("${headBackgroundUrl}")`,
          flexDirection: "column",
          backgroundColor: muiTheme.leftNavHeadBGColor,
          backgroundSize: "cover",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          width: "16rem",
          boxSizing: "border-box"
        }}
      >
        <Logo style={{ width: "4rem", height: "4rem" }} />
        <h3
          style={{
            margin: "1rem 0rem 0rem 0rem",
            fontWeight: "400",
            fontFamily: "Microsoft Yahei"
          }}
        >
          {app.appName}
        </h3>
      </div>
    );
  }

  closeDrawer = () => {
    this.props.frameActions.handleLeftNav(false);
  };

  render() {
    let { isLeftNavOpen, isLeftNavDocked, actions, muiTheme } = this.props;
    return (
      <Drawer
        containerStyle={{ overflowX: "hidden" }}
        open={isLeftNavOpen}
        docked={isLeftNavDocked}
        onRequestChange={this.closeDrawer}
      >
        {this.rendAppBar(this.closeDrawer)}
        {this.rendNavHeader(muiTheme)}
        <MenuList />
      </Drawer>
    );
  }
}

export default muiThemeable()(LeftNav);
