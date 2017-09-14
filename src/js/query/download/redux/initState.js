export default {
  filesData: [],
  cnt: 0,
  pageNumText: '1',
  maxPageNum: 1,
  queryData: {
    currentPageIdx: 0,
    perPageSize: parseInt((window.innerHeight - 64 - 80) / 64) - 1,
    sortCondition: { createTime: -1 }
  },
}