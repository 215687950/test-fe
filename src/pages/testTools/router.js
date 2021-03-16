const routes = [
  {
    path: "/wechatRobot",
    name: "wechatRobot",
    meta: {
      active: '/wechatRobot'
    },
    component: () => import('@/pages/testTools/WechatRobot')
  },
  {
    path: "/taskManage",
    name: "taskManage",
    meta: {
      active: '/taskManage'
    },
    component: () => import('@/pages/testTools/TaskManage')
  },
  {
    path: "/infoArchiving",
    name: "infoArchiving",
    meta: {
      active: '/infoArchiving'
    },
    component: () => import('@/pages/testTools/InfoArchiving')
  },
  {
    path: "/validate",
    name: "validate",
    meta: {
      active: '/validate'
    },
    component: () => import('@/pages/testTools/JSONValidate')
  },
  {
    path: "/execShell",
    name: "execShell",
    meta: {
      active: '/execShell'
    },
    component: () => import('@/pages/testTools/ExecShell')
  },
  {
    path: "/couponList",
    name: "couponList",
    meta: {
      active: '/couponList'
    },
    component: () => import('@/pages/testTools/Coupons')
  }
]

export default routes