import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import { grey500, green500, blue500 } from "material-ui/styles/colors";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText
} from "material-ui/Card";
import muiThemeable from "material-ui/styles/muiThemeable";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TpsChart from "./TpsChart";
import GaugeChart from "./GaugeChart";
import AppTpsChart from "./AppTpsChart";

const styles = {
  cardContainer: {
    width: "100%",
    height: "100%",
    overflowY: "auto",
    display: "flex",
    flexWrap: "wrap",
    paddingBottom: "1rem"
  }
};

function ByteFitStr(value) {
  let tmpValue = value / 1024;
  if (tmpValue < 1) return value + "B";
  value /= 1024;
  tmpValue = value / 1024;
  if (tmpValue < 1) return value.toFixed(2) + "KB";
  value /= 1024;
  tmpValue = value / 1024;
  if (tmpValue < 1) return value.toFixed(2) + "MB";
  value /= 1024;
  tmpValue = value / 1024;
  if (tmpValue < 1) return value.toFixed(2) + "GB";
  return tmpValue.toFixed(2) + "TB";
}

class Home extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.actions.loadAppData();
    this.props.actions.loadTapeData();
  }

  rendSystemCards() {
    let {
      indexSpace,
      hbaseSpace,
      totalMessages,
      appData,
      tapeTpsData
    } = this.props;
    return (
      <div style={styles.cardContainer}>
        <Card style={{ padding: "0.5rem", margin: "1rem 0rem 0rem 1rem" }}>
          <TpsChart
            title="日志处理TPS"
            style={{ width: "30rem", height: "20rem" }}
            data={tapeTpsData}
          />
          <div
            style={{
              height: "2rem",
              textAlign: "center",
              marginTop: "-1rem"
            }}
          >
            日志数：{totalMessages.toLocaleString()}
          </div>
        </Card>
        <Card style={{ padding: "0.5rem", margin: "1rem 0rem 0rem 1rem" }}>
          <GaugeChart
            style={{ width: "30rem", height: "20rem" }}
            title="ES容量"
            data={{
              total: ByteFitStr(indexSpace.total),
              used: ByteFitStr(indexSpace.used),
              percentage: (indexSpace.used / indexSpace.total * 100).toFixed(2)
            }}
          />
        </Card>
        <Card style={{ padding: "0.5rem", margin: "1rem 0rem 0rem 1rem" }}>
          <GaugeChart
            style={{ width: "30rem", height: "20rem" }}
            title="HDFS容量"
            data={{
              total: ByteFitStr(hbaseSpace.total),
              used: ByteFitStr(hbaseSpace.used),
              percentage: (hbaseSpace.used / hbaseSpace.total * 100).toFixed(2)
            }}
          />
        </Card>
      </div>
    );
  }

  render() {
    let { appCardsData, appData } = this.props;
    return (
      <div style={styles.root}>
        {this.rendSystemCards()}
        <div
          style={{
            margin: "0rem 0rem 0rem 1rem",
            fontSize: "19px",
            fontWeight: "700"
          }}
        >
          应用信息
        </div>
        <div style={{ display: "flex", flexWrap: "wrap" }}>
          {/* {appData.map(item => <AppTpsChart key={item.appId} appData={item} />)} */}
        </div>
      </div>
    );
  }
}
export default muiThemeable()(Home);
