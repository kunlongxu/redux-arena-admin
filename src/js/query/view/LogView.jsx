import * as React from "react";
import * as ReactDOM from "react-dom";
import IconButton from "material-ui/IconButton";
import RaisedButton from "material-ui/RaisedButton";
import ActionVisibility from "material-ui/svg-icons/action/visibility";
import ActionDone from "material-ui/svg-icons/action/done";
import ActionVisibilityOff from "material-ui/svg-icons/action/visibility-off";
import Snackbar from "material-ui/Snackbar";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "./redux/actions";
import TextField from "material-ui/TextField";
import { LogScroller } from "./logScroller";
import AceEditor from "react-ace";
import brace from "brace";
import CircularProgress from "material-ui/CircularProgress";
import NavigationArrowBack from "material-ui/svg-icons/navigation/arrow-back";
import muiThemeable from "material-ui/styles/muiThemeable";

import "brace/mode/json";
import "brace/theme/github";
import "brace/ext/language_tools";

const styles = {
  cardContainer: {
    height: "calc(100vh - 6rem)",
    margin: "1rem",
    overflowY: "hidden",
    borderRadius: "0.5rem",
    wordBreak: "break-all",
    lineHeight: "24px",
    fontSize: "16px"
  }
};

class LogView extends React.Component {
  componentDidMount() {
    let {
      loadLogs,
      match,
      calcDefaultConfit,
      initLogScroller,
      muiTheme
    } = this.props;
    let logContainer = this.refs["logContainer"];
    ReactDOM.findDOMNode(this.refs["logContainer"]).focus();
    calcDefaultConfit(logContainer);
    initLogScroller(LogScroller, muiTheme.palette.textColor);
    let fileInfo = {
      app: match.params.app,
      machine: match.params.machine,
      sequence: match.params.sequence,
      timestamp: match.params.timestamp
    };
    loadLogs(fileInfo, 200);
    loadLogs(fileInfo, -200);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.pageWidth !== nextProps.pageWidth) {
      setTimeout(
        () => this.props.calcDefaultConfit(this.refs["logContainer"]),
        450
      );
    }
    if (this.props.pageColNum !== nextProps.pageColNum) {
      if (nextProps.logScroller !== null)
        nextProps.logScroller.setPageColNum(nextProps.pageColNum);
    }
  }

  componentWillUnmount() {
    //let logContainer = document.getElementById('logContainer');
  }

  render() {
    let {
      pointer,
      flipLog,
      cachedData,
      pageRowNum,
      detailTags,
      logScroller,
      flipNum,
      loadingFlag,
      pageWidth,
      muiTheme,
      showPanelFlag,
      showPanel,
      refreshContainer,
      displayConfig,
      setDisplayConfig,
      applyConfig,
      pageColNum
    } = this.props;
    return (
      <div
        style={{
          width: "100%",
          overflow: "hidden"
        }}
      >
        <div
          ref="logContainer"
          tabIndex="0"
          style={Object.assign({}, styles.cardContainer, {
            backgroundColor: muiTheme.toolbar.backgroundColor
          })}
          onKeyDown={flipLog}
          onWheel={flipLog}
        >
          <IconButton
            style={{
              position: "fixed",
              right: "1rem",
              top: "5rem",
              display: showPanelFlag ? "none" : "block"
            }}
            onClick={() => history.go(-1)}
          >
            <NavigationArrowBack color={muiTheme.palette.textColor} />
          </IconButton>
          {/*<IconButton
            style={{ position: 'fixed', right: '1rem', top: '7rem', display: showPanelFlag ? 'none' : 'block' }}
            onClick={() => showPanel(true) }
            >
            <ActionVisibility color="white"/>
          </IconButton>*/}
          <CircularProgress
            size={40}
            thickness={7}
            style={{
              position: "absolute",
              right: "40px",
              bottom: "40px",
              display: loadingFlag ? "block" : "none"
            }}
          />
          {logScroller ? logScroller.rendLines(pageRowNum) : "Loading"}
        </div>
        <div
          style={{
            paddingLeft: "1rem",
            width: "20rem",
            height: "35rem",
            display: showPanelFlag ? "block" : "none",
            position: "fixed",
            top: "5rem",
            right: "2rem"
          }}
        >
          <AceEditor
            mode="json"
            theme="github"
            height="calc(100% - 3rem)"
            width="100%"
            onChange={configStr => setDisplayConfig(configStr)}
            value={displayConfig}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              backgroundColor: "silver",
              padding: "0.5rem"
            }}
          >
            <RaisedButton
              label="应用"
              labelPosition="before"
              primary={true}
              icon={<ActionDone />}
              onClick={applyConfig}
            />
            <RaisedButton
              label="隐藏"
              labelPosition="before"
              onClick={() => showPanel(false)}
              icon={<ActionVisibilityOff />}
            />
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    cachedData: state.page.cachedData,
    pointer: state.page.pointer,
    pageRowNum: state.page.pageRowNum,
    pageColNum: state.page.pageColNum,
    detailTags: state.page.detailTags,
    showPanelFlag: state.page.showPanelFlag,
    displayConfig: state.page.displayConfig,
    getLogDivFuc: state.page.getLogDivFuc,
    logScroller: state.page.logScroller,
    flipNum: state.page.flipNum,
    loadingFlag: state.page.loadingFlag,
    pageWidth: state.frame.pageWidth,
    match: state.frame.match
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(
  muiThemeable()(LogView)
);
