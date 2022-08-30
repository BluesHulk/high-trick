import Vue from 'vue';
import Vuex from 'vuex';

import permission from './modules/permission';
import user from './modules/user';
import sidebar from './modules/sidebar';
import DeviceCtrl from './modules/control';
import message from './modules/message';
import maintain from './modules/maintain';

import getters from './getters';
import { getTopNav } from '../storage/nav';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    defaultsHeadPortraitUrl: require('@/assets/defaults.png'),
    modules: [
      {
        id: 7,
        path: '/synthesize',
        name: '综合杆管理',
        parentId: null,
        module: 'synthesize'
      },
      {
        id: 6,
        path: '/shadow',
        name: '智慧光影',
        parentId: null,
        module: 'shadow'
      },
      {
        id: 5,
        path: '/safety',
        name: '综合安防',
        parentId: null,
        module: 'safety'
      },
      {
        id: 4,
        path: '/operation',
        name: '运营服务',
        parentId: null,
        module: 'operation'
      },
      {
        id: 3,
        path: '/operater',
        name: '智慧运维',
        parentId: null,
        module: 'operater'
      },
      {
        id: 8,
        path: '/data',
        name: '数据中心',
        parentId: null,
        module: 'data'
      },
      {
        id: 2,
        path: '/resource',
        name: '资源中心',
        parentId: null,
        module: 'resource'
      },
      {
        id: 1,
        path: '/system',
        name: '系统设置',
        parentId: null,
        module: 'system'
      },
      {
        id: 9,
        path: '/screen',
        name: '大屏展示',
        parentId: null,
        module: 'screen'
      },
      {
        id: 10,
        path: '/pole',
        name: '综合杆管理',
        parentId: null,
        module: 'pole'
      },
      {
        id: 11,
        path: '/vehicle',
        name: '智慧交通',
        parentId: null,
        module: 'vehicle'
      },
      {
        id: 12,
        path: '/municipal',
        name: '智慧市政',
        parentId: null,
        module: 'municipal'
      },
      {
        id: 13,
        path: '/pipe',
        name: '智慧管网',
        parentId: null,
        module: 'pipe'
      }
      /*,
      {
        id: 8,
        path: '/personal',
        name: 'personal',
        parentId: null,
        module: 'personal',
        hidden: true
      }*/
    ],
    menus: [
      {
        path: '/system/basic',
        id: 1001,
        name: '基础管理',
        parentId: 1,
        module: 'system'
      },
      {
        path: '/system/log',
        id: 1002,
        name: '日志管理',
        parentId: 1,
        module: 'system'
      },
      {
        path: '/system/message',
        id: 1003,
        name: '消息管理',
        parentId: 1,
        module: 'system'
      },
      {
        path: '/system/basic/org',
        id: 1004,
        name: '组织架构',
        parentId: 1001,
        module: 'system',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },
      {
        path: '/system/basic/role',
        id: 1005,
        name: '角色管理',
        parentId: 1001,
        module: 'system',
        iconSelected: require('@/assets/menu/role-selected.png'),
        icon: require('@/assets/menu/role.png')
      },
      {
        path: '/system/basic/account',
        id: 1006,
        name: '账号管理',
        parentId: 1001,
        module: 'system',
        iconSelected: require('@/assets/menu/account-selected.png'),
        icon: require('@/assets/menu/account.png')
      },
      // {
      //   path: '/personal/info',
      //   id: 1007,
      //   name: 'personal',
      //   parentId: 8,
      //   module: 'personal',
      //   hidden: true
      // },
      // {
      //   path: '/personal/info/center',
      //   id: 1008,
      //   name: '个人中心',
      //   parentId: 1007,
      //   module: 'personal',
      //   iconSelected: require('@/assets/menu/account-selected.png'),
      //   icon: require('@/assets/menu/account.png')
      // },
      {
        path: '/system/log/user',
        id: 10021,
        name: '用户日志',
        parentId: 1002,
        module: 'system',
        iconSelected: require('@/assets/menu/log-user-selected.png'),
        icon: require('@/assets/menu/log-user.png')
      },
      {
        path: '/system/log/action',
        id: 10022,
        name: '操作日志',
        parentId: 1002,
        module: 'system',
        iconSelected: require('@/assets/menu/log-action-selected.png'),
        icon: require('@/assets/menu/log-action.png')
      },
      {
        path: '/system/log/device',
        id: 10023,
        name: '设备操控日志',
        parentId: 1002,
        module: 'system',
        iconSelected: require('@/assets/menu/log-device-selected.png'),
        icon: require('@/assets/menu/log-device.png')
      },
      // 消息管理
      {
        path: '/system/message/template',
        id: 1005,
        name: '消息模板',
        parentId: 1003,
        module: 'system',
        iconSelected: require('@/assets/menu/envelop-selected.png'),
        icon: require('@/assets/menu/envelop.png')
      },
      {
        path: '/system/message/send',
        id: 1006,
        name: '消息发送',
        parentId: 1003,
        module: 'system',
        iconSelected: require('@/assets/menu/sms-selected.png'),
        icon: require('@/assets/menu/sms.png')
      },
      {
        path: '/resource/space',
        id: 2006,
        name: '空间管理',
        parentId: 2,
        module: 'resource'
      },
      {
        path: '/resource/space/page',
        id: 2007,
        name: '空间管理',
        parentId: 2006,
        module: 'resource',
        iconSelected: require('@/assets/menu/space.png'),
        icon: require('@/assets/menu/space.png')
      },
      {
        path: '/resource/device',
        id: 2008,
        name: '设备管理',
        parentId: 2,
        module: 'resource'
      },
      {
        path: '/resource/device/page',
        id: 2009,
        name: '设备管理',
        parentId: 2008,
        module: 'resource',
        iconSelected: require('@/assets/menu/device.png'),
        icon: require('@/assets/menu/device.png')
      },
      {
        path: '/resource/project',
        id: 2010,
        name: '项目管理',
        parentId: 2,
        module: 'resource'
      },
      {
        path: '/resource/project/page',
        id: 2011,
        name: '项目管理',
        parentId: 2010,
        module: 'resource',
        iconSelected: require('@/assets/menu/project.png'),
        icon: require('@/assets/menu/project.png')
      },
      {
        path: '/resource/other',
        id: 2012,
        name: '其他资产',
        parentId: 2,
        module: 'resource'
      },
      {
        path: '/resource/other/page',
        id: 2013,
        name: '其他资产',
        parentId: 2012,
        module: 'resource',
        iconSelected: require('@/assets/menu/asset.png'),
        icon: require('@/assets/menu/asset.png')
      },
      {
        path: '/resource/config',
        id: 2001,
        name: '资源配置',
        parentId: 2,
        module: 'resource'
      },
      {
        path: '/resource/config/group',
        id: 2002,
        name: '字段分组',
        parentId: 2001,
        module: 'resource',
        iconSelected: require('@/assets/menu/config-group-active.png'),
        icon: require('@/assets/menu/config-group.png')
      },
      {
        path: '/resource/config/category',
        id: 2003,
        name: '类别配置',
        parentId: 2001,
        module: 'resource',
        iconSelected: require('@/assets/menu/config-category-active.png'),
        icon: require('@/assets/menu/config-category.png')
      },
      {
        path: '/resource/config/project',
        id: 2004,
        name: '项目配置',
        parentId: 2001,
        module: 'resource',
        iconSelected: require('@/assets/menu/config-project-active.png'),
        icon: require('@/assets/menu/config-project.png')
      },
      {
        path: '/resource/config/company',
        id: 2005,
        name: '厂商配置',
        parentId: 2001,
        module: 'resource',
        iconSelected: require('@/assets/menu/config-company-active.png'),
        icon: require('@/assets/menu/config-company.png')
      },
      {
        path: '/operater/basic',
        id: 901,
        name: '运维态势',
        parentId: 3,
        module: 'operater'
      },
      {
        path: '/operater/order',
        id: 902,
        name: '工单管理',
        parentId: 3,
        module: 'operater'
      },
      {
        path: '/operater/Inspection',
        id: 903,
        name: '巡检管理',
        parentId: 3,
        module: 'operater'
      },
      {
        path: '/operater/message',
        id: 904,
        name: '运维统计',
        parentId: 3,
        module: 'operater'
      },
      {
        path: '/operater/configuration',
        id: 905,
        name: '运维配置',
        parentId: 3,
        module: 'operater'
      },
      {
        path: '/operater/basic/org',
        id: 906,
        name: '运维态势',
        parentId: 901,
        module: 'operater',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      // {
      //   path: '/personal/info',
      //   id: 1007,
      //   name: 'personal',
      //   parentId: 8,
      //   module: 'personal',
      //   hidden: true
      // },
      // {
      //   path: '/personal/info/center',
      //   id: 1008,
      //   name: '个人中心',
      //   parentId: 1007,
      //   module: 'personal',
      //   iconSelected: require('@/assets/menu/account-selected.png'),
      //   icon: require('@/assets/menu/account.png')
      // },
      // 工单管理子tab配置
      {
        path: '/operater/order/list',
        id: 9021,
        name: '工单列表',
        parentId: 902,
        module: 'operater',
        iconSelected: require('@/assets/menu/order-list-selected.png'),
        icon: require('@/assets/menu/order-list.png')
      },
      {
        path: '/operater/order/my',
        id: 9022,
        name: '我的工单',
        parentId: 902,
        module: 'operater',
        iconSelected: require('@/assets/menu/order-list-my-selected.png'),
        icon: require('@/assets/menu/order-list-my.png')
      },
      {
        path: '/operater/order/fixed',
        id: 9023,
        name: '故障列表',
        parentId: 902,
        module: 'operater',
        iconSelected: require('@/assets/menu/error-list-selected.png'),
        icon: require('@/assets/menu/error-list.png')
      },
      // 运维管理
      {
        path: '/operater/Inspection/play',
        id: 9033,
        name: '巡检计划',
        parentId: 903,
        module: 'operater',
        iconSelected: require('@/assets/menu/error-list-selected.png'),
        icon: require('@/assets/menu/error-list.png')
      },
      {
        path: '/operater/Inspection/report',
        id: 9034,
        name: '巡检报告',
        parentId: 903,
        module: 'operater',
        iconSelected: require('@/assets/menu/error-list-selected.png'),
        icon: require('@/assets/menu/error-list.png')
      },
      // 运维配置子tab
      {
        path: '/operater/configuration/operationmember',
        id: 9051,
        name: '运维人员',
        parentId: 905,
        module: 'operater',
        iconSelected: require('@/assets/menu/operater-people-selected.png'),
        icon: require('@/assets/menu/operater-people.png')
      },
      {
        path: '/operater/configuration/inspectionmember',
        id: 9052,
        name: '巡检人员',
        parentId: 905,
        module: 'operater',
        iconSelected: require('@/assets/menu/polling-list-selected.png'),
        icon: require('@/assets/menu/polling-list.png')
      },
      {
        path: '/operater/configuration/rule',
        id: 9053,
        name: '巡检规则',
        parentId: 905,
        module: 'operater',
        iconSelected: require('@/assets/menu/log-action-selected.png'),
        icon: require('@/assets/menu/log-action.png')
      },
      {
        path: '/operater/configuration/ticketrule',
        id: 9054,
        name: '工单规则',
        parentId: 905,
        module: 'operater',
        iconSelected: require('@/assets/menu/log-action-selected.png'),
        icon: require('@/assets/menu/log-action.png')
      },

      {
        path: '/vehicle/synergism',
        id: 1101,
        name: '车路协同',
        parentId: 11,
        module: 'vehicle'
      },
      {
        path: '/vehicle/synergism/monitor',
        id: 1102,
        name: '车辆监测',
        parentId: 1101,
        module: 'vehicle',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },
      {
        path: '/vehicle/synergism/manage',
        id: 1103,
        name: '车辆调度',
        parentId: 1101,
        module: 'vehicle',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/vehicle/transit',
        id: 1104,
        name: '智慧公交站',
        parentId: 11,
        module: 'vehicle'
      },
      {
        path: '/vehicle/transit/real',
        id: 1105,
        name: '车辆实时状态',
        parentId: 1104,
        module: 'vehicle',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },
      {
        path: '/vehicle/transit/passenger',
        id: 1106,
        name: '客流分析',
        parentId: 1104,
        module: 'vehicle',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/vehicle/info',
        id: 1107,
        name: '交通情报板',
        parentId: 11,
        module: 'vehicle'
      },
      {
        path: '/vehicle/info/board',
        id: 1108,
        name: '交通情报板',
        parentId: 1107,
        module: 'vehicle',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/vehicle/serve',
        id: 1109,
        name: '出行服务',
        parentId: 11,
        module: 'vehicle'
      },
      {
        path: '/vehicle/serve/guide',
        id: 1110,
        name: '交通导流',
        parentId: 1109,
        module: 'vehicle',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/municipal/green',
        id: 1111,
        name: '智慧喷洒',
        parentId: 12,
        module: 'municipal'
      },
      {
        path: '/municipal/green/area',
        id: 1112,
        name: '区域管理',
        parentId: 1111,
        module: 'municipal',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },
      {
        path: '/municipal/green/water',
        id: 1113,
        name: '喷洒策略',
        parentId: 1111,
        module: 'municipal',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },
      {
        path: '/municipal/green/energy',
        id: 1114,
        name: '能耗分析',
        parentId: 1111,
        module: 'municipal',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/municipal/rubbish',
        id: 1115,
        name: '智慧垃圾房/桶',
        parentId: 12,
        module: 'municipal'
      },
      {
        path: '/municipal/rubbish/alarm',
        id: 1116,
        name: '溢满报警',
        parentId: 1115,
        module: 'municipal',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },
      {
        path: '/municipal/rubbish/related',
        id: 1117,
        name: '环卫联动',
        parentId: 1115,
        module: 'municipal',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },
      {
        path: '/municipal/rubbish/trend',
        id: 1118,
        name: '态势管理',
        parentId: 1115,
        module: 'municipal',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/municipal/env',
        id: 1119,
        name: '水/土环境监测',
        parentId: 12,
        module: 'municipal'
      },
      {
        path: '/municipal/env/monitor',
        id: 1120,
        name: '环境监测',
        parentId: 1119,
        module: 'municipal',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },
      {
        path: '/municipal/env/alarm',
        id: 1121,
        name: '预警处理',
        parentId: 1119,
        module: 'municipal',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/municipal/road',
        id: 1122,
        name: '路面监测',
        parentId: 12,
        module: 'municipal'
      },
      {
        path: '/municipal/road/alarm',
        id: 1123,
        name: '监测预警',
        parentId: 1122,
        module: 'municipal',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/pipe/manage',
        id: 1124,
        name: '窨井管理',
        parentId: 13,
        module: 'pipe'
      },
      {
        path: '/pipe/manage/monitor',
        id: 1125,
        name: '窨井监测',
        parentId: 1124,
        module: 'pipe',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },
      {
        path: '/pipe/manage/env',
        id: 1126,
        name: '井环境监测',
        parentId: 1124,
        module: 'pipe',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/pipe/digest',
        id: 1127,
        name: '数字化管网',
        parentId: 13,
        module: 'pipe'
      },
      {
        path: '/pipe/digest/net',
        id: 1128,
        name: '数字化管网',
        parentId: 1127,
        module: 'pipe',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/pipe/water',
        id: 1129,
        name: '智慧给排水',
        parentId: 13,
        module: 'pipe'
      },
      {
        path: '/pipe/water/supply',
        id: 1130,
        name: '智慧给排水',
        parentId: 1129,
        module: 'pipe',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/pole/map',
        id: 1131,
        name: '综合杆管理',
        parentId: 10,
        module: 'pole'
      },
      {
        path: '/pole/map/manage',
        id: 1132,
        name: '综合杆管理',
        parentId: 1131,
        module: 'pole',
        iconSelected: require('@/assets/menu/org-selected.png'),
        icon: require('@/assets/menu/org.png')
      },

      {
        path: '/data/overview',
        id: 1133,
        name: '数据总览',
        parentId: 8,
        module: 'data'
      },
      {
        path: '/data/overview/page',
        id: 1134,
        name: '总览',
        parentId: 1133,
        module: 'data',
        iconSelected: require('@/assets/menu/account-selected.png'),
        icon: require('@/assets/menu/account.png')
      }
    ],
    topRoutes: [],
    subRoutes: [],
    subNavId: null,
    GlobalActionType: ''
  },
  mutations: {
    SET_SUB_ROUTES(state, subs) {
      state.subRoutes = subs;
    },
    SET_SUB_NAV_ID(state, id) {
      state.subNavId = id;
    },
    SET_TOP_ROUTES(state, routes) {
      state.topRoutes = routes;
    },
    SET_GLOBAL_ACTION_TYPE(state, type) {
      state.GlobalActionType = type;
    }
  },
  actions: {
    SetSubRoutes({ commit, state }, subs) {
      return new Promise(resolve => {
        const menus = state.menus.concat();
        const current = getTopNav();
        const subNavs = [...menus.filter(ii => ii.parentId === current)].concat(subs || []);
        commit('SET_SUB_ROUTES', subNavs);
        resolve(subNavs);
      });
    },
    SetSubId({ commit }, id) {
      // Store.set('SUB_NAV_ID', id);
      commit('SET_SUB_NAV_ID', id);
    },
    RefreshTopRoutes({ commit }, { type, routes }) {
      return new Promise((resolve, reject) => {
        switch (type) {
          case 'TOP_ROUTES':
            commit('SET_TOP_ROUTES', routes);
            break;
          case 'SUB_ROUTES':
            commit('SET_SUB_ROUTES', routes);
            break;
        }
        resolve();
      });
    },
    SetGlobalActionType({ commit }, type) {
      commit('SET_GLOBAL_ACTION_TYPE', type);
    }
  },
  modules: {
    DeviceCtrl,
    message,
    maintain,
    permission,
    user,
    sidebar
  },
  getters
});
