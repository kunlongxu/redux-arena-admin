
import { cloneElement } from 'react';
import immutablediff from 'immutablediff'

let _product = null;
let _defaultLooseBindComNames = [];
let _actionFunc = null;
let _formData = null;

function initTempParams(actionFunc, formData) {
  _product = null;
  _defaultLooseBindComNames = new Set([]);
  _actionFunc = actionFunc;
  _formData = formData
}

function processTemplateArray(templateArray, _keyHistory) {
  let newChildren = templateArray.map((item, index) => {
    return processTemplate(item, _keyHistory + index)
  });
  for (let i = 0; i < newChildren.length; i++) {
    if (newChildren[i] && newChildren[i].key && (newChildren[i].key.indexOf('*') === 0 || newChildren[i].key.indexOf('[[TWBF]]') === 0)) {
      return newChildren;
    }
  }
  return templateArray
}

function processTemplate(template, _keyHistory) {
  if (template == null) return template;
  let genTemplate = template;
  if (template.props == null) {
    if (template._tail && template._tail.array instanceof Array) {
      let newArray = processTemplateArray(template._tail.array, 0)
      if (template._tail.array !== newArray) {
        genTemplate._tail.array = newArray;
      }
    }
    return genTemplate;
  }
  if (template.props && template.props.children instanceof Array) {
    let newArray = processTemplateArray(template.props.children, 0)
    if (template.props.children !== newArray) {
      let key = template.key;
      if (key == null) {
        key = _keyHistory;
      }
      genTemplate = cloneElement(template, {
        key: '[[TWBF]]' + key,
        children: newArray
      })
    }
  }
  if (template.props && (!(template.props.children instanceof Array))) {
    let newChildren = processTemplate(template.props.children, _keyHistory);
    if (newChildren && newChildren.key && newChildren.key.indexOf('[[TWBF]]') === 0) {
      let key = template.key;
      if (key == null) {
        key = _keyHistory;
      }
      genTemplate = cloneElement(template, {
        key: '[[TWBF]]' + key,
        children: newChildren
      })
    }
  }
  let newTemplate = genTemplate;
  let tName = genTemplate.props.name;
  let bindType = null;
  if (tName && tName.indexOf('*') === 0) {
    bindType = tName.substring(tName.indexOf('@') + 1, tName.length);
    let fieldName = tName.substring(0, tName.indexOf('@'));
    let fieldNameArray = tName.substring(1, tName.indexOf('@')).split('.');
    let key = _keyHistory;
    switch (bindType) {
      case 'TextField':
        newTemplate = cloneElement(genTemplate, {
          key: tName + key,
          onChange: (e, value) => { _actionFunc(fieldNameArray, value) },
          defaultValue: _formData.getIn(fieldNameArray) || ''
        });
        _defaultLooseBindComNames.add(fieldName.replace(/(\.|\*)/g, '/'))
        break;
      case 'RadioButtonGroup':
        newTemplate = cloneElement(genTemplate, {
          key: tName + key,
          onChange: (e, value) => { _actionFunc(fieldNameArray, value) },
          valueSelected: _formData.getIn(fieldNameArray) || ''
        });
        break;
      case 'DropDownMenu':
        newTemplate = cloneElement(genTemplate, {
          key: tName + key,
          onChange: (e, i, payload) => { _actionFunc(fieldNameArray, payload) },
          value: _formData.getIn(fieldNameArray) || ''
        });
      default:
    }
  }
  return newTemplate
}

export function bindRedux(template, actionFunc, formData) {
  initTempParams(actionFunc, formData)
  _product = processTemplate(template);
  return { product: _product, textNames: Array.from(_defaultLooseBindComNames) }
}

export function templateShouldUpdate(diffData, defaultLooseBindComNames, additinalCheck) {
  let flag = true;
  for (let i = 0; i < diffData.size; i++) {
    for (let j = 0; j < defaultLooseBindComNames.length; j++) {
      let checkItem = diffData.get(i).get('path');
      if (checkItem===defaultLooseBindComNames[j]) {
        if (additinalCheck) {
          if (!additinalCheck(checkItem)) {
            flag = false;
            break;
          }
        } else {
          flag = false;
          break;
        }
      }
    }
    if (flag === false) break;
  }
  return flag
}