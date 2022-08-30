// import { getAuthListAuthOfUser } from '@/api/rbac';
// import { setModules, removeModules, setButtons, removeButtons, setMenus, removeMenus } from '@/storage/permission';

export default {
  state: {
    buttons: [],
    permissionButtons: [],
    modules: [],
    sideMenu: []
  },
  mutations: {
    SET_SIDE_MENU(state, sideMenu = []) {
      state.sideMenu = sideMenu;
    },
    SET_BUTTONS(state, buttons = []) {
      state.buttons = buttons;
    },
    SET_PERMISSION_BUTTONS(state, permissionButtons) {
      state.permissionButtons = permissionButtons;
    },
    SET_MODULES(state, modules = []) {
      state.modules = modules;
    }
  },
  actions: {
    GetSideMenu({ commit }) {
      return new Promise((resolve, reject) => {
        // getAuthListAuthOfUser({ type: 'MENU' })
        //   .then(res => {
        //     const { success, object } = res;
        //     if (success && Array.isArray(object)) {
        //       commit('SET_SIDE_MENU', object);
        //       setMenus(object);
        //       resolve(object);
        //     } else {
        //       removeMenus();
        //       reject();
        //     }
        //   })
        //   .catch(error => Promise.reject(error));
      });
    },
    GetButtons({ commit }) {
      return new Promise((resolve, reject) => {
        // getAuthListAuthOfUser({ type: 'BUTTON' })
        //   .then(res => {
        //     const { success, object } = res;
        //     if (success && Array.isArray(object)) {
        //       commit('SET_BUTTONS', object);
        //       const buttons = object.filter(value => value.enabled).map(value => value.path);
        //       commit('SET_PERMISSION_BUTTONS', buttons);
        //       setButtons(object);
        //       resolve(object);
        //     } else {
        //       removeButtons();
        //       reject();
        //     }
        //   })
        //   .catch(error => Promise.reject(error));
      });
    },
    GetModules({ commit }) {
      return new Promise((resolve, reject) => {
        // getAuthListAuthOfUser({ type: 'MODULE' })
        //   .then(res => {
        //     const { success, object } = res;
        //     if (success && Array.isArray(object)) {
        //       commit('SET_MODULES', object);
        //       setModules(object);
        //       resolve(object);
        //     } else {
        //       removeModules();
        //       reject();
        //     }
        //   })
        //   .catch(error => Promise.reject(error));
      });
    }
  }
};
