import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import DropDownMenu from 'material-ui/DropDownMenu';
import TextField from 'material-ui/TextField';
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

class AlertNotifyStep extends Component {

  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.reveiverFormOpenFlag !== this.props.reveiverFormOpenFlag) return true;
    let diffData = immutablediff(this.props.alertData, nextProps.alertData);
    let flag = templateShouldUpdate(diffData, this.textnames);
    return flag
  }

  rendTemplate() {
    let {addReceiverDataItem, alertData, muiTheme,
      delReceiverDataItem} = this.props;
    let { primary1Color } = muiTheme.palette;
    return <div>
        {alertData.get('receiver').map((item, index) => <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ color: primary1Color, fontSize: '16px', marginRight: '1rem' }}>{index + 1 + ':'}</span>
          <DropDownMenu name={`*receiver.${index}.addressType@DropDownMenu`} autoWidth={false} style={{ width: '150px' }}>
            <MenuItem value="sms" primaryText="短信" />
            <MenuItem value="email" primaryText="电子邮件" />
          </DropDownMenu>
          <TextField name={`*receiver.${index}.address@TextField`} hintText="请输入地址" />
          <IconButton onClick={() => delReceiverDataItem(index)}><ContentClear /></IconButton>
        </div>)}
      <FlatButton label="增加规则项"
        secondary={true}
        onClick={addReceiverDataItem}
        style={{float:'right'}}
        icon={<ContentAdd />} />
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
    alertData: state.page.alertData
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(muiThemeable()(AlertNotifyStep))