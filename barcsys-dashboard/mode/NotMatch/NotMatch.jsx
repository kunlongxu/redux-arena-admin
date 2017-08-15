import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { enhenceAction } from 'barcsys-dashboard/commons/actions'
import s from './css/notfound.css';

class NotFound extends Component {
  render() {
    let {muiTheme, jumpTo} = this.props;
    return <div className={s.container} style={{ backgroundColor: muiTheme.notFoundBGColor }}><div>
      <div className={s.cloud + ' ' + s.x1}></div>
      <div className={s.cloud + ' ' + s.x1_5}></div>
      <div className={s.cloud + ' ' + s.x2}></div>
      <div className={s.cloud + ' ' + s.x3}></div>
      <div className={s.cloud + ' ' + s.x4}></div>
      <div className={s.cloud + ' ' + s.x5}></div>
    </div>
      <div className={s.c}>
        <div className={s._404}>404</div>
        <hr className={s.hr} style={{ backgroundColor: muiTheme.notFoundBGColor }} />
        <div className={s._1}>THE PAGE</div>
        <div className={s._2}>WAS NOT FOUND</div>
        <a className={s.btn} style={{ cursor: 'pointer', color: muiTheme.palette.accent1Color }}
          onClick={() => jumpTo('/')}>YOUR WARM HOME</a>
      </div>
    </div>
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction({}), dispatch)
}

export default connect(null, mapDispatchToProps)(muiThemeable()(NotFound))