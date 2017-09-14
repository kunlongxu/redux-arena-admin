
import React from 'react'
import ReactDOM from 'react-dom'

const spanStyle = {
  fontFamily: 'Consolas, "Courier New", monospace,"Microsoft YaHei"',
}

function strSplit(text, limitNum, startNo, offset) {
  let str = (text + '');
  let graphLen = offset;
  let i = startNo;
  for (; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      if (graphLen + 1 > limitNum) break;
      graphLen += 1;
      if (charCode === 10) {
        return {
          substr: str.substr(startNo, i - startNo),
          nextStartNum: i + 1 < str.length ? i + 1 : 0,
          limitNum: 0
        }
      }
    } else {
      if (graphLen + 2 > limitNum) break;
      graphLen += 2;
    }
  }
  return {
    substr: str.substr(startNo, i - startNo),
    nextStartNum: i < str.length ? i : 0,
    limitNum: limitNum - graphLen
  }
}

function strBackwardSplit(text, limitNum, endNo) {
  let str = (text + '');
  let graphLen = 0;
  let i = endNo < 0 ? str.length - 1 : endNo;
  let isFirstCRLF = true;
  for (; i > -1; i--) {
    let charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      if (graphLen + 1 > limitNum) break;
      graphLen += 1;
      if (charCode === 10) {
        if (isFirstCRLF) {
          isFirstCRLF = false;
        } else {
          return {
            substr: str.substr(i, endNo),
            nextEndNum: i > -1 ? i : -1,
            limitNum: 0
          }
        }
      }
    } else {
      if (graphLen + 2 > limitNum) break;
      graphLen += 2;
    }
  }
  return {
    substr: str.substring(i, endNo),
    nextEndNum: i > -1 ? i : -1,
    limitNum: limitNum - graphLen
  }
}

export class LogScroller {
  constructor(cachedData, pointer, pageColNum, detailTags, defaultTextColor) {
    this.cachedData = cachedData;
    this.pointer = pointer;
    this.pageColNum = pageColNum;
    this.detailTags = detailTags;
    this.defaultTextColor = defaultTextColor;
  }

  setPointer(newPointer) {
    this.pointer = newPointer;
  }

  getPointer() {
    return this.pointer;
  }

  setPageColNum(pageColNum) {
    this.pageColNum = pageColNum;
  }

  setCachedData(cachedData) {
    this.cachedData = cachedData;
  }

  setDetailTags(detailTags) {
    this.detailTags = detailTags;
  }

  lineBackward() {
    let {index, row, tagCur, strCur, ignoreHeadTag} = this.pointer;
    let logData = this.cachedData[index];
    let lastTagItem = this.detailTags[tagCur];
    if (row < 1 || lastTagItem == null || (logData[lastTagItem.tag] + '').length < strCur) {
      let pointer = { index: index -= 1, row: 0, tagCur: 0, strCur: 0, ignoreHeadTag: false };
      if (index < 0) {
        pointer.index = 0;
        this.setPointer(pointer);
        return;
      }
      this.setPointer(pointer);
      let newPointer = this.pointer;
      while (pointer.index === newPointer.index) {
        pointer = newPointer;
        newPointer = this.lineForward();
      }
      this.setPointer(pointer);
      return;
    } else {
      this.setPointer({ index: index, row: 0, tagCur: 0, strCur: 0, ignoreHeadTag: false });
      let newPointer = this.pointer;
      while (row - 1 !== newPointer.row) {
        newPointer = this.lineForward();
      }
      this.setPointer(newPointer);
    }
    return;
  }

