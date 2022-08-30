export default [
  {
    path: '/operater/basic',
    name: '运维态势',
    component: () => import('../views/viewport.vue'),
    redirect: '/operater/basic/org',
    children: [
      {
        path: '/operater/basic/org',
        name: '运维态势',
        component: () => import('../views/operater/situational/index.vue')
      }
    ]
  },
  {
    path: '/operater/order',
    name: '工单管理',
    component: () => import('../views/viewport.vue'),
    redirect: '/operater/order/list',
    children: [
      {
        path: '/operater/order/list',
        name: '工单列表',
        component: () => import('../views/operater/repairOrder/order/order.vue')
      },
      {
        path: '/operater/order/my',
        name: '我的工单',
        component: () => import('../views/operater/repairOrder/my/my.vue')
      },
      {
        path: '/operater/order/fixed',
        name: '故障列表',
        component: () => import('../views/operater/repairOrder/fixed/fixed.vue')
      }
    ]
  },
  {
    path: '/operater/configuration',
    name: '运维配置',
    component: () => import('../views/viewport.vue'),
    redirect: '/operater/configuration/operationmember',
    children: [
      {
        path: '/operater/configuration/operationmember',
        name: '运维人员',
        component: () => import('../views/operater/configuration/operater/operater.vue')
      },
      {
        path: '/operater/configuration/inspectionmember',
        name: '巡检人员',
        component: () => import('../views/operater/configuration/inspect/inspect.vue')
      },
      {
        path: '/operater/configuration/rule',
        name: '巡检规则',
        component: () => import('../views/operater/configuration/rule/rule.vue')
      },
      {
        path: '/operater/configuration/ticketrule',
        name: '工单规则',
        component: () => import('../views/operater/configuration/ticketrule/ticketrule.vue')
      }
    ]
  },
  {
    path: '/operater/Inspection',
    name: '巡检管理',
    component: () => import('../views/viewport.vue'),
    redirect: '/operater/Inspection/play',
    children: [
      {
        path: '/operater/Inspection/play',
        name: '巡检计划',
        component: () => import('../views/operater/Inspection/play/play.vue')
      },
      {
        path: '/operater/Inspection/report',
        name: '巡检报告',
        component: () => import('../views/operater/Inspection/report/report.vue')
      }
    ]
  }
];
