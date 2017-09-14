import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { RadioButton, RadioButtonGroup } from "material-ui/RadioButton";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";
import RefreshIndicator from "material-ui/RefreshIndicator";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import NavigationRefresh from "material-ui/svg-icons/navigation/refresh";
import NavigationChevronLeft from "material-ui/svg-icons/navigation/chevron-left";
import NavigationChevronRight from "material-ui/svg-icons/navigation/chevron-right";
import NavigationSubdirectoryArrowLeft from "material-ui/svg-icons/navigation/subdirectory-arrow-left";
import IconButton from "material-ui/IconButton";
import RaisedButton from "material-ui/RaisedButton";
import { grey500, green500 } from "material-ui/styles/colors";
import IconMenu from "material-ui/IconMenu";
import DropDownMenu from "material-ui/DropDownMenu";
import PageBar from "barcsys-components/PageBar";
import TextField from "material-ui/TextField";
import FlatButton from "material-ui/FlatButton";
import muiThemeable from "material-ui/styles/muiThemeable";
import MenuItem from "material-ui/MenuItem";
import DataPumpPanel from "./DataPumpPanel";
import PumpResult from "./PumpResult";
import * as actions from "./redux/actions";
import { enhenceAction } from "barcsys-dashboard/commons/actions";
import AppAutoComplete from "barcsys-components/AppAutoComplete";
const styles = {
  root: {
    display: "flex",
    flexWrap: "wrap",
    height: "calc(100% - 5rem)"
  },
  cardContainer: {
    width: "calc(100% + 1.1rem)",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexWrap: "wrap"
  }
};

