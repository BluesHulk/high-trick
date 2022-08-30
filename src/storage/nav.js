import { Store } from '@silen/store';

const TopNavKey = 'TOP_NAV_ID';

export function getTopNav() {
  return parseInt(JSON.parse(Store.get(TopNavKey)), 10);
}

export function setTopNav(id) {
  Store.set(TopNavKey, id);
}

export function removeTopNav() {
  return Store.remove(TopNavKey);
}

// 子菜单序号
const SubNavKey = 'SUB_NAV_ID';

export function getSubNav() {
  return parseInt(JSON.parse(Store.get(SubNavKey)), 10);
}

export function setSubNav(id) {
  Store.set(SubNavKey, id);
}

export function removeSubNav() {
  return Store.remove(SubNavKey);
}
