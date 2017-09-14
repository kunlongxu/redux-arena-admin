import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import ActionSpellcheck from 'material-ui/svg-icons/action/spellcheck';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import muiThemeable from 'material-ui/styles/muiThemeable';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { bindRedux, templateShouldUpdate } from 'barcsys-dashboard/commons/formFunc'
import immutablediff from 'immutablediff'
import * as actions from './redux/actions'

class DataPumpPanel extends Component {
  constructor(props) {
    super(props);
    this.textnames = []
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.addFormOpenFlag !== this.props.addFormOpenFlag) return true;
    let diffData = immutablediff(this.props.formData, nextProps.formData);
    let flag = templateShouldUpdate(diffData, this.textnames, (item) => {
      return item.indexOf('/timeSpan') === 0
    });
    return flag
  }

  rendTemplate() {
    let {formData, updateRule, muiTheme,
      addRule, addFormOpenFlag,
      editFlag, testSingleRule, handleAddForm} = this.props;
    let { primary1Color }= muiTheme.palette;
    const actions = [
      <FlatButton
        label="取消"
        style={{ marginRight: '12px' }}
        onClick={() => handleAddForm(false)}
        />,
      (editFlag ? <FlatButton
        label="更新"
        primary={true}
        style={{ marginRight: '12px' }}
        onClick={() => { updateRule(); handleAddForm(false) } }
        /> :
        <FlatButton
          label="保存"
          primary={true}
          style={{ marginRight: '12px' }}
          onClick={() => { addRule(); handleAddForm(false) } }
          />
      ),
    ];

    return <Dialog title={editFlag ? "修改规则" : "添加规则"} actions={actions}
      modal={true} open={addFormOpenFlag} autoScrollBodyContent={true}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TextField name="*title@TextField" style={{ marginRight: '1rem', width: '10rem' }}
          floatingLabelText="规则名" />
        <div style={{ paddingTop: '1rem' }}>
          <span style={{ color: primary1Color, fontSize: '12px' }}>操作符：</span>
          <RadioButtonGroup name="*operator@RadioButtonGroup"
            style={{ display: 'flex', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <RadioButton style={{ width: "10rem" }}
              value="0"
              label="正则表达式"
              />
          </RadioButtonGroup>
        </div>
        <TextField name="*target@TextField" style={{ marginRight: '1rem', width: '10rem' }}
          floatingLabelText="目标字段名" /></div>
      <div style={{ paddingTop: '1rem' }}>
        <span style={{ color: primary1Color, fontSize: '12px' }}>转换类型：</span>
        <RadioButtonGroup name="*converter.fieldType@RadioButtonGroup"
          style={{ display: 'flex', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <RadioButton style={{ width: "6rem" }}
            value="2"
            label="字符"
            />
          <RadioButton style={{ width: "6rem" }}
            value="0"
            label="数字"
            />
          <RadioButton style={{ width: "6rem" }}
            value="1"
            label="日期"
            />
        </RadioButtonGroup>
      </div>
      {formData.getIn(['converter', 'fieldType']) === '1' ?
        <TextField name="*converter.format@TextField" style={{ width: '100%', maxWidth: '100%' }}
          floatingLabelText="转换规则" /> : null}
      <TextField name="*regExpression@TextField" style={{ width: '100%', maxWidth: '100%' }}
        floatingLabelText="抽取规则" />
      <TextField name="*description@TextField" style={{ width: '100%', maxWidth: '100%' }}
        floatingLabelText="描述信息" />
      <div style={{ paddingTop: '1rem' }}>
        <span style={{ color: primary1Color, fontSize: '12px' }}>是否生效：</span>
        <RadioButtonGroup name="*isDisabled@RadioButtonGroup"
          style={{ display: 'flex', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          <RadioButton style={{ width: "6rem" }}
            value="false"
            label="是"
            />
          <RadioButton style={{ width: "6rem" }}
            value="true"
            label="否"
            />
        </RadioButtonGroup>
      </div>
    </Dialog>
  }

  render() {
    let {dispatchFormData, formData} = this.props;
    let {product, textNames } = bindRedux(this.rendTemplate(), dispatchFormData, formData);
    this.textnames = textNames;
    return product
  }
}

function mapStateToProps(state) {
  return {
    addFormOpenFlag: state.page.addFormOpenFlag,
    formData: state.page.formData,
    editFlag: state.page.editFlag,
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(muiThemeable()(DataPumpPanel))