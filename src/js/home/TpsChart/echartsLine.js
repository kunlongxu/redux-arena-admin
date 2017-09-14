// require('echarts/lib/chart/bar');
require("echarts/lib/chart/line");

require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/toolbox");
require("echarts/lib/component/markLine");
require("echarts/lib/component/markPoint");
import moment from "moment";
var echarts = require("echarts/lib/echarts");

export default class myChart {
  constructor(dom, title) {
    this._myChart = echarts.init(dom);
    this.option = {
      title: { text: title },
      // toolbox: {
      //   show: true,
      //   feature: {
      //     dataView: { show: true, readOnly: false },
      //     magicType: { show: true, type: ['line', 'bar'] },
      //     restore: { show: true },
      //     saveAsImage: { show: true }
      //   }
      // },
      tooltip: {
        trigger: "axis",
        formatter: function(params) {
          params = params[0];
          return params.name + " : " + params.value[1];
        },
        axisPointer: {
          animation: false
        }
      },
      xAxis: {
        type: "time",
        splitLine: {
          show: false
        }
      },
      yAxis: [
        {
          type: "value",
          boundaryGap: [0, "100%"],
          splitLine: {
            show: false
          }
        }
      ],
      series: [
        {
          name: "日志条数/秒",
          type: "line",
          data: [],
          showSymbol: false,
          hoverAnimation: false,
          itemStyle: {
            normal: {
              color: "#66ccff"
            }
          },
          markPoint: {
            data: [
              {
                type: "max",
                name: "最大值",
                itemStyle: {
                  normal: {
                    color: "red"
                  }
                }
              },
              {
                type: "min",
                name: "最小值",
                itemStyle: {
                  normal: {
                    color: "green"
                  }
                }
              }
            ]
          },
          markLine: {
            data: [
              {
                type: "average",
                name: "平均值",
                itemStyle: {
                  normal: {
                    color: "orange"
                  }
                }
              }
            ]
          }
        }
      ]
    };
    this._myChart.setOption(this.option);
    // this._myChart.showLoading()
  }

  resizeChart() {
    this._myChart.resize();
  }

  drawChart(data) {
    let newData = data.map(item => {
      let dateObj = moment(item.date);
      return {
        name: dateObj.format("YYYY-MM-DD hh:mm:ss"),
        value: [dateObj.format("YYYY-MM-DD hh:mm:ss"), item.value]
      };
    });
    this.option["series"]["0"]["data"] = newData;
    this._myChart.setOption(this.option);
    this._myChart.hideLoading();
  }
}
