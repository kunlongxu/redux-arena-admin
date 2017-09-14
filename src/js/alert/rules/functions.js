
export function toTimeStr(msNumber) {
    if(isNaN(msNumber)) return
    if (msNumber === 0) return '立即';
    let str = '';
    let prevNum = msNumber;
    let curNum = Math.floor(msNumber / 1000);
    let modNum = Math.floor(msNumber % 1000);
    if (modNum !== 0) str += modNum + '毫秒';
    if (curNum === 0) return str;
    modNum = Math.floor(curNum % 60);
    curNum = Math.floor(curNum / 60);
    str = modNum + '秒' + str;
    if (curNum === 0) return str;
    modNum = Math.floor(curNum % 60);
    curNum = Math.floor(curNum / 60);
    str = modNum + '分' + str;
    if (curNum === 0) return str;
    modNum = Math.floor(curNum % 60);
    curNum = Math.floor(curNum / 60);
    str = modNum + '时' + str;
    return str;
  }