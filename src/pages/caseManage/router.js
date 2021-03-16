const routes = [
  {
    path: "/case",
    name: "case",
    meta: {
      active: '/case'
    },
    component: () => import('@/pages/caseManage/caseLibrary/Case')
  },
  {
    path: "/caseDetails/:id/:name",
    name: "caseDetails",
    meta: {
      active: '/case',
      isCollapse: true
    },
    component: () => import('@/pages/caseManage/caseLibrary/CaseDetails')
  },
  {
    path: "/planList",
    name: "planList",
    meta: {
      active: '/planList'
    },
    component: () => import('@/pages/caseManage/casePlan/PlanList')
  },
  {
    path: "/planExecute/:id",
    name: "planExecute",
    meta: {
      active: '/planList'
    },
    component: () => import('@/pages/caseManage/casePlan/PlanExecute')
  },
  {
    path: "/planList/planProgress/:id",
    name: "planListProgress",
    meta: {
      active: '/planList'
    },
    component: () => import('@/pages/caseManage/casePlan/PlanProgress')
  },
  {
    path: "/planReport/planProgress/:id",
    name: "planReportProgress",
    meta: {
      active: '/planReport'
    },
    component: () => import('@/pages/caseManage/casePlan/PlanProgress')
  },
  {
    path: "/planReport",
    name: "planReport",
    meta: {
      active: '/planReport'
    },
    component: () => import('@/pages/caseManage/caseReport/PlanReport')
  },
  {
    path: "/planReportDetail/:id",
    name: "planReportDetail",
    meta: {
      active: '/planReport'
    },
    component: () => import('@/pages/caseManage/caseReport/PlanReportDetail')
  }
]

export default routes