export default [
  {
    path: '/system/basic',
    name: '基础管理',
    component: () => import('../views/viewport.vue'),
    redirect: '/system/basic/org',
    children: [
      {
        path: '/system/basic/org',
        name: '组织架构',
        component: () => import('../views/system/basic/Org.vue')
      },
      {
        path: '/system/basic/role',
        name: '角色管理',
        component: () => import('../views/system/basic/Role.vue')
      },
      {
        path: '/system/basic/account',
        name: '账号管理',
        component: () => import('../views/system/basic/Account.vue')
      }
    ]
  },
  {
    path: '/system/log',
    name: '日志管理',
    component: () => import('../views/viewport.vue'),
    redirect: '/system/log/user',
    children: [
      {
        path: '/system/log/user',
        name: '用户日志',
        component: () => import('../views/system/log/User.vue')
      },
      {
        path: '/system/log/action',
        name: '操作日志',
        component: () => import('../views/system/log/Action.vue')
      },
      {
        path: '/system/log/device',
        name: '设备操作日志',
        component: () => import('../views/system/log/Device.vue')
      }
    ]
  },
  {
    path: '/system/message',
    name: '消息管理',
    component: () => import('../views/viewport.vue'),
    redirect: '/system/message/template',
    children: [
      {
        path: '/system/message/template',
        name: '消息模板',
        component: () => import('../views/system/message/MessageTemplate.vue')
      },
      {
        path: '/system/message/send',
        name: '消息发送',
        component: () => import('../views/system/message/Send.vue')
      }
    ]
  }
];
