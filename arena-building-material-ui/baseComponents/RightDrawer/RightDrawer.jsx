import React, { Component } from "react";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import NavigationArrowForward from "material-ui/svg-icons/navigation/arrow-forward";
import IconButton from "material-ui/IconButton";
import Paper from "material-ui/Paper";

class RightDrawer extends Component {
  componentWillMount() {
    this.closeRightDrawer = () =>
      this.props.pcActions.setState({ isRightDrawerOpen: false });
    this.openRightDrawer = () =>
      this.props.pcActions.setState({ isRightDrawerOpen: true });
  }

  componentWillMount() {
    this.props.pcActions.registerRightDrawer(null);
    this.props.pcActions.setState({ isRightDrawerOpen: false });
  }

  render() {
    let { isRightDrawerOpen, children, pageHeight, pcActions } = this.props;
    let rdRight = "0";
    if (!isRightDrawerOpen) {
      rdRight = "calc(1rem - 16rem)";
    }
    pcActions.registerRightDrawer(
      <Paper
        style={{
          top: "4rem",
          position: "fixed",
          height: pageHeight + "px",
          right: rdRight,
          width: "16rem",
          cursor: isRightDrawerOpen ? null : "pointer",
          paddingTop: "48px"
        }}
        zDepth={2}
        onClick={isRightDrawerOpen ? null : this.openRightDrawer}
      >
        <div
          style={{
            position: "absolute",
            top: isRightDrawerOpen ? "0" : "calc(50% - 20px)",
            transition: "all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
          }}
        >
          {isRightDrawerOpen ? (
            <IconButton onClick={this.closeRightDrawer}>
              <NavigationArrowForward />
            </IconButton>
          ) : (
            <NavigationArrowBack />
          )}
        </div>
        {children}
      </Paper>
    );
    return <div />;
  }
}

export default RightDrawer;
