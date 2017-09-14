import React, { Component } from 'react';
import FlatButton from 'material-ui/FlatButton';
import ContentForward from 'material-ui/svg-icons/content/forward';
import Dialog from 'material-ui/Dialog';
import { lightBlue500, red500 } from 'material-ui/styles/colors';

export default class PumpResult extends Component {
  render() {
    let {openFlag, testResult, handleClose} = this.props;
    const actions = [
      <FlatButton
        label="关闭"
        primary={true}
        onTouchTap={handleClose}
        />,
    ];
    return <Dialog title="测试结果" actions={actions}
      modal={false} open={openFlag} autoScrollBodyContent={true}>
      <table style={{ marginTop: '2rem' }}>
        <tbody>
          {testResult.map((item,index) => <tr key={index}>
            <td>{item.title + ':'}</td><td>
              {item.value != null ? <span style={{ fontFamily: 'Microsoft Yahei', color: lightBlue500 }}>{item.value}</span> :
                <span style={{ fontFamily: 'Microsoft Yahei', color: red500 }}>空数据</span>}
            </td><td>
              <ContentForward /></td><td style={{ border: '1px solid #000', padding: '0rem 0.5rem' }}>
              {item.target}
            </td>
          </tr>)
          }
        </tbody>
      </table>
    </Dialog>
  }
}