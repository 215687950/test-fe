const routes = [
  {
    path: '/redisTool',
    name: 'redisTool',
    meta: {
      active: '/redisTool'
    },
    component: () => import('@/pages/midTools/RedisTool')
  },
  {
    path: '/mysqlTool',
    name: 'mysqlTool',
    meta: {
      active: '/mysqlTool'
    },
    component: () => import('@/pages/midTools/MysqlTool')
  },
  {
    path: '/kibanaTool',
    name: 'kibanaTool',
    meta: {
      active: '/kibanaTool'
    },
    component: () => import('@/pages/midTools/KibanaTool')
  },
  {
    path: '/TKEEnv',
    name: 'TKEEnv',
    meta: {
      active: '/TKEEnv'
    },
    component: () => import('@/pages/midTools/TKEEnv')
  }
]

export default routes