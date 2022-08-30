import { isObject } from '@silen/utils';
import PageType from '../constants/PageType';

// 将route的某些属性作为指定的名称输出
// getLocalRoute({ name: 1, path: 2, value: 3 }, { value: 'na' }) ==> {name: 1, value: 2, na: 3}
export function getLocalRoute(route, obj = {}) {
  const { name, path } = route;
  const res = {
    name,
    value: path
  };
  if (!isObject(obj)) {
    return res;
  }
  for (const p in obj) {
    const item = route[p];
    if (!item) continue;
    res[obj[p]] = item;
  }
  return res;
}

export function tripRoute(path) {
  return path.replace(/\/?(add|edit|update|views)*\/?$/i, '');
}

/**
 * 路由跳转
 * @param pageType { String } PageType
 * @param router { VueRouter } 路由
 * @param path { String } 页面地址
 * @param data { Object } 对象
 * @param keys { Array } 字段数组
 * @param before { Boolean } 跳转之前判断是否满足条件，true，则继续跳转，否则，不跳转
 * @param onSuccess { Function } 成功的回调
 * @param onError { Function } 失败的回调
 * @returns Promise
 */
// this.$$jum(PageType.add, this.$router, '/page', { a: 1, b: 2 }, ['a'])
export function jump(
  pageType,
  router,
  path = '',
  data = {},
  keys = [],
  before = true,
  onSuccess = () => {},
  onError = () => {}
) {
  return new Promise(resolve => {
    if (!Object.keys(PageType).includes(pageType)) return false;
    const bf = (typeof before === 'function' && before()) || before;
    if (!bf) return false;
    const paths = `${path}/${pageType}`;
    const url = generateUrlParams(paths, getProps(data, keys));
    router.push(
      url || paths,
      () => {
        typeof onSuccess === 'function' && onSuccess();
        resolve(true);
      },
      () => {
        typeof onError === 'function' && onError();
        resolve(false);
      }
    );
  });
}

export function generateUrlParams(url = '', params = {}, exitWhenEmpty = true) {
  const arr = [];
  for (const key in params) {
    if (params[key]) {
      arr.push(`${key}=${params[key]}`);
    } else {
      if (exitWhenEmpty) return '';
    }
  }
  url += '?' + arr.join('&');
  return url;
}

export function getProps(object = {}, keys = [], skipNull = false) {
  const data = {};
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (!object[key] && skipNull) continue;
    data[key] = object[key];
  }
  return data;
}
