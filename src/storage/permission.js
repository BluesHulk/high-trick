import { Store } from '@silen/store';

const ModulesKey = 'MODULES';

export function getModules() {
  return JSON.parse(Store.get(ModulesKey));
}

export function setModules(modules) {
  Store.set(ModulesKey, modules);
}

export function removeModules() {
  return Store.clear(ModulesKey);
}

// 按钮
const ButtonsKey = 'BUTTONS';

export function getButtons() {
  return JSON.parse(Store.get(ButtonsKey));
}

export function setButtons(buttons) {
  Store.set(ButtonsKey, buttons);
}

export function removeButtons() {
  return Store.clear(ButtonsKey);
}

// 菜单
const MenusKey = 'MENUS';

export function getMenus() {
  return JSON.parse(Store.get(MenusKey));
}

export function setMenus(menus) {
  Store.set(MenusKey, menus);
}

export function removeMenus() {
  return Store.clear(MenusKey);
}
