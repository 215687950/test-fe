const routes = [
  {
    path: '/serverMonitor',
    name: 'serverMonitor',
    meta: {
      active: '/serverMonitor'
    },
    component: () => import('@/pages/monitorManage/ServerMonitor')
  },
  {
    path: '/monitorResult',
    name: 'monitorResult',
    meta: {
      active: '/monitorResult'
    },
    component: () => import('@/pages/monitorManage/MonitorResult')
  }
]

export default routes