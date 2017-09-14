

// require('echarts/lib/chart/bar');
import Immutable from 'immutable'
require('echarts/lib/chart/gauge');

require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
require('echarts/lib/component/toolbox');
require('echarts/lib/component/markLine');
require('echarts/lib/component/markPoint');

var echarts = require('echarts/lib/echarts');

const defaultOption = Immutable.fromJS({
  tooltip: {
    formatter: "{a} 占 {c}%"
  },
  // toolbox: {
  //   feature: {
  //     restore: {},
  //     saveAsImage: {}
  //   }
  // },
  title: { text: '' },
  series: [
    {
      name: '',
      type: 'gauge',
      detail: { formatter: '{value}%' },
      data: [{ value: 50, name: '-' }]
    }
  ]
});

export default class myChart {
  constructor(dom, title) {
    this._myChart = echarts.init(dom);
    this.option = defaultOption.setIn(['series', '0', 'name'], title)
      .setIn(['title', 'text'], title)
    this._myChart.setOption(this.option.toJS());
    this._myChart.showLoading()
  }

  resizeChart() {
    this._myChart.resize();
  }

  drawChart(data) {
    this.option = this.option.setIn(['series', '0'],
      Immutable.fromJS({
        name: '已使用：' + data.used,
        data: [{
          name: '',
          value: data.percentage
        }]
      }))
    this._myChart.setOption(this.option.toJS())
    this._myChart.hideLoading()
  }
}