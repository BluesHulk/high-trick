import { getModules } from '@/storage/permission';

export function setTitle(route = {}) {
  const modules = getModules();
  let title = '';
  if (modules) {
    let path = route.path;
    path = path.substring(0, path.indexOf('/', 1));
    const item = modules.find(i => i.path === path);
    if (item) title = item.name;
  }
  document.title = title || route.name;
}
