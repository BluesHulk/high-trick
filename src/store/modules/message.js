import { getToken } from '@/storage/auth';
import { Message } from 'element-ui';
import { unreadCount } from '@/api/message';

const isDev = process.env.NODE_ENV === 'development';
const devDomain = '192.168.30.17';
const devPort = 19107;

export default {
  state: {
    wsMsg: null, // ws消息实例
    WsMessage: {},
    messageCount: 0
  },
  mutations: {
    REFRESH_MESSAGE_COUNT(state, count) {
      state.messageCount = count;
    }
  },
  actions: {
    initWsMessage({ state }, { host, port }) {
      if (state.wsMsg) {
        console.log(`已经实例化`, state.wsMsg);
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
      const { staffId } = userInfo;
      if ('WebSocket' in window) {
        state.wsMsg = new WebSocket(url + `:${_port}/ws/message/center/notice/` + staffId);
        state.wsMsg.onmessage = event => {
          const data = event.data;
          if (!data) return;
          state.WsMessage = JSON.parse(data);
        };
      } else {
        Message.error('当前浏览器不支持');
      }
    },
    RefreshMessageCount({ commit }) {
      return new Promise(resolve => {
        const access_token = getToken();
        if (!access_token) return;
        const Authorization = access_token.Authorization;
        if (!Authorization) return;
        const wd = access_token[Authorization];
        if (!wd) return;
        const { userInfo } = wd;
        if (!userInfo) return;
        const { staffId } = userInfo;
        unreadCount(staffId).then(res => {
          const { code, object } = res;
          if (code === 200) {
            commit('REFRESH_MESSAGE_COUNT', object);
            resolve(object);
          }
        });
      });
    }
  }
};
