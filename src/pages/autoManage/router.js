const routes = [
  {
    path: "/timedTask",
    name: "timedTask",
    meta: {
      active: '/timedTask'
    },
    component: () => import('@/pages/autoManage/timedTask')
  },
  {
    path: "/timedTask/report",
    name: "timedTaskReport",
    meta: {
      active: '/timedTask'
    },
    component: () => import('@/pages/autoManage/RunJenkinsShell')
  },
  {
    path: "/runJenkinsShell",
    name: "runJenkinsShell",
    meta: {
      active: '/runJenkinsShell'
    },
    component: () => import('@/pages/autoManage/RunJenkinsShell')
  },
  {
    path: "/testNgConfig",
    name: "testNgConfig",
    meta: {
      active: '/testNgConfig'
    },
    component: () => import('@/pages/autoManage/TestNgConfig')
  }
]

export default routes