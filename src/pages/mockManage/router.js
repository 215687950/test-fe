const routes = [
  {
    path: "/mockConf",
    name: "mockConf",
    meta: {
      active: '/mockConf'
    },
    component: () => import('@/pages/mockManage/MockConf')
  },
  {
    path: "/expressInfo",
    name: "expressInfo",
    meta: {
      active: '/expressInfo'
    },
    component: () => import('@/pages/mockManage/ExpressInfo')
  },
  {
    path: "/wechatExpress",
    name: "wechatExpress",
    meta: {
      active: '/wechatExpress'
    },
    component: () => import('@/pages/mockManage/WechatExpress')
  },
  {
    path: "/wechatBindAccount",
    name: "wechatBindAccount",
    meta: {
      active: '/wechatBindAccount'
    },
    component: () => import('@/pages/mockManage/WechatBindAccount')
  }
  // ,
  // {
  //   path: "/vriAccount",
  //   name: "vriAccount",
  //   meta: {
  //     active: '/vriAccount'
  //   },
  //   component: () => import('@/pages/mockManage/VriAccount')
  // }
]

export default routes