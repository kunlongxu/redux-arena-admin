import { PAGE_UPDATE_REFRESH, PAGE_UPDATE_NOREFRESH } from 'barcsys-dashboard/redux/actionTypes.js'
import { gGet, gDel, gPost, gPut } from 'barcsys-dashboard/commons/httpFunc'
import { showMessage } from 'barcsys-dashboard/commons/commonFunc'
import { platformService, tapeService } from 'appconfig/apiUrl'
import Immutable from 'immutable';

export const defaultFormData = Immutable.fromJS({
  description: '',
  app: '',
  target: '',
  title: '',
  operator: '0',
  regExpression: '',
  createdBy: '',
  createdWhen: null,
  converter: {
    fieldType: '2',
    format: ''
  },
  isDisabled: 'false'
})

function transform(obj) {
  obj.operator = parseInt(obj.operator);
  obj.converter.fieldType = parseInt(obj.converter.fieldType);
  obj.isDisabled = obj.isDisabled === 'true';
  return obj;
}

export function handleAddForm(flag, data) {
  if (flag === true) {
    return (dispatch, getState) => {
      let formData = defaultFormData.set('app', getState().page.selectedApp);
      if (data != null) {
        formData = Immutable.fromJS(data).set('operator', String(data.operator))
          .set('isDisabled', String(data.isDisabled))
          .setIn(['converter', 'fieldType'], String(data.converter.fieldType))
      }
      dispatch({
        type: PAGE_UPDATE_REFRESH,
        state: {
          addFormOpenFlag: true,
          formData,
          editFlag: formData.get('_id') != null
        }
      })
    }
  } else {
    return {
      type: PAGE_UPDATE_REFRESH,
      state: {
        addFormOpenFlag: false,
        formData: defaultFormData,
        editFlag: false
      }
    }
  }
}

export function loadAppData(selectedApp) {
  return (dispatch, getState) => {
    let { appId } = getState().page
    gGet(platformService.appinfo + '/guardian').then((data) => {
      dispatch({
        type: PAGE_UPDATE_REFRESH,
        state: { appData: data }
      });
      if (selectedApp != null) return selectedApp
      let _id = data[0] && data[0]._id
      if (_id) dispatch({ type: PAGE_UPDATE_REFRESH, state: { defaultAppName: data[0].name } })
      return _id
    }).then(data => {

      appId = getState().page.appId;
      dispatch(changeAppId(appId || data))
    })
  }
}

export function setAppId(appId) {
  return dispatch => {
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: {
        appId
      }
    })
    dispatch(loadAppData(appId))
  }
}

export function dispatchFormData(fieldNameArray, value) {
  return (dispatch, getState) => {
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: { formData: getState().page.formData.setIn(fieldNameArray, value) }
    })
  }
}

export function changeAppId(appId) {
  return (dispatch, getState) => {
    gGet(tapeService.extractor + '/appId/' + appId).then((data) => {
      dispatch({
        type: PAGE_UPDATE_REFRESH,
        state: { selectedApp: appId, instancesData: data }
      });
    })
  }
}

export function addRule() {
  return (dispatch, getState) => {
    let { formData, selectedApp } = getState().page;
    gPut(tapeService.extractor + '/add',
      transform(formData.set('app', selectedApp).toJS()))
      .then((data) => {
        dispatch(changeAppId(getState().page.selectedApp));
        data && dispatch(showMessage(`新增规则【${formData.get('title')}】成功`));
      })
  }
}

export function updateRule(ruleFormData) {
  return (dispatch, getState) => {
    let { formData, selectedApp } = getState().page;
    gPut(tapeService.extractor + '/update',
      transform(formData.toJS())).then((data) => {
        dispatch(changeAppId(getState().page.selectedApp));
        data && dispatch(showMessage(`更新规则【${formData.get('title')}】成功`));
      })
  }
}

export function switchEnable(obj) {
  return (dispatch, getState) => {
    gPut(tapeService.extractor + '/update',
      obj).then((data) => {
        dispatch(changeAppId(getState().page.selectedApp));
        data && dispatch(showMessage(`规则【${formData.get('title')}】`) + data.isDisabled ? '已禁用' : '已启用');
      })
  }
}

export function deleteRule(selectedRule) {
  return (dispatch, getState) => {
    if (selectedRule == null || selectedRule._id == null) {
      dispatch({
        type: PAGE_UPDATE_REFRESH,
        state: { selectedRule: null }
      })
    } else {
      gDel(tapeService.extractor + '/delete', selectedRule).then((data) => {
        dispatch(changeAppId(getState().page.selectedApp));
        data && dispatch(showMessage(`删除规则【${selectedRule.title}】成功`));
      })
    }
  }
}

export function changeTestStr(value) {
  return {
    type: PAGE_UPDATE_REFRESH,
    state: {
      testStr: value
    }
  }
}

export function testSingleRule(value) {
  return (dispatch, getState) => {
    let { formData } = getState().page;
    let query = {
      content: value,
      regExpress: formData.get('regExpression'),
      converter: formData.get('converter')
    }
    gPost(tapeService.extractor + '/check', query).then(data => {
      dispatch({
        type: PAGE_UPDATE_REFRESH,
        state: {
          testResult: [{ title: rule.title, target: rule.target, value: data.test }]
        }
      })
    })
  }
}

export function handleCloseResult() {
  return {
    type: PAGE_UPDATE_REFRESH,
    state: {
      pumpResultOpenFlag: false
    }
  }
}

export function testAllRules() {
  return (dispatch, getState) => {
    let query = {
      content: getState().page.testStr,
      app: getState().page.selectedApp
    }
    gPost(tapeService.extractor + '/checkAll', query).then(data => {
      let testResult = data.map(item => {
        return { title: item.title, target: item.target, value: item.value }
      })
      dispatch({
        type: PAGE_UPDATE_REFRESH,
        state: {
          testResult: testResult,
          pumpResultOpenFlag: true
        }
      })
    })
  }
}

export function changeFormData(fieldName, value) {
  return (dispatch, getState) => {
    let { formData } = getState().page;
    let newFormData = {};
    if (fieldName === 'converter.format') {
      let converter = {}
      converter.format = value;
      converter.fieldType = formData.converter.fieldType;
      newFormData.converter = converter;
    } else if (fieldName === 'converter.fieldType') {
      let converter = {}
      converter.format = formData.converter.format;
      converter.fieldType = parseInt(value);
      newFormData.converter = converter;
    } else if (fieldName === 'isDisabled') {
      newFormData[fieldName] = value === 'true';
    } else if (fieldName === 'operator') {
      newFormData[fieldName] = parseInt(value);
    } else {
      newFormData[fieldName] = value;
    }
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: {
        formData: Object.assign({}, formData, newFormData)
      }
    })
  }
}