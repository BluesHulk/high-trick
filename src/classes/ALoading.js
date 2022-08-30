import { Loading } from 'element-ui';

let instance;
const defaultOptions = {
  lock: true,
  text: null,
  spinner: 'el-icon-loading',
  background: 'rgba(0, 0, 0, 0)',
  customClass: 'global-loading'
};

export default class ALoading {
  static show(options) {
    options = { ...defaultOptions, ...options };
    if (instance) return instance;
    instance = Loading.service(options);
    return instance;
  }

  static close() {
    instance && instance.close();
    instance = null;
  }
}
