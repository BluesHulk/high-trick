import axios from 'axios';
import router from '@/router';

import { remove } from '@/utils/remove';

import Message from '@/classes/Message';
import { getToken } from '@/storage/auth';

const http = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 50000
});

const pending = {};
const CancelToken = axios.CancelToken;
const rmPending = (key, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]('重复请求');
  }
  delete pending[key];
};
const getRequestIdentify = (config, req = false) => {
  let url = config.url;
  if (req) {
    url = config.baseURL + config.url.substring(1, config.url.length);
  }
  return config.method === 'get'
    ? encodeURIComponent(url + JSON.stringify(config.params))
    : encodeURIComponent(config.url + JSON.stringify(config.data));
};

http.interceptors.request.use(
  config => {
    config.headers['client-ip'] = localStorage.getItem('Ip');
    const { lazy } = config;
    // 分页懒加载
    if (lazy) {
      const requestData = getRequestIdentify(config, true);
      rmPending(requestData, true);
      config.cancelToken = new CancelToken(c => {
        pending[requestData] = c;
      });
    }
    const auth = getToken();
    if (auth) {
      const { Authorization } = auth;
      if (!Authorization) {
        remove();
        router.push('/login');
      } else {
        config.headers['Authorization'] = Authorization;
      }
    }
    if (!config.contentType) {
      if (config.data instanceof FormData) {
        config.transformRequest = [];
      } else {
        config.transformRequest = [
          data => {
            let str = '';
            for (const p in data) {
              if (data[p] === null || data[p] === undefined) continue;
              let key = encodeURIComponent(p);
              if (Array.isArray(data[p])) {
                key = encodeURIComponent(p) + '[]';
              }
              str += '&' + key + '=' + encodeURIComponent(data[p]);
            }
            return str.substring(1, str.length);
          }
        ];
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

http.interceptors.response.use(
  response => {
    const data = response.data || {};
    const { object, message } = data;
    const { INVALID } = object || {};
    // 在此处约定权限code，没有权限给予提示
    if (INVALID) {
      remove();
      Message.error(message);
      router.push('/login');
      return Promise.reject('error');
    }
    return data;
  },
  error => Promise.reject(error)
);

export default http;
