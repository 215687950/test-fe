const routes = [
  // 被 ReportRecordList 替换
  // {
  //   path: '/reportData',
  //   name: 'reportData',
  //   meta: {
  //     active: '/reportData'
  //   },
  //   component: () => import('@/pages/reportManage/ReportData')
  // },
  {
    path: '/recordList',
    name: 'recordList',
    meta: {
      active: '/recordList'
    },
    component: () => import('@/pages/reportManage/ReportRecordList')
  },
  {
    path: '/reportList',
    name: 'reportList',
    meta: {
      active: '/reportList'
    },
    component: () => import('@/pages/reportManage/ReportList')
  },
  {
    path: '/reportSetting',
    name: 'reportSetting',
    meta: {
      active: '/reportSetting'
    },
    component: () => import('@/pages/reportManage/ReportSetting')
  },
  {
    path: '/reportSetting',
    name: 'reportSettingEdit',
    meta: {
      active: '/reportSetting'
    },
    component: () => import('@/pages/reportManage/ReportSetting')
  }
  // {
  //   path: '/reportSetting/edit/:id',
  //   name: 'reportSettingEdit',
  //   meta: {
  //     active: '/reportSetting'
  //   },
  //   component: () => import('@/pages/reportManage/ReportSetting')
  // }
]

export default routes