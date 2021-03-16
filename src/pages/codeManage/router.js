const routes = [
  {
    path: "/phpTaskList",
    name: "phpTaskList",
    meta: {
      active: '/phpTaskList'
    },
    component: () => import('@/pages/codeManage/PhpTaskList')
  },
  {
    path: "/phpMergeReq",
    name: "phpMergeReq",
    meta: {
      active: '/phpMergeReq'
    },
    component: () => import('@/pages/codeManage/PhpScanResult')
  },
  {
    path: "/scanObjectConf",
    name: "scanObjectConf",
    meta: {
      active: '/scanObjectConf'
    },
    component: () => import('@/pages/codeManage/PhpScanConf')
  }
]

export default routes