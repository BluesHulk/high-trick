import { getToken } from '@/storage/auth';
import { Message } from 'element-ui';

const isDev = process.env.NODE_ENV === 'development';
const devDomain = '192.168.30.17';
const devPort = 19101;

export default {
  state: {
    wsMaintainInstance: null, // ws实例
    WsMaintain: {}
  },
  mutations: {},
  actions: {
    initWsMaintain({ state }, { host, port }) {
      if (state.wsMaintainInstance) {
        console.log(`已经实例化`, state.wsMaintainInstance);
        return;
      }
      const domain = isDev ? devDomain : host;
      const _port = isDev ? devPort : port || devPort;
      const url = `ws://` + (isDev ? domain : window.top.location.hostname);
      const access_token = getToken();
      if (!access_token) return;
      const Authorization = access_token.Authorization;
      if (!Authorization) return;
      const wd = access_token[Authorization];
      if (!wd) return;
      const { userInfo } = wd;
      if (!userInfo) return;
      // const { staffId } = userInfo;
      if ('WebSocket' in window) {
        // state.wsMaintainInstance = new WebSocket(url + `:${_port}/maintenance/order/notice`+ staffId);
        state.wsMaintainInstance = new WebSocket(url + `:${_port}/ws/maintenance/order/notice`);
        state.wsMaintainInstance.onmessage = event => {
          const data = event.data;
          if (!data) return;
          if (data === '连接成功') {
            state.WsMaintain = data;
          } else {
            state.WsMaintain = JSON.parse(data);
          }
        };
      } else {
        Message.error('当前浏览器不支持');
      }
    }
  }
};