export default class DataPump extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  componentDidUpdate() {
    // this.props.loadServiceData();
  }

  rendAppDropDown() {
    /*return appData.length > 0 ? <DropDownMenu style={{ whiteSpace: 'nowrap' }}
      value={selectedApp} onChange={(e, key, payload) => this.props.changeAppId(payload)}>
      {appData.map(item => <MenuItem key={item._id} value={item._id} primaryText={item.name} />)}
    </DropDownMenu> :
      <DropDownMenu value="Loading">
        <MenuItem value="Loading" primaryText="Loading" />
      </DropDownMenu>*/
    let { appData, changeAppId, defaultAppName } = this.props;
    return (
      <AppAutoComplete
        width="14rem"
        style={{ marginLeft: "1rem", marginBottom: "1rem" }}
        floatingLabelText="点击过滤"
        openOnFocus={true}
        onNewRequest={(item, index, value) => changeAppId(value)}
        filter={() => true}
      />
    );
  }

  getAppName(appData, appId) {
    let result = appData.find(item => item._id === appId);
    if (result == null) {
      return "";
    } else {
      return result.name;
    }
  }

  rendSearchBar() {
    let {
      selectedApp,
      changeSearchStr,
      appId,
      turnPage,
      testAllRules,
      appData,
      backward,
      queryData,
      changeTestStr
    } = this.props;
    // let fp = this.buildfp(routes);
    return (
      <PageBar>
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            {this.rendAppDropDown()}
          </ToolbarGroup>
          <ToolbarGroup>
            <TextField
              name="testStr"
              style={{ marginRight: "1rem" }}
              hintText="请输入要测试的字段"
              onChange={(e, value) => changeTestStr(value)}
            />
            <RaisedButton
              label="测试"
              style={{ marginLeft: "0.5rem" }}
              primary={true}
              onClick={testAllRules}
            />
          </ToolbarGroup>
        </Toolbar>
      </PageBar>
    );
  }

  statusColor(status) {
    switch (status) {
      case true:
        return grey500;
      case false:
        return green500;
    }
  }

  rendCard(card) {
    let {
      switchEnable,
      deleteRule,
      addFormData,
      muiTheme,
      updateFormData,
      handleAddForm,
      handleRuleForm
    } = this.props;
    let { _id, title, isDisabled, regExpression, description, target } = card;
    return (
      <Card
        key={_id}
        style={{ width: "20rem", margin: "1rem", height: "15rem" }}
      >
        <CardMedia>
          <div
            style={{
              background: this.statusColor(isDisabled),
              paddingLeft: "1rem",
              boxSizing: "border-box"
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "nowrap",
                paddingTop: "0.5rem",
                justifyContent: "space-between"
              }}
            >
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "normal",
                  color: muiTheme.palette.alternateTextColor,
                  lineHeight: "3rem",
                  overflow: "hidden",
                  margin: "0",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis"
                }}
              >
                {title}
              </h1>
              <IconMenu
                style={{ float: "right" }}
                iconButtonElement={
                  <IconButton>
                    <MoreVertIcon color="white" />
                  </IconButton>
                }
                anchorOrigin={{ horizontal: "left", vertical: "top" }}
                targetOrigin={{ horizontal: "left", vertical: "top" }}
              >
                {isDisabled ? (
                  <MenuItem
                    primaryText={"启用规则"}
                    onClick={() => {
                      card.isDisabled = false;
                      switchEnable(card);
                    }}
                  />
                ) : (
                  <MenuItem
                    primaryText={"禁用规则"}
                    onClick={() => {
                      card.isDisabled = true;
                      switchEnable(card);
                    }}
                  />
                )}
                <MenuItem
                  primaryText="编辑规则"
                  onClick={() => {
                    handleAddForm(true, card);
                  }}
                />
                <MenuItem
                  primaryText="删除"
                  onClick={() => {
                    deleteRule(card);
                  }}
                />
              </IconMenu>
            </div>
            <span
              style={{
                color: "white",
                display: "block",
                fontSize: "1rem",
                paddingBottom: "1rem",
                height: "1rem"
              }}
            >
              {target}
            </span>
          </div>
        </CardMedia>
        <table style={{ margin: "1rem 0rem 1rem 0rem", width: "100%" }}>
          <tbody>
            <tr>
              <td style={{ paddingLeft: "1rem" }}>状态: </td>
              <td
                style={{
                  textAlign: "right",
                  paddingRight: "1rem",
                  color: this.statusColor(isDisabled)
                }}
              >
                {isDisabled ? "禁用" : "启用"}
              </td>
            </tr>
            <tr>
              <td style={{ paddingLeft: "1rem" }}>表达式: </td>
              <td style={{ textAlign: "right", paddingRight: "1rem" }}>
                <div
                  style={{
                    width: "14rem",
                    overflow: "hidden",
                    height: "1.5rem",
                    textOverflow: "ellipsis"
                  }}
                >
                  {regExpression}
                </div>
              </td>
            </tr>
            <tr>
              <td style={{ paddingLeft: "1rem" }}>描述: </td>
              <td
                style={{ textAlign: "right", paddingRight: "1rem" }}
                title={description}
              >
                {description.length > 23 ? (
                  description.substr(0, 20) + "..."
                ) : (
                  description
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </Card>
    );
  }

  render() {
    let {
      appData,
      instancesData,
      testResult,
      handleCloseResult,
      handleAddForm,
      pumpResultOpenFlag,
      addFormOpenFlag
    } = this.props;
    return (
      <div style={styles.root}>
        <DataPumpPanel />
        <PumpResult
          openFlag={pumpResultOpenFlag}
          testResult={testResult}
          handleClose={handleCloseResult}
        />
        {this.rendSearchBar()}
        <div
          style={{
            height: "100%",
            width: "100%",
            overflow: "hidden",
            marginTop: "4rem"
          }}
        >
          <div style={styles.cardContainer}>
            {instancesData.map(card => this.rendCard(card))}
          </div>
        </div>
        <FloatingActionButton
          style={{
            position: "fixed",
            right: "5rem",
            bottom: "5rem",
            display: addFormOpenFlag ? "none" : "block",
            zIndex: "1"
          }}
          onClick={() => handleAddForm(true)}
        >
          <ContentAdd />
        </FloatingActionButton>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    appId: state.page.appId,
    appData: state.page.appData,
    selectedApp: state.page.selectedApp,
    testResult: state.page.testResult,
    formData: state.page.formData,
    instancesData: state.page.instancesData,
    addFormOpenFlag: state.page.addFormOpenFlag,
    pumpResultOpenFlag: state.page.pumpResultOpenFlag,
    defaultAppName: state.page.defaultAppName
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction(actions), dispatch);
}

module.exports = connect(mapStateToProps, mapDispatchToProps)(
  muiThemeable()(DataPump)
);
