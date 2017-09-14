import React, { Component } from 'react';
import TextField from 'material-ui/TextField';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { bindRedux, templateShouldUpdate } from 'barcsys-dashboard/commons/formFunc'
import { toTimeStr } from './functions'
import muiThemeable from 'material-ui/styles/muiThemeable';
import immutablediff from 'immutablediff'
import * as actions from './redux/actions'

class RulePanel extends Component {
  constructor(props) {
    super(props);
    this.textnames = []
  }

  shouldComponentUpdate(nextProps, nextState) {
    let diffData = immutablediff(this.props.alertData, nextProps.alertData);
    let flag = templateShouldUpdate(diffData, this.textnames, (item) => {
      return item.indexOf('/timeSpan') === 0
    });
    return flag
  }

  rendTemplate() {
    let {handleAddForm, addService, muiTheme,
      alertData, updateServiceDom,
      setalertData, editFlag, addFormOpenFlag} = this.props;
    let { primary1Color }= muiTheme.palette;
    return <div>
      <span style={{ fontSize: '12px' }}>触发机制</span>
        <div style={{ display: 'flex', alignItems: 'baseline' }}>
          <TextField style={{ width: '4rem' }}
            name="*timeSpan@TextField" hintText="触发周期" fullWidth={true} />
          <span style={{ fontSize: '16px' }}
            name="triggerCondition">分钟内触发</span>
          <TextField style={{ width: '4rem' }} name="*maxSize@TextField" hintText="次数阈值" />
          <span style={{ fontSize: '16px' }}
            name="triggerCondition">次</span>
        </div>
    </div>
  }

  render() {
    let {dispatchAlertData, alertData} = this.props;
    let {product, textNames } = bindRedux(this.rendTemplate(), dispatchAlertData, alertData);
    this.textnames = textNames;
    return product
  }
}

function mapStateToProps(state) {
  return {
    alertData: state.page.alertData,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(muiThemeable()(RulePanel))