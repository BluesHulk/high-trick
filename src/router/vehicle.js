export default [
  {
    path: '/vehicle/synergism',
    name: '车路协同',
    component: () => import('../views/viewport.vue'),
    redirect: '/vehicle/synergism/monitor',
    children: [
      {
        path: '/vehicle/synergism/monitor',
        name: '车辆监测',
        component: () => import('../views/synergism/Monitor.vue')
      },
      {
        path: '/vehicle/synergism/manage',
        name: '车辆调度',
        component: () => import('../views/synergism/Monitor.vue')
      }
    ]
  },
  {
    path: '/vehicle/transit',
    name: '智慧公交站',
    component: () => import('../views/viewport.vue'),
    redirect: '/vehicle/transit/real',
    children: [
      {
        path: '/vehicle/transit/real',
        name: '车辆实时状态',
        component: () => import('../views/synergism/Monitor.vue')
      },
      {
        path: '/vehicle/transit/passenger',
        name: '客流分析',
        component: () => import('../views/synergism/Monitor.vue')
      }
    ]
  },
  {
    path: '/vehicle/info',
    name: '交通情报板',
    component: () => import('../views/viewport.vue'),
    redirect: '/vehicle/info/board',
    children: [
      {
        path: '/vehicle/info/board',
        name: '交通情报板',
        component: () => import('../views/synergism/Monitor.vue')
      }
    ]
  },
  {
    path: '/vehicle/serve',
    name: '出行服务',
    component: () => import('../views/viewport.vue'),
    redirect: '/vehicle/serve/guide',
    children: [
      {
        path: '/vehicle/serve/guide',
        name: '交通导流',
        component: () => import('../views/synergism/Monitor.vue')
      }
    ]
  }
];
