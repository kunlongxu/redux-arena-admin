import React, { Component } from "react";
import muiThemeable from "material-ui/styles/muiThemeable";
import styles from "./notFoundStyles.js";
import injectSheet from "react-jss";
import { app } from "arena-building-appconfig/settings";

class NotFound extends Component {
  
  goHome = () => {
    this.props.frameActions.goToUrl("/" + app.contextRoot);
  };

  render() {
    let { muiTheme, classes } = this.props;
    return (
      <div
        className={classes.container}
        style={{ backgroundColor: muiTheme.notFoundBGColor }}
      >
        <div>
          <div className={classes.cloud + " " + classes.x1} />
          <div className={classes.cloud + " " + classes.x1_5} />
          <div className={classes.cloud + " " + classes.x2} />
          <div className={classes.cloud + " " + classes.x3} />
          <div className={classes.cloud + " " + classes.x4} />
          <div className={classes.cloud + " " + classes.x5} />
        </div>
        <div className={classes.c}>
          <div className={classes._404}>404</div>
          <hr
            className={classes.hr}
            style={{ backgroundColor: muiTheme.notFoundBGColor }}
          />
          <div className={classes._1}>THE PAGE</div>
          <div className={classes._2}>WAS NOT FOUND</div>
          <a
            className={classes.btn}
            style={{ cursor: "pointer", color: muiTheme.palette.accent1Color }}
            onClick={this.goHome}
          >
            YOUR WARM HOME
          </a>
        </div>
      </div>
    );
  }
}

export default muiThemeable()(injectSheet(styles)(NotFound));
