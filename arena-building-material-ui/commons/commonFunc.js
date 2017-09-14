import {
  PAGE_UPDATE_REFRESH,
  FRAME_UPDATE_REFRESH
} from "../redux/actionTypes";
import base64 from "./base64";

export function toHex(str) {
  // var hex, i;
  // var result = "";
  // for (i = 0; i < str.length; i++) {
  //   hex = str.charCodeAt(i).toString(16);
  //   result += ("000" + hex).slice(-4);
  // }
  console.log(
    btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode("0x" + p1);
      })
    )
  );
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode("0x" + p1);
    })
  );
}

export function fromHex(str) {
  // var j;
  // var hexes = str.match(/.{1,4}/g) || [];
  // var back = "";
  // for (j = 0; j < hexes.length; j++) {
  //   back += String.fromCharCode(parseInt(hexes[j], 16));
  // }
  return decodeURIComponent(escape(atob(str)));
}

export function cutStr(str, maxNum, tail = "...") {
  let gapNum = str.length - maxNum;
  if (gapNum < 1) return str;
  return str.substr(0, maxNum - tail.length) + "...";
}

export function applyDataFilter(value, filterFunc, listName, backupName) {
  return (dispatch, getState) => {
    let pageState = getState().page;
    if (value === "" && pageState[backupName] != null) {
      pageState[listName] = pageState[backupName];
      pageState[backupName] = null;
    } else {
      if (pageState[backupName] == null)
        pageState[backupName] = pageState[listName];
      pageState[listName] = filterFunc(value, pageState[backupName]);
    }
    dispatch({
      type: PAGE_UPDATE_REFRESH,
      state: pageState
    });
  };
}

export function toTimeStr(msNumber, zeroStr) {
  if (msNumber === 0) return zeroStr;
  let str = "";
  let prevNum = msNumber;
  let curNum = Math.floor(msNumber / 1000);
  let modNum = Math.floor(msNumber % 1000);
  if (modNum !== 0) str += modNum + "毫秒";
  if (curNum === 0) return str;
  modNum = Math.floor(curNum % 60);
  curNum = Math.floor(curNum / 60);
  str = modNum + "秒" + str;
  if (curNum === 0) return str;
  modNum = Math.floor(curNum % 60);
  curNum = Math.floor(curNum / 60);
  str = modNum + "分" + str;
  if (curNum === 0) return str;
  modNum = Math.floor(curNum % 60);
  curNum = Math.floor(curNum / 60);
  str = modNum + "时" + str;
  return str;
}

export function formatTime(time, format) {
  var o = {
    "M+": time.getMonth() + 1, //month
    "d+": time.getDate(), //day
    "h+": time.getHours(), //hour
    "m+": time.getMinutes(), //minute
    "s+": time.getSeconds(), //second
    "q+": Math.floor((time.getMonth() + 3) / 3), //quarter
    S: time.getMilliseconds() //millisecond
  };
  if (/(y+)/.test(format))
    format = format.replace(
      RegExp.$1,
      (time.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  for (var k in o)
    if (new RegExp("(" + k + ")").test(format))
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
  return format;
}

export function formatNum(num) {
  if (typeof num !== "number") return false; //判断是否是数字
  num = num.toString(); //字符化
  var s = num.match(/e\+(\d+)$/),
    ext = 0;
  num = num.replace(/e.+$/, "");
  if (s) ext = Number(s[1]);

  //分割小数点两边
  var tA = num.split(".");
  if (tA.length >= 2 && ext) {
    //有小数点则分割开来处理(小数点后面可能还跟有科学记数法表示)
    if (tA.length > ext) {
      tA[0] += tA[1].slice(0, ext - 1);
      tA[1] = tA[1].slice(ext - 1, tA[1].length - 1);
    } else {
      tA[0] += tA[1] + "0".repeat(ext - tA.length);
      tA[1] = "";
    }
  }

  tA[0] = tA[0].split(""); //拆字符
  for (var i = tA[0].length; (i -= 3) > 0; ) {
    //插逗号
    tA[0].splice(i, 0, ",");
  }
  return tA[0].join("") + (tA[1] ? "." + tA[1] : ""); //连起来
}
