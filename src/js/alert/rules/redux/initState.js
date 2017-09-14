import Immutable from 'immutable'
import {
  defaultRuleData, ruleObjToPanelData,
  defaultAlertData, alertObjToPanelData
} from './actions'

export default {
  pageNumText: 1,
  instancesData: [],
  doingSubmit: false,
  queryData: Immutable.fromJS({
    currentPageIdx: 0,
    queryCondition: {},
    sortCondition: {},
    perPageSize: 1000,
    totalPageCount: 1
  }),
  defaultAppName: '',
  stepIndex: 0,
  searchStr: '',
  alertData: Immutable.fromJS(alertObjToPanelData(defaultAlertData)),
  ruleData: Immutable.fromJS(ruleObjToPanelData(defaultRuleData)),
  appId: null,
  appData: [],
  rulePanelOpenFlag: false,
}