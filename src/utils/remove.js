import { removeToken } from '@/storage/auth';
import { removeModules, removeButtons, removeMenus } from '@/storage/permission';
import { removeSubNav, removeTopNav } from '@/storage/nav';

export function remove() {
  removeToken();
  removeModules();
  removeButtons();
  removeMenus();
}

export function removeNavs() {
  removeTopNav();
  removeSubNav();
}
