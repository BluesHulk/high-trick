import { Store } from '@silen/store';

const sidebar = {
  state: {
    sidebar: {
      collapsed: !+Store.get('sidebarCollapsed')
    }
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.collapsed) {
        Store.set('sidebarCollapsed', 1);
      } else {
        Store.set('sidebarCollapsed', 0);
      }
      state.sidebar.collapsed = !state.sidebar.collapsed;
    }
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR');
    }
  }
};

export default sidebar;
