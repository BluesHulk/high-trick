import { getUserInfo } from '@/storage/auth';

export function mergeData(data, key) {
  const userInfo = getUserInfo();
  const { staffId } = userInfo;
  if (!staffId) throw new Error(`不存在staffId`);
  data[key] = staffId;
}

export function getStyle(el, style) {
  return getComputedStyle ? getComputedStyle(el, null).getPropertyValue(style) : el.currentStyle[style];
}

export function setStyle(el, styles = {}) {
  for (const p in styles) {
    el.style[p] = styles[p];
  }
}

export function throttle(fn, wait) {
  let canRun = true;
  return function() {
    if (!canRun) return;
    canRun = false;
    setTimeout(() => {
      fn.apply(this, arguments);
      canRun = true;
    }, wait);
  };
}

export function postDownLoadExe(data, fileName) {
  var blob = new Blob([data], { type: 'application/x-msdownload;charset=utf-8' });
  var downloadElement = document.createElement('a');
  var href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = `${fileName}.exe`;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
}

export function downloadExcel(data, filename) {
  const blob = new Blob([data], { type: 'application/vnd.ms-excel;charset=utf-8' });
  const downloadElement = document.createElement('a');
  const href = window.URL.createObjectURL(blob);
  downloadElement.href = href;
  downloadElement.download = `${filename}.xlsx`;
  document.body.appendChild(downloadElement);
  downloadElement.click();
  document.body.removeChild(downloadElement);
  window.URL.revokeObjectURL(href);
}

/** 深拷贝*/
export const clone = function(obj) {
  let copy;
  if (obj === null || typeof obj !== 'object') {
    // Handle the 3 simple types, and null or undefined
    return obj;
  } else if (obj instanceof Date) {
    // Handle Date
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  } else if (obj instanceof Array) {
    // Handle Array
    copy = [];
    for (let i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  } else if (obj instanceof Object) {
    // Handle Object
    copy = {};
    for (const attr in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = clone(obj[attr]);
      }
    }
    return copy;
  } else {
    return copy;
  }
};
export function uniqueArray(arr) {
  if (!Array.isArray(arr)) throw new Error(`参数应该为数组类型`);
  const o = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    o[item.id] = item;
  }
  return Object.values(o);
}

export function uniqueArrayCode(arr) {
  if (!Array.isArray(arr)) throw new Error(`参数应该为数组类型`);
  const o = {};
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    o[item.id] = item;
  }
  return Object.values(o);
}
