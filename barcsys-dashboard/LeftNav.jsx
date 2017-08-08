import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { enhenceAction } from "./commons/actions";
import { connect } from "react-redux";
import * as frameActions from "./redux/frameActions";
import Drawer from "material-ui/Drawer";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import SvgIcon from "material-ui/SvgIcon";
import MenusList from "./MenusList";
import muiThemeable from "material-ui/styles/muiThemeable";
import { app } from "appconfig/settings";

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

  rendAppBar(handleNavDialog) {
    return (
      <AppBar
        onClick={() => handleNavDialog(true)}
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

  rendNavHeader() {
    const headBackgroundUrl = require("./images/card-head-background.png");
    return (
      <div
        style={{
          backgroundImage: `url("${headBackgroundUrl}")`,
          flexDirection: "column",
          backgroundColor: this.props.muiTheme.leftNavHeadBGColor,
          backgroundSize: "cover",
          padding: "1rem",
          display: "flex",
          alignItems: "center",
          width: "16rem",
          boxSizing: "border-box"
        }}
      >
        {switchLogo(app.logo, { width: "4rem", height: "4rem" })}
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
      <Drawer
        containerStyle={{ overflowX: "hidden" }}
        open={leftNavOpenFlag}
        docked={frameSize === "largeL" ? true : false}
        onRequestChange={() => handleLeftNav(false)}
      >
        {this.rendAppBar(handleNavDialog)}
        {this.rendNavHeader()}
        <MenusList
          match={match}
          jumpTo={jumpTo}
          menusData={menusData}
          rootRoute={rootRoute}
          setUserInfo={setUserInfo}
          isLoadingMenu={isLoadingMenu}
          setBreadcrumb={setBreadcrumb}
        />
      </Drawer>
    );
  }
}

function mapStateToProps(state) {
  return {
    leftNavOpenFlag: state.frame.leftNavOpenFlag,
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

export default connect(mapStateToProps, mapDispatchToProps)(
  muiThemeable()(LeftNav)
);
