import React, { Component } from "react";
import Paper from "material-ui/Paper";
import muiThemeable from "material-ui/styles/muiThemeable";
import backgroundPic from "../../images/card-head-background.png";
import { auth } from "arena-building-appconfig/settings";
import { guardianUrl, contextRoot } from "arena-building-appconfig/apiUrl";
import { parse as queryStringParse } from "query-string";

class OAuthCallBack extends Component {
  componentWillMount() {
    let { location } = this.props;
    this.checkTokenAndInitUser(location);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location !== nextProps.location) {
      this.checkTokenAndInitUser(location);
    }
  }

  checkTokenAndInitUser(location) {
    let { _WEIHUIGUARDIAN_ } = queryStringParse(location.search);
    let [token1, token2] = [
      sessionStorage.getItem("X-Session-Token"),
      _WEIHUIGUARDIAN_
    ];
    if (auth.type === "guardian") {
      window.parent.initUserAndBack(token2 || token1);
      return;
    }
  }

  render() {
    let { muiTheme } = this.props;
    return (
      <Paper style={{ width: "100%", height: "100%" }}>
        <div
          style={{
            width: "100%",
            height: "30%",
            backgroundImage: `url("${backgroundPic}")`,
            backgroundColor: muiTheme.palette.primary1Color
          }}
        >
          <div
            style={{
              padding: "5rem 0rem 2rem 0rem",
              fontSize: "6rem",
              color: "white",
              marginLeft: "2rem",
              textAlign: "left",
              fontWeight: "300"
            }}
          >
            Welcom Back
          </div>
        </div>
        <div
          style={{
            height: "70%",
            fontSize: "3rem",
            color: "gray",
            padding: "2rem"
          }}
        >
          <span style={{ fontSize: "2rem", color: "orange" }}>获取用户信息...</span>
        </div>
      </Paper>
    );
  }
}

export default muiThemeable()(OAuthCallBack);
