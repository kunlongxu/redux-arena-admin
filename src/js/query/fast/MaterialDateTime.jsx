import React from "react";
import Datetime from "react-datetime";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import "./datetime.css";
import moment from "moment";
moment.locale("zh-CN");

function checkTime(timeStr) {
  let sesultList = [
    "years",
    "months",
    "days",
    "hours",
    "minutes",
    "seconds",
    "milliseconds"
  ];
  let newMomentDate = moment(timeStr, "YYYY-MM-DD HH:mm:ss");
  let index = newMomentDate.invalidAt();
  if (index < 0) return { errorText: null, momentDate: newMomentDate };
  return { errorText: `日期格式错误，请检查${sesultList[index]}` };
}

export default class MaterialDateTime extends React.Component {
  componentWillMount() {
    this.state = {
      errorText: null,
      isDatetimeShow: false,
      text: moment(this.props.defaultDate).format("YYYY-MM-DD HH:mm:ss"),
      panelDate: this.props.defaultDate
    };
  }

  onTextChange = (e, value) => {
    let { momentDate, errorText } = checkTime(value);
    if (errorText == null) {
      this.setState({
        errorText: errorText,
        text: value,
        panelDate: momentDate.toDate()
      });
    } else {
      this.setState({ errorText: errorText, text: value });
    }
  };

  onPanelConfirm = e => {
    let text = moment(this.state.panelDate).format("YYYY-MM-DD HH:mm:ss");
    this.setState({
      errorText: null,
      text: text,
      isDatetimeShow: false
    });
    this.props.onChange(e, this.state.panelDate);
  };

  onPanelCancel = e => {
    this.setState({
      panelDate:
        this.state.errorText == null
          ? moment(this.state.text, "YYYY-MM-DD HH:mm:ss").toDate()
          : newDate(),
      isDatetimeShow: false
    });
  };

  showDatePanel = () => {
    this.setState({ isDatetimeShow: true });
  };

  onPanelChange = momentDate => {
    this.setState({
      panelDate: momentDate.toDate()
    });
  };

  render() {
    return (
      <div style={this.props.style || { width: "100%" }}>
        <TextField
          name={this.props.name}
          floatingLabelText={this.props.floatingLabelText}
          value={this.state.text}
          onChange={this.onTextChange}
          errorText={this.state.errorText}
          fullWidth={this.props.fullWidth}
          onFocus={this.showDatePanel}
        />
        <div
          style={{
            position: "absolute",
            display: this.state.isDatetimeShow ? "block" : "none",
            zIndex: "15",
            background: "white",
            paddingBottom: "1rem"
          }}
        >
          <Datetime
            locale="zh-CN"
            open={true}
            input={false}
            style={{ position: "absolute" }}
            onChange={this.onPanelChange}
            value={this.state.panelDate}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <FlatButton
              style={{ marginRight: "1rem" }}
              label="取消"
              onClick={this.onPanelCancel}
            />
            <FlatButton
              style={{ marginRight: "1rem" }}
              label="确定"
              primary={true}
              onClick={this.onPanelConfirm}
            />
          </div>
        </div>
      </div>
    );
  }
}
