export default [
  {
    path: '/municipal/green',
    name: '智慧喷洒',
    component: () => import('../views/viewport.vue'),
    redirect: '/municipal/green/area',
    children: [
      {
        path: '/municipal/green/area',
        name: '区域管理',
        component: () => import('../views/synergism/Monitor.vue')
      },
      {
        path: '/municipal/green/water',
        name: '喷洒策略',
        component: () => import('../views/synergism/Monitor.vue')
      },
      {
        path: '/municipal/green/energy',
        name: '能耗分析',
        component: () => import('../views/synergism/Monitor.vue')
      }
    ]
  },
  {
    path: '/municipal/rubbish',
    name: '智慧垃圾房/桶',
    component: () => import('../views/viewport.vue'),
    redirect: '/municipal/rubbish/alarm',
    children: [
      {
        path: '/municipal/rubbish/alarm',
        name: '溢满报警',
        component: () => import('../views/synergism/Monitor.vue')
      },
      {
        path: '/municipal/rubbish/related',
        name: '环卫联动',
        component: () => import('../views/synergism/Monitor.vue')
      },
      {
        path: '/municipal/rubbish/trend',
        name: '态势管理',
        component: () => import('../views/synergism/Monitor.vue')
      }
    ]
  },
  {
    path: '/municipal/env',
    name: '水/土环境监测',
    component: () => import('../views/viewport.vue'),
    redirect: '/municipal/env/monitor',
    children: [
      {
        path: '/municipal/env/monitor',
        name: '环境监测',
        component: () => import('../views/synergism/Monitor.vue')
      },
      {
        path: '/municipal/env/alarm',
        name: '预警处理',
        component: () => import('../views/synergism/Monitor.vue')
      }
    ]
  },
  {
    path: '/municipal/road',
    name: '路面监测',
    component: () => import('../views/viewport.vue'),
    redirect: '/municipal/road/alarm',
    children: [
      {
        path: '/municipal/road/alarm',
        name: '监测预警',
        component: () => import('../views/synergism/Monitor.vue')
      }
    ]
  }
];
