const routes = [
  {
    path: "/userManage",
    name: "userManage",
    meta: {
      active: '/userManage'
    },
    component: () => import('@/pages/systemManage/UserManage')
  },
  {
    path: "/roleManage",
    name: "roleManage",
    meta: {
      active: '/roleManage'
    },
    component: () => import('@/pages/systemManage/RoleManage')
  },
  {
    path: "/deptManage",
    name: "deptManage",
    meta: {
      active: '/deptManage'
    },
    component: () => import('@/pages/systemManage/DeptManage')
  },
  {
    path: "/menuManage",
    name: "menuManage",
    meta: {
      active: '/menuManage'
    },
    component: () => import('@/pages/systemManage/MenuManage')
  }
]

export default routes