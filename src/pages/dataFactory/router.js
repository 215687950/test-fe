const routes = [
  {
    path: '/dataFactoryUser',
    name: 'dataFactoryUser',
    meta: {
      active: '/dataFactoryUser'
    },
    component: () => import('@/pages/dataFactory/User')
  },
  {
    path: '/dataFactoryBusiness',
    name: 'dataFactoryBusiness',
    meta: {
      active: '/dataFactoryBusiness'
    },
    component: () => import('@/pages/dataFactory/Business')
  },
  {
    path: '/dataFactoryLots',
    name: 'dataFactoryLots',
    meta: {
      active: '/dataFactoryLots'
    },
    component: () => import('@/pages/dataFactory/Lots')
  },
  {
    path: '/dataFactoryOrder',
    name: 'dataFactoryOrder',
    meta: {
      active: '/dataFactoryOrder'
    },
    component: () => import('@/pages/dataFactory/Order')
  }
]

export default routes