  lineForward() {
    let {index, row, tagCur, strCur, ignoreHeadTag} = this.pointer;
    if (index > this.cachedData.length - 1) return;
    let logData = this.cachedData[index];
    let spanArray = [];
    if (tagCur == null || this.detailTags[tagCur] == null) {
      row = 0, tagCur = 0, strCur = 0, ignoreHeadTag = false;
    }
    let limitNum = this.pageColNum;
    for (let tagIndex = tagCur; tagIndex < this.detailTags.length; tagIndex++) {
      let tagItem = this.detailTags[tagIndex];
      let strObj = strSplit(logData[tagItem.tag], limitNum, strCur, strCur > 0 || tagIndex === 0 || ignoreHeadTag ? 0 : 1);
      this.pointer.ignoreHeadTag = false;
      strCur = strObj.nextStartNum;
      limitNum = strObj.limitNum;
      if (limitNum < 2) {
        if (limitNum > 0 && strCur === 0) ignoreHeadTag = true;
        this.pointer.row += 1;
        this.pointer.strCur = strCur;
        this.pointer.tagCur = tagIndex;
        limitNum = this.pageColNum;
        if (strCur === 0) {
          //jump to next tag start
          if (tagIndex === this.detailTags.length - 1) {
            continue;
          } else {
            this.pointer.tagCur += 1;
            this.pointer.strCur = 0;
            return Object.assign({}, this.pointer);
          }
        }
        return Object.assign({}, this.pointer);
      }
    }
    if (index + 1 > this.cachedData.length) return;
    this.pointer = { index: index + 1, row: 0, tagCur: 0, strCur: 0, ignoreHeadTag: false };
    return Object.assign({}, this.pointer);
  }

  lineForOrBack(count) {
    if (count > 0) {
      for (let i = 0; i < count; i++) { this.lineForward() };
    }
    if (count < 0) {
      for (let i = count; i < 0; i++) { this.lineBackward() };
    }
  }

  rendLines(count) {
    let compArray = [];
    let {index, row, tagCur, strCur, ignoreHeadTag} = this.pointer;
    for (let line = 0; line < count && index < this.cachedData.length;) {
      let logData = this.cachedData[index];
      let spanArray = [];
      if (tagCur == null || this.detailTags[tagCur] == null) {
        row = 0, tagCur = 0, strCur = 0, ignoreHeadTag = false;
      }
      let limitNum = this.pageColNum;
      for (let tagIndex = tagCur; tagIndex < this.detailTags.length; tagIndex++) {
        let rowFinished = false;
        do {
          let tagItem = this.detailTags[tagIndex];
          let strObj = strSplit(logData[tagItem.tag], limitNum, strCur, strCur > 0 || tagIndex === 0 || ignoreHeadTag ? 0 : 1);
          limitNum = strObj.limitNum;
          if (strObj.nextStartNum === 0) {
            rowFinished = true;
          }
          spanArray.push(<span key={`${logData.timestamp}${logData.machine}${logData.application}${logData.sequence}${row}${tagItem.tag}`} title={tagItem.tag}
            style={Object.assign(spanStyle, { color: tagItem.color || this.defaultTextColor })}>{strCur > 0 || tagIndex === 0 || ignoreHeadTag ? strObj.substr : '|' + strObj.substr}</span>);
          ignoreHeadTag = false;
          strCur = strObj.nextStartNum;
          if (limitNum < 2) {
            if (limitNum > 0 && strCur === 0) {
              spanArray.push(<span key={`${logData.timestamp}${logData.machine}${logData.application}${logData.sequence}${row}${tagItem.tag}endTag`} title={tagItem.tag}
                style={Object.assign(spanStyle, { color: tagItem.color || this.defaultTextColor })}>|</span>);
              ignoreHeadTag = true;
            }
            limitNum = this.pageColNum;
            compArray.push(this.lineWrapper(logData.sequence, row, spanArray, false));
            spanArray = [];
            row++;
            if (rowFinished) {
              line++;
            }
            if (line >= count) return compArray;
          }
        } while (!rowFinished)
      }
      compArray.push(this.lineWrapper(`${logData.timestamp}${logData.machine}${logData.application}${logData.sequence}`, row, spanArray, true));
      spanArray = [];
      index++;
      // line++;
      row = 0, tagCur = 0, ignoreHeadTag = false;
    }
    return compArray;
  }

  lineWrapper(id, row, spanArray, lastFlag) {
    return <div key={`${id}${row}`} style={{
      borderBottom: '1px',
      borderBottomColor: lastFlag ? 'gray' : 'transparent', borderBottomStyle: 'dashed', padding: '0 16px 0 16px'
    }}>
      {spanArray}
    </div>;
  }
}