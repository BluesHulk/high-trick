export default [
  {
    path: '/pipe/manage',
    name: '智慧喷洒',
    component: () => import('../views/viewport.vue'),
    redirect: '/pipe/manage/monitor',
    children: [
      {
        path: '/pipe/manage/monitor',
        name: '窨井监测',
        component: () => import('../views/synergism/Monitor.vue')
      },
      {
        path: '/pipe/manage/env',
        name: '井环境监测',
        component: () => import('../views/synergism/Monitor.vue')
      }
    ]
  },
  {
    path: '/pipe/digest',
    name: '管网',
    component: () => import('../views/viewport.vue'),
    redirect: '/pipe/digest/net',
    children: [
      {
        path: '/pipe/digest/net',
        name: '数字化管网',
        component: () => import('../views/synergism/Monitor.vue')
      }
    ]
  },
  {
    path: '/pipe/water',
    name: '排水',
    component: () => import('../views/viewport.vue'),
    redirect: '/pipe/water/supply',
    children: [
      {
        path: '/pipe/water/supply',
        name: '智慧给排水',
        component: () => import('../views/synergism/Monitor.vue')
      }
    ]
  }
];
