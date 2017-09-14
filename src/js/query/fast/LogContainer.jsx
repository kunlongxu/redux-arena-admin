import React from "react";
import ReactDOM from "react-dom";
import IconButton from "material-ui/IconButton";
import EditerFormatLineSpacing from "material-ui/svg-icons/editor/format-line-spacing";
import EditerVerticalAlignCenter from "material-ui/svg-icons/editor/vertical-align-center";
import NavigationSubdirectoryArrowRight from "material-ui/svg-icons/navigation/subdirectory-arrow-right";
import MapsZoomOutMap from "material-ui/svg-icons/maps/zoom-out-map";
import Paper from "material-ui/Paper";
import muiThemeable from "material-ui/styles/muiThemeable";
import Chip from "material-ui/Chip";
import Avatar from "material-ui/Avatar";
import DeviceAccessTime from "material-ui/svg-icons/device/access-time";
import NavigationAccessTime from "material-ui/svg-icons/navigation/apps";
import HardwareComputer from "material-ui/svg-icons/hardware/computer";
import { app } from "appconfig/settings";
import { tapeService } from "appconfig/apiUrl";

const logContainerStyle = {
  paddingLeft: "1rem",
  flexWrap: "wrap",
  marginTop: "5rem",
  width: "calc(100% - 1rem)"
};
class LogContainer extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.logsData !== this.props.logsData;
  }

  render() {
    let {
      logsData,
      fieldNames,
      openDetail,
      jumpTo,
      appData,
      searchedText,
      muiTheme
    } = this.props;
    return (
      <div style={logContainerStyle}>
        {logsData.map((logData, index) =>
          <LogCard
            key={
              logData.application +
              logData.machine +
              logData.timestamp +
              logData.sequence
            }
            logData={logData}
            appData={appData}
            fieldNames={fieldNames}
            jumpTo={jumpTo}
            isCollapsed={false}
            openDetail={openDetail}
            muiTheme={muiTheme}
            searchedText={searchedText}
          />
        )}
      </div>
    );
  }
}

class LogCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: props.isCollapsed ? props.isCollapsed : false,
      isShowDetail: false
    };
  }

  colorSpan(str, searchedText) {
    let strArray = [str];
    if (searchedText !== "") {
      strArray = str.split(searchedText);
    }
    return strArray
      .map((strItem, index) => {
        if (index !== strArray.length - 1) {
          return [
            <span
              key={index}
              style={{
                color: "inherit",
                wordBreak: "break-all",
                lineHeight: "1.5rem"
              }}
            >
              {strItem}
            </span>,
            <span
              key={"em" + index}
              style={{
                background: "#CE93D8",
                wordBreak: "break-all",
                lineHeight: "1.5rem"
              }}
            >
              {searchedText}
            </span>
          ];
        } else {
          return [
            <span
              key={index}
              style={{
                color: "inherit",
                wordBreak: "break-all",
                lineHeight: "1.5rem"
              }}
            >
              {strItem}
            </span>
          ];
        }
      })
      .reduce((prev, cur) => prev.concat(cur));
  }

  rendLogLine(lineData, caller, searchedText) {
    return lineData
      .split("\r\n")
      .map((item, index) => {
        if (item === "") return null;
        return (
          <div style={{ color: "inherit", width: "100%" }} key={caller + index}>
            {this.colorSpan(item, searchedText)}
          </div>
        );
      })
      .filter(item => item != null);
  }

  timeToArray(timestamp) {
    return [
      timestamp.substring(0, 4) +
        "-" +
        timestamp.substring(4, 6) +
        "-" +
        timestamp.substring(6, 8),
      timestamp.substring(8, 10) +
        ":" +
        timestamp.substring(10, 12) +
        ":" +
        timestamp.substring(12, 14)
    ];
  }

  rendExtractedFields(extractedFields) {
    let result = [];
    for (let key in extractedFields) {
      result.push(
        <Chip
          key={key}
          style={{ marginRight: "0.5rem" }}
          labelStyle={{ userSelect: "true" }}
        >
          {`${key}: ${extractedFields[key]}`}
        </Chip>
      );
    }
    return result;
  }
  render() {
    let {
      openDetail,
      logData,
      fieldNames,
      jumpTo,
      appData,
      muiTheme,
      searchedText
    } = this.props;
    let {
      sequence,
      application,
      timestamp,
      machine,
      voucherNo,
      line,
      extractedFields
    } = logData;
    let { isCollapsed } = this.state;
    return (
      <Paper
        style={{
          marginBottom: "0.5rem",
          width: "100%",
          height: isCollapsed ? "10rem" : "auto",
          display: "flex"
        }}
      >
        <div
          style={{
            color: muiTheme.palette.textColor,
            width: "100%",
            padding: "0.5rem",
            overflow: "hidden"
          }}
        >
          <div
            style={{
              paddingBottom: "0.5rem",
              color: "inherit",
              display: "flex",
              width: "100%",
              wordBreak: "break-all"
            }}
          >
            <Chip
              style={{ color: "inherit", marginRight: "0.5rem" }}
              labelStyle={{ userSelect: "true" }}
            >
              <Avatar color="#444" icon={<DeviceAccessTime />} />
              {this.timeToArray(timestamp)[0]} {this.timeToArray(timestamp)[1]}
            </Chip>
            <Chip
              style={{ color: "inherit", marginRight: "0.5rem" }}
              labelStyle={{ userSelect: "true" }}
            >
              <Avatar color="#444" icon={<HardwareComputer />} />
              {machine}
            </Chip>
          </div>
          {this.rendLogLine(line, "LogCard", searchedText)}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end"
          }}
        >
          {this.props.isCollapsed == null
            ? <IconButton
                title={isCollapsed ? "展开" : "收起"}
                style={{ display: "block" }}
                onClick={() => this.setState({ isCollapsed: !isCollapsed })}
              >
                {isCollapsed
                  ? <EditerFormatLineSpacing />
                  : <EditerVerticalAlignCenter />}
              </IconButton>
            : null}
          <IconButton
            title="详情"
            style={{ display: "block" }}
            onClick={() => {
              openDetail({
                header: `${application}@${machine}--${this.timeToArray(
                  timestamp
                ).join(" ")}`,
                machine: machine,
                content: [
                  <div
                    key="LogDetailTags"
                    style={{
                      padding: "0.5rem 0",
                      display: "flex",
                      flexWrap: "wrap"
                    }}
                  >
                    {fieldNames
                      .map(item =>
                        <Chip
                          key={item.name}
                          style={{ marginRight: "0.5rem" }}
                          labelStyle={{ userSelect: "true" }}
                        >
                          {`${item.name}: ${logData[item.name]}`}
                        </Chip>
                      )
                      .concat(this.rendExtractedFields(extractedFields))}
                  </div>,
                  <div key="LogDetailContent" style={{ padding: "0rem 1rem" }}>
                    {this.rendLogLine(line, "LogDetail", searchedText)}
                  </div>
                ]
              });
            }}
          >
            <MapsZoomOutMap />
          </IconButton>
          <IconButton
            title="跳转"
            onClick={() => {
              jumpTo(
                "/" +
                  app.contextRoot +
                  "/view/" +
                  application +
                  "/" +
                  machine +
                  "/" +
                  sequence +
                  "/" +
                  timestamp,
                true
              );
            }}
            style={{ display: "block" }}
          >
            <NavigationSubdirectoryArrowRight />
          </IconButton>
        </div>
      </Paper>
    );
  }
}

export default muiThemeable()(LogContainer);
