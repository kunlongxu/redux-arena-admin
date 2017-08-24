import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { enhenceAction } from "barcsys-dashboard/commons/actions";
import s from "./css/notfound.css";

class NotFound extends Component {
  render() {
    let { jumpTo } = this.props;
    return (
      <div className={s.container}>
        <div>
          <div className={s.cloud + " " + s.x1} />
          <div className={s.cloud + " " + s.x1_5} />
          <div className={s.cloud + " " + s.x2} />
          <div className={s.cloud + " " + s.x3} />
          <div className={s.cloud + " " + s.x4} />
          <div className={s.cloud + " " + s.x5} />
        </div>
        <div className={s.c}>
          <div className={s._404}>404</div>
          <hr className={s.hr} />
          <div className={s._1}>THE PAGE</div>
          <div className={s._2}>WAS NOT FOUND</div>
          <a
            className={s.btn}
            style={{ cursor: "pointer" }}
            onClick={() => jumpTo("/")}
          >
            YOUR WARM HOME
          </a>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction({}), dispatch);
}

export default connect(null, mapDispatchToProps)(NotFound);
