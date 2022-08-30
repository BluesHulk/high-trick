import { getToken } from '@/storage/auth';
import { Message } from 'element-ui';

const isDev = process.env.NODE_ENV === 'development';
const devDomain = '192.168.30.16';
const devPort = 8762;

export default {
  state: {
    wsDevice: null, // 设备
    wsMonitor: null, // 监控
    DeviceMessage: null, // 设备消息
    MonitorMessage: null // 监控消息
  },
  mutations: {},
  actions: {
    initMonitorWs({ state }, { host, port }) {
      if (state.wsMonitor) {
        console.log(`已经实例化`, state.wsMonitor);
        return;
      }
      const domain = isDev ? devDomain : host;
      const _port = isDev ? devPort : port || devPort;
      const url = `ws://` + (isDev ? domain : window.top.location.hostname);
      const access_token = getToken();
      if (!access_token) return;
      const Authorization = access_token.Authorization;
      if (!Authorization) return;
      if ('WebSocket' in window) {
        state.wsMonitor = new WebSocket(url + `:${_port}/ener-monitor/ws/incident/` + Authorization);
        state.wsMonitor.onmessage = event => {
          const data = event.data;
          if (!data) return;
          state.MonitorMessage = JSON.parse(data);
        };
      } else {
        Message.error('当前浏览器不支持');
      }
    },
    initDeviceWs({ state }, { host, port }) {
      if (state.wsDevice) {
        console.log(`已经实例化`, state.wsDevice);
        return;
      }
      const domain = isDev ? devDomain : host;
      const _port = isDev ? devPort : port || devPort;
      const url = `ws://` + (isDev ? domain : window.top.location.hostname);
      const access_token = getToken();
      if (!access_token) return;
      const Authorization = access_token.Authorization;
      if (!Authorization) return;
      if ('WebSocket' in window) {
        state.wsDevice = new WebSocket(url + `:${_port}/ener-datadapter/ws/device/` + Authorization);
        state.wsDevice.onmessage = event => {
          const data = event.data;
          if (!data) return;
          state.DeviceMessage = JSON.parse(data);
        };
      } else {
        Message.error('当前浏览器不支持');
      }
    }
  }
};
