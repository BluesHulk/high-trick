import { logout } from '@/api/rbac';
import { getToken, getUser, setUser } from '@/storage/auth';
import { remove } from '@/utils/remove';
import { Message } from 'element-ui';
import { staffQueryById } from '@/api/rbac';

const user = {
  state: {
    // GT20201103-128
    user_info: getUser() || {},
    access_token: getToken() || { Authorization: '' }
  },

  mutations: {
    REFRESH_USER_INFO(state, user_info) {
      state.user_info = user_info;
    },
    SET_ACCESS_TOKEN: (state, access_token) => {
      state.access_token = access_token;
    }
  },

  actions: {
    // Login({ commit, dispatch }, data) {
    //   return new Promise((resolve, reject) => {
    //     login(data)
    //       .then(response => {
    //         const { code } = response;
    //         if (code === 200) {
    //           // object.chName = encodeURIComponent(object.chName);
    //           // setToken(object);
    //           // commit('SET_ACCESS_TOKEN', object);
    //           resolve(response);
    //         } else {
    //           Message({
    //             message: response.message,
    //             type: 'error',
    //             duration: 5 * 1000
    //           });
    //           reject(response);
    //         }
    //       })
    //       .catch(error => {
    //         reject(error);
    //       });
    //   });
    // },

    refreshUserInfo({ commit }) {
      return new Promise(resolve => {
        const data = getToken();
        if (!data) return;
        const Authorization = data.Authorization;
        if (!Authorization) return;
        const info = data[Authorization];
        if (!info) return;
        const { userInfo } = info;
        if (!userInfo) return;
        staffQueryById(userInfo.staffId).then(res => {
          const { code, object } = res;
          if (code === 200) {
            const data = object || {};
            commit('REFRESH_USER_INFO', data);
            setUser(data);
            resolve(data);
          }
        });
      });
    },

    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit('SET_ACCESS_TOKEN', '');
            remove();
            Message.info(`退出成功`);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_ACCESS_TOKEN', '');
        remove();
        resolve();
        window.top.location.reload();
      });
    }
  }
};

export default user;
