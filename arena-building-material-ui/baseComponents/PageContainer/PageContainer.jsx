import React, { Component } from "react";
import ReactDOM from "react-dom";
import Snackbar from "material-ui/Snackbar";
import { Scrollbars } from "react-custom-scrollbars";
import ReactResizeDetector from "react-resize-detector";
import RightDrawer from "../RightDrawer";
import { NOMAL_PAGE, FULLSCREEN } from "../../constValues/displayMode";

export default class PageContainer extends Component {
  closeSnackbar = () => this.props.actions.handleSnackbar(false);

  registerPageContainer = pageContainer => {
    this.props.actions.registerPageContainer(pageContainer);
  };

  componentWillUnmount() {
    this.registerPageContainer(null);
  }

  render() {
    let {
      actions,
      children,
      isLeftNavOpen,
      isLeftNavDocked,
      snackbarInfo,
      isRightDrawerExist,
      isRightDrawerOpen,
      displayMode,
      rightDrawer
    } = this.props;
    let height = "calc(100vh - 4rem)";
    let pcWidth = "100% ";
    let pcMarginLeft = "0";
    if (
      isLeftNavOpen === true &&
      isLeftNavDocked === true &&
      displayMode === NOMAL_PAGE
    ) {
      pcWidth += " - 16rem";
      pcMarginLeft = "16rem";
    }
    if (rightDrawer && isRightDrawerExist) {
      if (isRightDrawerOpen) {
        pcWidth += " - 16rem";
      } else {
        pcWidth += " - 1rem";
      }
    }
    if (displayMode === FULLSCREEN || displayMode == null) {
      height = "100vh";
    }
    pcWidth = `calc(${pcWidth})`;
    let style = {
      width: pcWidth,
      overflow: "hidden",
      transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
      marginLeft: pcMarginLeft,
      height
    };
    return (
      <Scrollbars style={style} ref={actions.pageContainerResize}>
        {children}
        <Snackbar
          open={snackbarInfo.showFlag}
          autoHideDuration={4000}
          onRequestClose={this.closeSnackbar}
          message={snackbarInfo.message}
          action={snackbarInfo.actionText}
          onActionTouchTap={actions.cancelSnackbarAction}
        />
        {rightDrawer}
        <ReactResizeDetector
          handleWidth
          handleHeight
          onResize={actions.pageContainerResize}
        />
      </Scrollbars>
    );
  }
}
