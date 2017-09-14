import Immutable from 'immutable'

export default {
  instancesData: [],
  queryData: Immutable.fromJS({
    "currentPageIdx": 0,
    perPageSize: 20,
    'totalPageCount': 1,
    queryCondition: {
      src:'tape',
    },
    sortCondition: {
      createTime: -1
    }
  }),
  isLoading: false,
  pageNumText: '1',
  selectedApp: null,
  appData: []
}