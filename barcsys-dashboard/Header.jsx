import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { enhenceAction } from "./commons/actions";
import { connect } from "react-redux";
import * as frameActions from "./redux/frameActions";
import Divider from "material-ui/Divider";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import LeftNav from "./LeftNav";
import muiThemeable from "material-ui/styles/muiThemeable";
import headerCss from "./css/header.css";

class Header extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() { }

  componentWillMount() { }

  componentWillUnmount() { }

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
      <div style={{ height: "4rem" }}>
        <AppBar
          title={breadcrumb.join("/")}
          titleStyle={{ cursor: "default", WebkitUserSelect: "none" }}
          style={headerStyle}
          iconElementLeft={
            <IconButton onClick={() => handleLeftNav()}>
              <NavigationMenu />
            </IconButton>
          }
          iconElementRight={
            <IconMenu
              iconButtonElement={
                <IconButton>
                  <MoreVertIcon />
                </IconButton>
              }
              targetOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "top" }}
            >
              <MenuItem
                style={{ cursor: "default", WebkitUserSelect: "none" }}
                primaryText={"Loading" && userInfo && userInfo.name}
              />
              <MenuItem
                style={{ cursor: "default", WebkitUserSelect: "none" }}
                onClick={logout}
                primaryText="登出"
              />
              <Divider />
              {themeType === "light"
                ? <MenuItem
                  style={{ cursor: "default", WebkitUserSelect: "none" }}
                  onClick={() => setTheme("dark")}
                  primaryText="切换dark主题"
                />
                : <MenuItem
                  style={{ cursor: "default", WebkitUserSelect: "none" }}
                  onClick={() => setTheme("light")}
                  primaryText="切换light主题"
                />}
              <MenuItem
                style={{ cursor: "default", WebkitUserSelect: "none" }}
                onClick={() => jumpTo("/")}
                primaryText="返回首页"
              />
            </IconMenu>
          }
        >

          <LeftNav />
        </AppBar>
      </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(
  muiThemeable()(Header)
);
