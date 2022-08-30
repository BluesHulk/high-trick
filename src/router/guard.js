import ALoading from '../classes/ALoading';
import ActionType from '../constants/ActionType';
import router from '@/router';
import { setTitle } from '@/utils/title';
import store from '@/store';

import { setIco } from '@/utils/fav';
import { setTopNav } from '@/storage/nav';
import { getToken } from '@/storage/auth';

router.beforeEach((to, from, next) => {
  ALoading.show({ text: '' });
  if (getToken()) {
    setTitle(to);
    setIco(to);
    if (to.path === '/login') {
      next('/');
    } else {
      next();
    }
  } else {
    store.dispatch('SetGlobalActionType', ActionType.views);
    next();
  }
});

router.afterEach((to, from) => {
  refreshRoutes(to, from);
  ALoading.close();
});

function refreshRoutes(to, from) {
  // 根据当前的路由前缀获取topNav
  const modules = store.getters.modules;
  const p = '/' + (to.path || '').split('/').filter(Boolean)[0];
  const m = modules.find(ii => ii.path === p);
  if (m) {
    const menus = store.state.menus;
    const routes = menus.filter(value => value.parentId === m.id);
    store.dispatch('RefreshTopRoutes', { type: 'TOP_ROUTES', routes });
    const tag = menus.find(i => i.path === to.path);
    setTopNav(tag.parentId);
    store.dispatch('SetSubId', tag.id);
    const subs = menus.filter(value => value.parentId === tag.parentId);
    store.dispatch('RefreshTopRoutes', { type: 'SUB_ROUTES', routes: subs });
  }
}
