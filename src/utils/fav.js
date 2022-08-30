import { getModules } from '@/storage/permission';

export function setIco(route = {}) {
  const modules = getModules();
  if (modules) {
    let path = route.path;
    path = path.substring(0, path.indexOf('/', 1));
    const item = modules.find(i => i.path === path);
    if (item) {
      const url = window.top.location.origin + '/fav' + path + '.png';
      const pageIco = document.getElementById('page-ico');
      pageIco.setAttribute('href', url);
    }
  }
}
