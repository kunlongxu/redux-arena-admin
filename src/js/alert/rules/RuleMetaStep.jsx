import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { bindRedux, templateShouldUpdate } from 'barcsys-dashboard/commons/formFunc'
import muiThemeable from 'material-ui/styles/muiThemeable';
import immutablediff from 'immutablediff'
import * as actions from './redux/actions'

class RuleMetaStep extends Component {
  constructor(props) {
    super(props);
    this.textnames = []
  }

  shouldComponentUpdate(nextProps, nextState) {
    let diffData = immutablediff(this.props.ruleData, nextProps.ruleData);
    let flag = templateShouldUpdate(diffData, this.textnames);
    return flag
  }

  rendTemplate() {
    let primary1Color = this.props.muiTheme.palette;
    let {alertData, dispatchAlertData} = this.props;
    return <div>
      <TextField name="*title@TextField" floatingLabelText="Stream名" fullWidth={true} />
      <TextField name="*description@TextField" floatingLabelText="描述" fullWidth={true} />
      <span style={{ color: primary1Color, fontSize: '12px' }}>状态</span>
      <RadioButtonGroup name="*isDisabled@RadioButtonGroup"
        style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem' }}>
        <RadioButton style={{ width: "7rem" }}
          value={String(false)}
          label="开启"
          />
        <RadioButton style={{ width: "7rem" }}
          value={String(true)}
          label="关闭"
          />
      </RadioButtonGroup>
      <br />
      <span style={{ color: primary1Color, fontSize: '12px' }}>紧急程度</span>
      <RadioButtonGroup name="emergency"
        style={{ display: 'flex', flexWrap: 'wrap', marginTop: '1rem' }}
        onChange={(e, value) => { dispatchAlertData(['emergency'], value) } }
        valueSelected={alertData.get('emergency')}>
        <RadioButton style={{ width: "7rem" }}
          value="low"
          label="低"
          />
        <RadioButton style={{ width: "7rem" }}
          value="medium"
          label="中"
          />
        <RadioButton style={{ width: "7rem" }}
          value="high"
          label="高"
          />
      </RadioButtonGroup>
    </div>
  }

  render() {
    let {dispatchRuleData, ruleData} = this.props;
    let {product, textNames } = bindRedux(this.rendTemplate(), dispatchRuleData, ruleData);
    this.textnames = textNames;
    return product
  }
}

function mapStateToProps(state) {
  return {
    ruleData: state.page.ruleData,
    alertData: state.page.alertData
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(muiThemeable()(RuleMetaStep));