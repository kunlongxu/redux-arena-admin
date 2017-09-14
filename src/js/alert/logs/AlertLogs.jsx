import React, { Component } from "react";
import * as actions from "./redux/actions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { enhenceAction } from "barcsys-dashboard/commons/actions";
import muiThemeable from "material-ui/styles/muiThemeable";
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import TextField from "material-ui/TextField";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";
import IconButton from "material-ui/IconButton";
import ActionSearch from "material-ui/svg-icons/action/search";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import { grey500, red500, green500 } from "material-ui/styles/colors";
import PageBar from "barcsys-components/PageBar";
import NavigationRefresh from "material-ui/svg-icons/navigation/refresh";
import RefreshIndicator from "material-ui/RefreshIndicator";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import NavigationChevronLeft
  from "material-ui/svg-icons/navigation/chevron-left";
import NavigationChevronRight
  from "material-ui/svg-icons/navigation/chevron-right";
import NavigationSubdirectoryArrowLeft
  from "material-ui/svg-icons/navigation/subdirectory-arrow-left";
import AppAutoComplete from "barcsys-components/AppAutoComplete";
import moment from "moment";

const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column"
  }
};

class AlertLogs extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.initInstanceData();
  }

  statusCom(status) {
    switch (status) {
      case "to_send":
        return <span>等待发送</span>;
      case "sending":
        return <span>正在发送</span>;
      case "sended":
        return <span style={{ color: green500 }}>发送成功</span>;
      case "send_failed":
        return <span style={{ color: red500 }}>发送失败</span>;
    }
  }

  listFileter(value, listData) {
    return listData.filter(item => {
      let flag = false;
      for (let key in item) {
        if (key === "_id") continue;
        if (key === "innerAddress") {
          if ((item[key].host + "").indexOf(value) > -1) {
            flag = true;
            break;
          }
          if ((item[key].port + "").indexOf(value) > -1) {
            flag = true;
            break;
          }
        }
        if ((item[key] + "").indexOf(value) > -1) {
          flag = true;
          break;
        }
      }
      return flag;
    });
  }

  rendTable(listData) {
    return (
      <Table
        wrapperStyle={{
          padding: "5rem 1rem 0rem 1rem"
        }}
        height={this.props.pageHeight - 146 + "px"}
        fixedHeader={true}
      >
        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
          <TableRow>
            <TableHeaderColumn style={{ width: "6rem" }} tooltip="更新时间">
              更新时间
            </TableHeaderColumn>
            <TableHeaderColumn style={{}} tooltip="内容">内容</TableHeaderColumn>
            <TableHeaderColumn style={{ width: "4rem" }} tooltip="状态">
              发送状态
            </TableHeaderColumn>
            <TableHeaderColumn style={{ width: "6rem" }} tooltip="接收人">
              接收人
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          showRowHover={true}
          stripedRows={false}
          displayRowCheckbox={false}
        >
          {listData.map((row, index) => {
            let receiverStr = row.receivers.reduce(
              (prev, cur) => prev + cur.addressType + ":" + cur.address + ", ",
              ""
            );
            receiverStr = receiverStr.substring(0, receiverStr.length - 2);
            return (
              <TableRow key={row._id}>
                <TableRowColumn style={{ width: "6rem", whiteSpace: "normal" }}>
                  {moment(row.createTime).format("YYYY-MM-DD HH:mm:ss")}
                </TableRowColumn>
                <TableRowColumn style={{ whiteSpace: "normal" }}>
                  {row.content}
                </TableRowColumn>
                <TableRowColumn style={{ width: "4rem", whiteSpace: "normal" }}>
                  {this.statusCom(row.status)}
                </TableRowColumn>
                <TableRowColumn
                  style={{ width: "6rem", whiteSpace: "normal" }}
                  title={receiverStr}
                >
                  {receiverStr}
                </TableRowColumn>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }

  rendAppDropDown() {
    /*return appData.length > 0 ? <DropDownMenu style={{ whiteSpace: 'nowrap' }}
      value={selectedApp} onChange={(e, key, payload) => this.props.selectApp(payload)}>
      {appData.map(item => <MenuItem key={item._id} value={item._id} primaryText={item.name} />)}
    </DropDownMenu> :
      <DropDownMenu value="Loading">
        <MenuItem value="Loading" primaryText="Loading" />
      </DropDownMenu>*/
    let { selectApp } = this.props;
    return (
      <AppAutoComplete
        width="14rem"
        style={{ marginLeft: "1rem", marginBottom: '1rem' }}
        floatingLabelText="点击过滤"
        openOnFocus={true}
        onNewRequest={(item, index, value) => selectApp(value)}
        filter={() => true}
      />
    );
  }

  rendSearchBar() {
    let {
      isLoading,
      pageNumText,
      setStateValue,
      doQuery,
      reloadAlertData,
      queryData,
      turnPage,
      selectedApp,
      appData,
      changeStatusFilter
    } = this.props;
    return (
      <PageBar>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            {this.rendAppDropDown()}
            {/*<ToolbarSeparator />
            <IconButton disableTouchRipple={true} style={{ marginLeft: '1rem' }}>
              <ActionSearch />
            </IconButton> <TextField hintText="请输入要过滤的字段" name='searchStr'
              onChange={(e) => this.props.setStateValue('searchText', e.target.value)}
              onKeyPress={(e) => { e.key === 'Enter' && doQuery() } }
              />*/}
          </ToolbarGroup>
          <ToolbarGroup>
            <RadioButtonGroup
              name="emergency"
              style={{ display: "flex", flexWrap: "wrap" }}
              onChange={(e, value) => {
                changeStatusFilter(value);
              }}
              valueSelected={
                queryData.getIn(["queryCondition", "status"]) || "all"
              }
            >
              <RadioButton style={{ width: "7rem" }} value="all" label="全部" />
              <RadioButton
                style={{ width: "7rem" }}
                value="sended"
                label="成功"
              />
              <RadioButton
                style={{ width: "7rem" }}
                value="send_failed"
                label="失败"
              />
            </RadioButtonGroup>
            <IconButton
              disabled={isLoading}
              style={{ lineHeight: "56px" }}
              onClick={_ => reloadAlertData()}
            >
              <NavigationRefresh />
            </IconButton>
            <IconButton
              disabled={isLoading}
              style={{ lineHeight: "56px" }}
              onClick={_ => turnPage(queryData.get("currentPageIdx") - 1)}
            >
              <NavigationChevronLeft />
            </IconButton>
            <TextField
              name="pageNumText"
              value={pageNumText}
              style={{ width: "2rem", margin: "0rem 1rem" }}
              inputStyle={{ textAlign: "center" }}
              onChange={e => {
                setStateValue("pageNumText", e.target.value);
              }}
            />
            <ToolbarTitle text={"/" + queryData.get("totalPageCount")} />
            <IconButton
              disabled={isLoading}
              style={{ lineHeight: "56px" }}
              onClick={_ => turnPage(queryData.get("currentPageIdx") + 1)}
            >
              <NavigationChevronRight />
            </IconButton><IconButton
              style={{ lineHeight: "56px" }}
              disabled={isLoading}
              onClick={_ => turnPage(parseInt(pageNumText) - 1)}
            >
              {isLoading
                ? <RefreshIndicator
                  size={40}
                  left={10}
                  top={8}
                  status="loading"
                />
                : <NavigationSubdirectoryArrowLeft />}
            </IconButton>
          </ToolbarGroup>
        </Toolbar>
      </PageBar>
    );
  }

  render() {
    let { instancesData } = this.props;
    return (
      <div style={styles.root}>
        {this.rendSearchBar()}
        {this.rendTable(instancesData)}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    instancesData: state.page.instancesData,
    isLoading: state.page.isLoading,
    queryData: state.page.queryData,
    pageNumText: state.page.pageNumText,
    selectedApp: state.page.selectedApp,
    appData: state.page.appData,
    pageHeight: state.frame.pageHeight,
    defaultAppName: state.page.defaultAppName
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction(actions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  muiThemeable()(AlertLogs)
);
