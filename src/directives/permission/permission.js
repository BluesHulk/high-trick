function checkPermission(el, binding, vnode) {
  const { value } = binding;
  if (!value) {
    throw new Error(`need button's type! Like v-permission="'add'"`);
  }
  const routePath = vnode.context.$route.path;
  const rolesMap = JSON.parse(window.localStorage.getItem('button'));
  const hasPermission = typeof rolesMap[`${routePath}/${value}`] !== 'undefined';
  if (!hasPermission) {
    el.remove();
  }
}
export default {
  inserted(el, binding, vnode) {
    checkPermission(el, binding, vnode);
  }
};
