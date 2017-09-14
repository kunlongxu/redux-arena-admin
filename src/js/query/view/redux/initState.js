const defaultConfig ={
  pageRowNum:40,
  skipRowNum:200,
  pageColNum:100,
  detailTags:[
    // {tag:'timestamp',color:'gray'},
    {tag:'line'},
    // {tag:'event',color:'Wheat'},
    // {tag:'application',color:'Teal'},
    // {tag:'machine',color:'Tomato'},
    // {tag:'voucherNo',color:'Thistle'},
    // {tag:'sequence',color:'Tan'}
  ]
}

export function initState() {
  return {
    cachedData: [],
    pointer: { index: 0, row: 0, tagCur: 0, strCur: 0 },
    pageRowNum: defaultConfig.pageRowNum,
    pageColNum: defaultConfig.pageColNum,
    loadingFlag: false,
    detailTags: defaultConfig.detailTags,
    skipRowNum: defaultConfig.skipRowNum,
    showPanelFlag: false,
    displayConfig: JSON.stringify(defaultConfig, null, "\t"),
    flipNum: 0,
    logScroller: null,
    fileInfo: {
      app: null,
      machine: null,
      sequence: null,
      timestamp:null
    }
  };
}