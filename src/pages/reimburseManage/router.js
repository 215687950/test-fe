const routes = [
  // 报销申请
  {
    path: '/reimApply',
    name: 'reimApply',
    meta: {
      active: '/reimApply'
    },
    component: () => import('@/pages/reimburseManage/ReimApply')
  },
  // 报销审核
  {
    path: '/reimburseCheck',
    name: 'reimburseCheck',
    meta: {
      active: '/reimburseCheck'
    },
    component: () => import('@/pages/reimburseManage/ReimburseCheck')
  },
  // 财务审核
  {
    path: '/reimCw',
    name: 'reimCw',
    meta: {
      active: '/reimCw'
    },
    component: () => import('@/pages/reimburseManage/ReimCw')
  },
  // 核销列表
  {
    path: '/reimVeri',
    name: 'reimVeri',
    meta: {
      active: '/reimVeri'
    },
    component: () => import('@/pages/reimburseManage/ReimVeri')
  },
  // 已报销列表
  {
    path: '/reimComplete',
    name: 'reimComplete',
    meta: {
      active: '/reimComplete'
    },
    component: () => import('@/pages/reimburseManage/ReimComplete')
  }
]

export default routes