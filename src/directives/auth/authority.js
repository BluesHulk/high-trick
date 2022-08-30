import { getButtons } from '@/storage/permission';

function check(el, binding) {
  const buttons = getButtons();
  if (!buttons) throw new Error(`没有菜单权限`);
  const { value } = binding;
  const has = buttons.find(it => (value || []).includes(it.path));
  if (!has) {
    el.parentNode && el.parentNode.removeChild(el);
  }
}

export default {
  inserted(el, binding) {
    check(el, binding);
  },
  update(el, binding) {
    check(el, binding);
  }
};
