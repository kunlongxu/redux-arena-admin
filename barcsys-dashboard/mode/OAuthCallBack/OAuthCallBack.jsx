import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "./redux/actions";
import backgroundPic from "barcsys-dashboard/images/card-head-background.png";
import { auth } from "appconfig/settings";
import { guardianUrl, contextRoot } from "appconfig/apiUrl";
import { enhenceAction } from "barcsys-dashboard/commons/actions";
import { parse as queryStringParse } from "query-string";
import { withRouter } from "react-router-dom";

class OAuthCallBack extends Component {
  componentWillMount() {
    let { location } = this.props;
    console.log(location, "---------------------");
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
      window.parent.initUserAndJump(token2 || token1);
      return;
    }
  }

  render() {
    return (
      <div style={{ width: "100%", height: "100%" }}>
        <div
          style={{
            width: "100%",
            height: "30%",
            backgroundImage: `url("${backgroundPic}")`
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
      </div>
    );
  }
}
export default OAuthCallBack;
