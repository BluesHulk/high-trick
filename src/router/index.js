import Vue from 'vue';
import VueRouter from 'vue-router';

import { getToken } from '@/storage/auth';
import Layout from '../views/layout/Layout';

import system from './system';
import vehicle from './vehicle';
import municipal from './municipal';
import pipe from './pipe';
import pole from './pole';
import operater from './operater';

Vue.use(VueRouter);

const redirectPath = (() => {
  return getToken() ? '/modules' : '/login';
})();

const routes = [
  {
    path: '/login',
    name: '登录页',
    component: () => import('../views/login/Login')
  },
  {
    path: '/modules',
    name: '模块页',
    hidden: true,
    component: () => import('../views/modules/index.vue')
  },
  {
    path: '/',
    name: 'layout',
    component: Layout,
    redirect: redirectPath
  },

  // {
  //   path: '/personal',
  //   name: 'personal',
  //   component: Layout,
  //   redirect: '/personal/info',
  //   children: [
  //     {
  //       path: '/personal/info',
  //       name: '用户中心',
  //       component: () => import('../views/viewport'),
  //       redirect: '/personal/info/center',
  //       children: [
  //         {
  //           path: '/personal/info/center',
  //           name: '个人中心',
  //           component: () => import('../views/personal/Center')
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    path: '/personal',
    name: 'personal',
    component: Layout,
    redirect: '/personal/info',
    children: [
      {
        path: '/personal/info',
        name: '个人中心',
        component: () => import('../views/personal/Center')
      }
    ]
  },
  {
    path: '/message',
    name: 'message',
    component: Layout,
    redirect: '/message/center',
    children: [
      {
        path: '/message/center',
        name: '个人中心',
        component: () => import('../views/message/Center')
      }
    ]
  },
  {
    path: '/system',
    name: '系统设置',
    component: Layout,
    redirect: '/system/basic',
    children: system
  },
  {
    path: '/vehicle',
    name: '智慧交通',
    component: Layout,
    redirect: '/vehicle/synergism',
    children: vehicle
  },
  {
    path: '/municipal',
    name: '智慧市政',
    component: Layout,
    redirect: '/municipal/green',
    children: municipal
  },
  {
    path: '/pipe',
    name: '智慧管网',
    component: Layout,
    redirect: '/pipe/manage',
    children: pipe
  },
  {
    path: '/pole',
    name: '综合杆',
    component: Layout,
    redirect: '/pole/map',
    children: pole
  },
  {
    path: '/resource',
    name: '资源中心',
    component: Layout,
    redirect: '/resource/space',
    children: [
      {
        path: '/resource/config',
        name: '资源配置',
        component: () => import('../views/viewport.vue'),
        redirect: '/resource/config/group',
        children: [
          {
            path: '/resource/config/group',
            name: '字段分组',
            component: () => import('../views/resource/config/group/group.vue')
          },
          {
            path: '/resource/config/category',
            name: '类型配置',
            component: () => import('../views/resource/config/category/category.vue')
          },
          {
            path: '/resource/config/project',
            name: '项目配置',
            component: () => import('../views/resource/config/project/project.vue')
          },
          {
            path: '/resource/config/company',
            name: '厂商配置',
            component: () => import('../views/resource/config/company/company.vue')
          }
        ]
      },
      {
        path: '/resource/device',
        name: '设备管理',
        component: () => import('../views/viewport.vue'),
        redirect: '/resource/device/page',
        children: [
          {
            path: '/resource/device/page',
            name: '设备管理',
            component: () => import('../views/resource/device/device.vue')
          }
        ]
      },
      {
        path: '/resource/space',
        name: '空间管理',
        component: () => import('../views/viewport.vue'),
        redirect: '/resource/space/page',
        children: [
          {
            path: '/resource/space/page',
            name: '空间管理',
            component: () => import('../views/resource/space/space.vue')
          }
        ]
      },
      {
        path: '/resource/project',
        name: '项目管理',
        component: () => import('../views/viewport.vue'),
        redirect: '/resource/project/page',
        children: [
          {
            path: '/resource/project/page',
            name: '项目管理',
            component: () => import('../views/resource/project/project.vue')
          }
        ]
      },
      {
        path: '/resource/other',
        name: '其他资产',
        component: () => import('../views/viewport.vue'),
        redirect: '/resource/other/page',
        children: [
          {
            path: '/resource/other/page',
            name: '其他资产',
            component: () => import('../views/resource/other/other.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/operater',
    name: '智慧运维',
    component: Layout,
    redirect: '/operater/basic',
    children: operater
  },
  {
    path: '/data',
    name: '数据中心',
    component: Layout,
    redirect: '/data/overview',
    children: [
      {
        path: '/data/overview',
        name: '数据总览',
        component: () => import('../views/viewport.vue'),
        redirect: '/data/overview/page',
        children: [
          {
            path: '/data/overview/page',
            name: '总览',
            component: () => import('../views/data/overview.vue')
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
