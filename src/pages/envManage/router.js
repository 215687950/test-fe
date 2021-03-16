const routes = [
  {
    path: '/etcdTree',
    name: 'etcdTree',
    meta: {
      active: '/etcdTree',
      isCollapse: true
    },
    component: () => import('@/pages/envManage/EtcdTree')
  },
  {
    path: '/etcdTree2',
    name: 'etcdTree2',
    meta: {
      active: '/etcdTree2',
      isCollapse: true
    },
    component: () => import('@/pages/envManage/EtcdTree2')
  },
  {
    path: '/etcdPermission',
    name: 'etcdPermission',
    meta: {
      active: '/etcdPermission'
    },
    component: () => import('@/pages/envManage/EtcdPermission')
  },
  {
    path: '/etcdOperate',
    name: 'etcdOperate',
    meta: {
      active: '/etcdOperate'
    },
    component: () => import('@/pages/envManage/EtcdOperate')
  },
  {
    path: '/etcdOperateRecord',
    name: 'etcdOperateRecord',
    meta: {
      active: '/etcdOperateRecord'
    },
    component: () => import('@/pages/envManage/EtcdOperateRecord')
  },
  {
    path: '/EtcdBackManage',
    name: 'EtcdBackManage',
    meta: {
      active: '/EtcdBackManage'
    },
    component: () => import('@/pages/envManage/EtcdBackManage')
  },
  // ETCD配置检查 - 下掉
  // {
  //   path: '/etcdsetting',
  //   name: 'etcdsetting',
  //   meta: {
  //     active: '/etcdsetting'
  //   },
  //   component: () => import('@/pages/envManage/EtcdSetting')
  // },
  {
    path: '/moudleStatus',
    name: 'moudleStatus',
    meta: {
      active: '/moudleStatus'
    },
    component: () => import('@/pages/envManage/MoudleStatus')
  },
  {
    path: '/employTke',
    name: 'employTke',
    meta: {
      active: '/employTke'
    },
    component: () => import('@/pages/envManage/EmployTke')
  },
  {
    path: '/mergeEnv',
    name: 'mergeEnv',
    meta: {
      active: '/mergeEnv'
    },
    component: () => import('@/pages/envManage/MergeEnv')
  },
  {
    path: '/grayWhiteList',
    name: 'grayWhiteList',
    meta: {
      active: '/grayWhiteList'
    },
    component: () => import('@/pages/envManage/GrayWhiteList')
  },
  {
    path: '/syncEnvConfig',
    name: 'syncEnvConfig',
    meta: {
      active: '/syncEnvConfig'
    },
    component: () => import('@/pages/envManage/SyncEnvConfig')
  },
  {
    path: '/deployRecord',
    name: 'deployRecord',
    meta: {
      active: '/deployRecord'
    },
    component: () => import('@/pages/envManage/DeployRecord')
  },
  {
    path: '/settingEditRecord',
    name: 'settingEditRecord',
    meta: {
      active: '/settingEditRecord'
    },
    component: () => import('@/pages/envManage/SettingEditRecord')
  },
  {
    path: '/tkeServerList',
    name: 'tkeServerList',
    meta: {
      active: '/tkeServerList'
    },
    component: () => import('@/pages/envManage/TkeServerList')
  },
  {
    path: '/tkeServerStatusList',
    name: 'tkeServerStatusList',
    meta: {
      active: '/tkeServerStatusList'
    },
    component: () => import('@/pages/envManage/TkeServerStatusList')
  },
  {
    path: '/problemRecord',
    name: 'problemRecord',
    meta: {
      active: '/problemRecord'
    },
    component: () => import('@/pages/envManage/ProblemRecord')
  }
]

export default routes