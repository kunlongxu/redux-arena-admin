import moment from "moment";
import Immutable from "immutable";
moment.locale("zh-CN");

export default {
  logsData: {
    took: 141,
    total: 0,
    messages: []
  },
  defaultAppName: "",
  downloadQueryData: null,
  queryData: Immutable.fromJS({
    fromTimeFilter: moment().add(-12, "h").format("YYYY-MM-DD HH:mm:ss"),
    toTimeFilter: moment().format("YYYY-MM-DD HH:mm:ss"),
    contentFilter: "",
    isRecentFirst: true,
    offset: 0,
    limit: 50,
    additionalFilter: {}
  }),
  pageNumText: "1",
  fieldValue: "",
  fieldNames: [
    // { name: 'application', value: 'appFilter' },
    { name: "machine", value: "machineFilter" }
  ],
  detailContent: {},
  isDetailOpen: false,
  isLoading: false,
  appData: [],
  selectedApp: null,
  dropDwonFlag: false,
  searchedText: "",
  isFilterShow: true
};
