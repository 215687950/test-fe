import Vue from 'vue'
import VueRouter from 'vue-router'

import service from '../server/api/index'
import store from '../store/index'
import * as utils from '../utils/index'

import systemManage from '@/pages/systemManage/router'
import caseManage from '@/pages/caseManage/router'
import monitorManage from '@/pages/monitorManage/router'
import testTools from '@/pages/testTools/router'
import envManage from '@/pages/envManage/router'
import midTools from '@/pages/midTools/router'
import codeManage from '@/pages/codeManage/router'
import reportManage from '@/pages/reportManage/router'
import reimburseManage from '@/pages/reimburseManage/router'
import mockManage from '@/pages/mockManage/router'
import dataFactory from '@/pages/dataFactory/router'
import autoManage from '@/pages/autoManage/router'
import checkMock from '@/pages/checkMock/router'
 
Vue.use(VueRouter)

const routes = [
  {
    path: "/test/:id/:name",
    name: "test",
    meta: {
      active: '/',
      isCollapse: true
    },
    component: () => import('@/pages/Test')
  },
  {
    path: "/",
    name: "Home",
    meta: {
      active: '/'
    },
    component: () => import('@/pages/Home')
  },
  ...systemManage,
  ...caseManage,
  ...monitorManage,
  ...testTools,
  ...envManage,
   ...midTools,
   ...codeManage,
   ...reportManage,
   ...reimburseManage,
   ...mockManage,
   ...dataFactory,
   ...autoManage,
   ...checkMock
 ]

const router = new VueRouter({
  mode: 'history',
  routes,
  base: `${process.env.VUE_APP_BASE_LOC}`
})

const goLogin = () => {
  window.location.href = `https://login.weipaitang.com/wechatLogin?loginUrl=http://${window.location.host}`
}

let permission = []

async function initData (next) {
  // let domain = document.domain
  let wechatToken = utils.getQueryVariable('token') || localStorage.getItem('wechatToken')
  if (wechatToken) {
    localStorage.setItem('wechatToken', wechatToken)
    // let userInfo = await service.veriToken({ wechatToken, domain })
    let userInfo = await service.veriToken()
    if (!userInfo.data) {
      goLogin()
    } else {
      // localStorage.setItem('wechatToken', wechatToken)
      store.commit('userInfo', userInfo.data)
      // let menuTree = await service.getMenuTree({ roleId: userInfo.data.roleId })
      let power = await service.getMenuTree({ unionId: userInfo.data.unionId })
      let allEnum = await service.getAllEnum()
      store.commit('menuTree', power.data.menu)
      permission = []
      getPermission(power.data.list)
      store.commit('permission', permission)
      store.commit('allEnum', allEnum.data)
      store.commit('appLoading', false)
      next()
    }
  } else {
    goLogin()
  }
}

function getPermission (data) {
  data.forEach(item => {
    permission.push(item.identify)
    if ('children' in item) {
      getPermission(item.children)
    }
  });
}

router.beforeEach((to, from, next) => {
  if (JSON.stringify(store.state.userInfo) === '{}') {
    initData(next)
  } else {
    store.commit('appLoading', false)
    next()
  }
})

export default router