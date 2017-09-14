import React from "react";
import ReactDOM from "react-dom";
import RaisedButton from "material-ui/RaisedButton";
import IconButton from "material-ui/IconButton";
import TextField from "material-ui/TextField";
import ContentAdd from "material-ui/svg-icons/content/add";
import FloatingActionButton from "material-ui/FloatingActionButton";
import DropDownMenu from "material-ui/DropDownMenu";
import MenuItem from "material-ui/MenuItem";
import AutoComplete from "material-ui/AutoComplete";
import AppAutoComplete from "barcsys-components/AppAutoComplete";
import Checkbox from "material-ui/Checkbox";
import Paper from "material-ui/Paper";
import Dialog from "material-ui/Dialog";
import ActionSearch from "material-ui/svg-icons/action/search";
import NavigationCancel from "material-ui/svg-icons/navigation/cancel";
import FileCloudDownload from "material-ui/svg-icons/file/cloud-download";
import NavigationChevronLeft from "material-ui/svg-icons/navigation/chevron-left";
import NavigationChevronRight from "material-ui/svg-icons/navigation/chevron-right";
import NavigationSubdirectoryArrowLeft from "material-ui/svg-icons/navigation/subdirectory-arrow-left";
import RefreshIndicator from "material-ui/RefreshIndicator";
import VerticalAlignBottom from "material-ui/svg-icons/editor/vertical-align-bottom";
import FlatButton from "material-ui/FlatButton";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle
} from "material-ui/Toolbar";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "./redux/actions";
import { enhenceAction } from "barcsys-dashboard/commons/actions";
import LogContainer from "./LogContainer";
import muiThemeable from "material-ui/styles/muiThemeable";
import moment from "moment";
import MaterialDateTime from "./MaterialDateTime";
moment.locale("zh-CN");

const rootStyle = {
  display: "flex",
  flexWrap: "nowrap",
  marginRight: "18rem",
  height: "calc(100% - 5rem)"
};

class FastQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      statusBarFocusFlag: false
    };
  }
  rendSearchPanel() {
    let {
      queryData,
      changeField,
      fieldNames,
      dropDownValue,
      deleteField,
      doSearch,
      muiTheme,
      defaultAppName,
      fieldValue,
      setStateValue,
      addCondition,
      resetPageNum
    } = this.props;
    let { primary1Color } = muiTheme.palette;
    return (
      <Paper
        style={{
          right: "0rem",
          margin: "5rem 1rem 0rem 0rem",
          alignItems: "baseline",
          display: "flex",
          position: "fixed",
          flexDirection: "column",
          padding: "0rem 1rem 1rem 1rem",
          width: "16rem"
        }}
      >
        <AppAutoComplete
          width="14rem"
          floatingLabelText="点击过滤"
          openOnFocus={true}
          onNewRequest={(item, index, value) => changeField("appFilter", value)}
          onUpdateInput={text => text === "" && changeField("appId", "")}
          filter={() => true}
        />
        <MaterialDateTime
          name="fromTimeFilter"
          floatingLabelText="开始时间"
          defaultDate={moment(
            queryData.get("fromTimeFilter"),
            "YYYY-MM-DD HH-mm-ss"
          ).toDate()}
          onChange={(e, date) =>
            changeField(
              "fromTimeFilter",
              date ? moment(date).format("YYYY-MM-DD HH:mm:ss") : null
            )}
          fullWidth={true}
        />
        <div
          style={{
            width: "100%",
            display: "flex"
          }}
        >
          <MaterialDateTime
            name="toTimeFilter"
            floatingLabelText="结束时间"
            defaultDate={moment(
              queryData.get("toTimeFilter"),
              "YYYY-MM-DD HH-mm-ss"
            ).toDate()}
            onChange={(e, date) =>
              changeField(
                "toTimeFilter",
                date ? moment(date).format("YYYY-MM-DD HH:mm:ss") : null
              )}
            fullWidth={true}
            style={{
              width: "calc(100% - 24px)"
            }}
          />
          <VerticalAlignBottom
            style={{
              cursor: "pointer",
              paddingTop: "2.5rem",
              width: "24px",
              float: "right"
            }}
            onClick={() =>
              changeField(
                "toTimeFilter",
                moment().format("YYYY-MM-DD HH:mm:ss")
              )}
          />
        </div>
        <TextField
          name="contentFilter"
          multiLine={true}
          rows={1}
          floatingLabelText="正文"
          value={queryData.get("contentFilter")}
          fullWidth={true}
          onChange={e => changeField("contentFilter", e.target.value)}
        />
        <div
          style={{
            marginTop: "1rem",
            display: "flex",
            flexDirection: "column",
            width: "100%",
            justifyContent: "space-around"
          }}
        >
          <Checkbox
            label="按时间倒序"
            defaultChecked={queryData.get("isRecentFirst")}
            onCheck={(e, isInputChecked) =>
              changeField("isRecentFirst", isInputChecked)}
          />
          {fieldNames.map(item => {
            if (queryData.get(item.value) != null) {
              return (
                <div
                  key={item.name}
                  style={{
                    paddingTop: "0.5rem",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <span
                    style={{
                      color: "grey",
                      marginRight: "0.5rem"
                    }}
                  >
                    {item.name}:
                  </span>
                  <span
                    style={{
                      wordBreak: "break-all",
                      width: "100%",
                      textAlign: "right"
                    }}
                  >
                    {queryData.get(item.value)}
                  </span>
                  <NavigationCancel
                    style={{
                      minHeight: "24px",
                      minWidth: "24px",
                      cursor: "pointer"
                    }}
                    onClick={() => deleteField(item.name)}
                  />
                </div>
              );
            }
            return null;
          })}
          {queryData
            .get("additionalFilter")
            .map((value, key) =>
              <div
                key={key}
                style={{
                  paddingTop: "0.5rem",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <span
                  style={{
                    color: "grey",
                    marginRight: "0.5rem"
                  }}
                >
                  {key}:
                </span>
                <span
                  style={{
                    wordBreak: "break-all",
                    width: "100%",
                    textAlign: "right"
                  }}
                >
                  {value}
                </span>
                <NavigationCancel
                  style={{
                    minHeight: "24px",
                    minWidth: "24px",
                    cursor: "pointer"
                  }}
                  onClick={() => deleteField(key)}
                />
              </div>
            )
            .toArray()}
        </div>
        <div
          style={{
            width: "100%",
            height: "0.5rem",
            marginTop: "1rem",
            borderTop: "2px dashed #8c8b8b"
          }}
        />
        <AutoComplete
          hintText="字段名"
          value={dropDownValue}
          dataSource={fieldNames}
          fullWidth={true}
          onUpdateInput={value => {
            setStateValue("dropDownValue", value);
          }}
          onNewRequest={obj => {
            setStateValue("dropDownValue", obj.name);
          }}
          dataSourceConfig={{
            text: "name",
            value: "value"
          }}
        />
        <TextField
          name="fieldValue"
          hintText="字段值"
          value={fieldValue}
          fullWidth={true}
          onChange={e => {
            setStateValue("fieldValue", e.target.value);
          }}
          multiLine={true}
        />
        <div
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "baseline"
          }}
        >
          <FloatingActionButton
            onClick={() => {
              resetPageNum();
              doSearch();
            }}
          >
            <ActionSearch />
          </FloatingActionButton>
          <FloatingActionButton
            secondary={true}
            mini={true}
            style={{
              marginLeft: "0.5rem"
            }}
            onClick={() => addCondition()}
          >
            <ContentAdd />
          </FloatingActionButton>
        </div>
      </Paper>
    );
  }

  toDataStr(datestr) {
    return (
      datestr.substring(0, 4) +
      "年" +
      datestr.substring(4, 6) +
      "月" +
      datestr.substring(6, 8) +
      "日" +
      datestr.substring(6, 8) +
      "时" +
      datestr.substring(8, 10) +
      "分" +
      datestr.substring(10, 12) +
      "秒"
    );
  }

  rendStatusBar(logsData, startNum, partFlag) {
    let {
      turnPage,
      pageNumText,
      isLoading,
      downloadQueryData,
      setStateValue,
      generateFile
    } = this.props;
    return (
      <Paper
        onMouseOver={() => this.setState({ statusBarFocusFlag: true })}
        onMouseOut={() => this.setState({ statusBarFocusFlag: false })}
        zDepth={this.state.statusBarFocusFlag ? 2 : 1}
        style={{
          zIndex: "2",
          position: "fixed",
          margin: "0.75rem 0rem 0rem 1rem",
          width: partFlag ? "calc(100% - 18rem)" : "calc(100% - 2rem)"
        }}
      >
        <Toolbar>
          <ToolbarGroup firstChild={true}>
            <ToolbarTitle
              text={`共搜得 ${logsData.total} 条记录`}
              style={{
                fontWeight: "300",
                fontSize: "1rem",
                marginLeft: "1rem"
              }}
            />
            <IconButton
              disabled={downloadQueryData == null}
              style={{
                lineHeight: "56px"
              }}
              onClick={generateFile}
            >
              <FileCloudDownload />
            </IconButton>
          </ToolbarGroup>
          <ToolbarGroup>
            <IconButton
              disabled={isLoading}
              style={{
                lineHeight: "56px"
              }}
              onClick={_ => turnPage(startNum / 50)}
            >
              <NavigationChevronLeft />
            </IconButton>
            <TextField
              name="pageNumText"
              value={pageNumText}
              style={{
                width: "2rem",
                margin: "0rem 1rem"
              }}
              inputStyle={{
                textAlign: "center"
              }}
              onChange={e => {
                setStateValue("pageNumText", e.target.value);
              }}
            />
            <ToolbarTitle text={"/" + (Math.floor(logsData.total / 50) + 1)} />
            <IconButton
              disabled={isLoading}
              style={{
                lineHeight: "56px"
              }}
              onClick={_ => turnPage(startNum / 50 + 2)}
            >
              <NavigationChevronRight />
            </IconButton>
            <IconButton
              style={{
                lineHeight: "56px"
              }}
              disabled={isLoading}
              onClick={_ => turnPage(parseInt(pageNumText))}
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
      </Paper>
    );
  }

  render() {
    let {
      logsData,
      queryData,
      frameSize,
      leftNavOpenFlag,
      detailContent,
      openDetail,
      jumpTo,
      closeDetail,
      isDetailOpen,
      fieldNames,
      searchedText
    } = this.props;
    let partFlag = frameSize === "largeL" && leftNavOpenFlag;
    return (
      <div style={rootStyle}>
        {this.rendStatusBar(logsData, queryData.get("offset"), partFlag)}
        <LogContainer
          logsData={logsData == null ? [] : logsData.messages}
          fieldNames={fieldNames}
          jumpTo={jumpTo}
          openDetail={openDetail}
          searchedText={searchedText}
        />
        {this.rendSearchPanel()}
        <Dialog
          contentStyle={{
            width: "calc(100% - 4rem)",
            maxWidth: "none"
          }}
          title={detailContent.header}
          actions={[
            <FlatButton label="关闭" primary={true} onTouchTap={closeDetail} />
          ]}
          modal={false}
          open={isDetailOpen}
          onRequestClose={closeDetail}
          autoScrollBodyContent={true}
        >
          {detailContent.content}
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    startTime: state.page.startTime,
    endTime: state.page.endTime,
    logsData: state.page.logsData,
    queryData: state.page.queryData,
    fieldNames: state.page.fieldNames,
    dropDownValue: state.page.dropDownValue,
    fieldValue: state.page.fieldValue,
    pageNumText: state.page.pageNumText,
    detailContent: state.page.detailContent,
    isDetailOpen: state.page.isDetailOpen,
    logFieldNames: state.page.logFieldNames,
    defaultAppName: state.page.defaultAppName,
    isLoading: state.page.isLoading,
    downloadQueryData: state.page.downloadQueryData,
    frameSize: state.frame.frameSize,
    searchedText: state.page.searchedText,
    leftNavOpenFlag: state.frame.leftNavOpenFlag
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(enhenceAction(actions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  muiThemeable()(FastQuery)
);
