import React, { Component } from "react";
import Chart from "./echartsLine";

export default class TpsChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dom: false,
      echartsInstance: null,
      data: null
    };
  }

  componentWillReceiveProps(nextProps) {
    let { data } = nextProps;
    if (data == null) return;
    if (this.state.data !== data) {
      this.state.data = data;
      this.state.echartsInstence.drawChart(data);
    }
  }

  refRegister(dom) {
    if (dom == null) return;
    if (this.state.dom !== false) return;
    this.state.dom = true;
    this.state.echartsInstence = new Chart(dom, this.props.title);
  }

  render() {
    let { style } = this.props;
    return (
      <div
        style={Object.assign({ width: "100%", height: "100%" }, style)}
        ref={input => this.refRegister(input)}
      />
    );
  }
}
