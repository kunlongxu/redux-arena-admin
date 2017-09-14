
import React, { Component } from 'react';
import DropDownMenu from 'material-ui/DropDownMenu';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import { bindRedux, templateShouldUpdate } from 'barcsys-dashboard/commons/formFunc'
import muiThemeable from 'material-ui/styles/muiThemeable';
import immutablediff from 'immutablediff'
import * as actions from './redux/actions'

class RuleInfoStep extends Component {

  constructor(props) {
    super(props);
    this.templateShouldUpdate = templateShouldUpdate(this.rendTemplate(), (item) => {
      return false
    })
    this.textnames = []
  }

  shouldComponentUpdate(nextProps, nextState) {
    let diffData = immutablediff(this.props.ruleData, nextProps.ruleData);
    let flag = templateShouldUpdate(diffData, this.textnames);
    return flag
  }

  rendTemplate() {
    let { ruleData, delRuleDataItem,muiTheme, addRuleDataItem } = this.props;
    let { primary1Color }= muiTheme.palette;
    return <div>
      {ruleData.get('ruleList').map((item, index) =>
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: primary1Color, fontSize: '16px', marginRight: '1rem' }}>{index + 1 + ':'}</span>
          <TextField name={`*ruleList.${index}.field@TextField`} hintText="字段名" />
          <DropDownMenu name={`*ruleList.${index}.operator@DropDownMenu`} autoWidth={false} style={{ width: '150px' }}>
            <MenuItem value="0" primaryText="exist" />
            <MenuItem value="1" primaryText="=" />
            <MenuItem value="2" primaryText=">=" />
            <MenuItem value="3" primaryText="<=" />
            <MenuItem value="4" primaryText="RegMatch" />
          </DropDownMenu>
          {item.get('operator') === "0" ? null :
            <TextField name={`*ruleList.${index}.value@TextField`} hintText="字段值" />}
          <IconButton onClick={() => delRuleDataItem(index)}><ContentClear /></IconButton>
        </div>)}
      <div style={{display:'flex'}}>
      <TextField name="*ruleDSL@TextField" style={{ width: '100%' }}
        hintText="规则表达式" />
      <FlatButton label="增加规则项"
        secondary={true}
        onClick={addRuleDataItem}
        icon={<ContentAdd />} />
        </div>
    </div>
  }

  render() {
    let {dispatchRuleData, ruleData} = this.props;
    let {product, textNames } = bindRedux(this.rendTemplate(), dispatchRuleData, ruleData);
    this.textnames = textNames;
    return product;
  }
}

function mapStateToProps(state) {
  return {
    ruleData: state.page.ruleData
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(muiThemeable()(RuleInfoStep));