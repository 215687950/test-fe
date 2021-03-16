const routes = [
  {
    path: "/logCheck",
    name: "logCheck",
    meta: {
      active: '/logCheck'
    },
    component: () => import('@/pages/checkMock/logCheck')
  },
  {
    path: "/logCheckReport/:id/:name",
    name: "logCheckReport",
    meta: {
      active: '/logCheck'
    },
    component: () => import('@/pages/checkMock/logCheckReport')
  },
  {
    path: "/pathCheck",
    name: "pathCheck",
    meta: {
      active: '/pathCheck'
    },
    component: () => import('@/pages/checkMock/pathCheck')
  },
  {
    path: "/pathCheckReport/:id/:name",
    name: "pathCheckReport",
    meta: {
      active: '/pathCheck'
    },
    component: () => import('@/pages/checkMock/pathCheckReport')
  }
]

export default routes