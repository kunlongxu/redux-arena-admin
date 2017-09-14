import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import {
  Step,
  Stepper,
  StepButton,
  StepLabel,
} from 'material-ui/Stepper';
import Dialog from 'material-ui/Dialog';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actions from './redux/actions'
import RuleMetaStep from './RuleMetaStep'
import RuleInfoStep from './RuleInfoStep'
import AlertMetaInfoStep from './AlertMetaInfoStep'
import AlertNotifyStep from './AlertNotifyStep'

class RulePanel extends Component {

  switchStep(stepIndex) {
    let {dispatchRuleData, delRuleDataItem, addRuleDataItem} = this.props;
    switch (stepIndex) {
      case 0:
        return <RuleMetaStep />
      case 1:
        return <RuleInfoStep />
      case 2:
        return <AlertMetaInfoStep />
      case 3:
        return <AlertNotifyStep />
    }
  }

  render() {
    let {editFlag, hideRulePanel, lastStep, nextStep,
      savePanel, setStep, updatePanel,
      stepIndex, rulePanelOpenFlag} = this.props;
    const actions = [
      <FlatButton
        label="取消"
        style={{ marginRight: '12px' }}
        onClick={() => hideRulePanel()}
        />,
      <FlatButton
        label="上一步"
        style={{ marginRight: '12px' }}
        disabled={stepIndex === 0}
        onClick={lastStep}
        />,
      stepIndex === 3 ?
        (
          editFlag === true ? <FlatButton
            label="更新"
            primary={true}
            style={{ marginRight: '12px' }}
            onClick={updatePanel}
            /> :
            <FlatButton
              label="保存"
              primary={true}
              style={{ marginRight: '12px' }}
              onClick={savePanel}
              />
        ) :
        <FlatButton
          label="下一步"
          style={{ marginRight: '12px' }}
          onClick={nextStep}
          />
    ];
    return <Dialog title={editFlag === true ? '修改规则' : '创建规则'} actions={actions}
      modal={true} open={rulePanelOpenFlag} autoScrollBodyContent={true}>
      <div style={{ width: '100%', margin: 'auto' }}>
        <Stepper linear={!editFlag} activeStep={stepIndex}>
          <Step>
            <StepButton onClick={() => setStep(0)}>
              规则信息
            </StepButton>
          </Step>
          <Step>
            <StepButton onClick={() => setStep(1)}>
              触发规则
            </StepButton>
          </Step>
          <Step>
            <StepButton onClick={() => setStep(2)}>发送通知条件</StepButton>
          </Step>
          <Step>
            <StepButton onClick={() => setStep(3)}>通知联系人</StepButton>
          </Step>
        </Stepper>
      </div>
      {
        this.switchStep(stepIndex)
      }
    </Dialog>
  }
}

function mapStateToProps(state) {
  return {
    rulePanelOpenFlag: state.page.rulePanelOpenFlag,
    editFlag: state.page.editFlag,
    stepIndex: state.page.stepIndex
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(RulePanel)