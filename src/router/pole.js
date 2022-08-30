export default [
  {
    path: '/pole/map',
    name: '综合杆管理',
    component: () => import('../views/viewport.vue'),
    redirect: '/pole/map/manage',
    children: [
      {
        path: '/pole/map/manage',
        name: '综合杆管理',
        component: () => import('../views/pole/Manage.vue')
      }
    ]
  }
];
