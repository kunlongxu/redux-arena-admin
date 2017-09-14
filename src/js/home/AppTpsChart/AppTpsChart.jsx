import React, { Component } from "react";
import Paper from "material-ui/Paper";
import TpsChart from "../TpsChart";

export default class AppTpsChart extends Component {
  componentWillMount() {
    this.props.actions.loadAppTpsData(this.props.appData.appId);
  }

  render() {
    let { appData, tpsData, logCnt, streamCnt } = this.props;
    return (
        <Paper
          key={appData.appId}
          style={{
            width: "47rem",
            display: "flex",
            padding: "0.5rem",
            margin: "1rem 0rem 0rem 1rem"
          }}
        >
          <TpsChart
            title={appData.name}
            style={{ width: "36rem", height: "20rem" }}
            data={tpsData}
          />
          <div style={{ marginLeft: "3rem", width: "7rem" }}>
            <div style={{ marginTop: "3rem" }}>日志数量(当天)</div>
            <div style={{ marginTop: "1rem" }}>{logCnt}条</div>
            <div style={{ marginTop: "3rem" }}>触发报警(当天)</div>
            <div style={{ marginTop: "1rem" }}>{streamCnt}次</div>
          </div>
        </Paper>
    );
  }
}
