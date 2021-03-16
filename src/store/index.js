import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  appLoading: true,
  userInfo: {},
  menuTree: [],
  permission: [],
  allEnum: {},
  dataFactoryEnv: '',
  dataFactoryEnvList: '',
  dataFactoryEnvErr: false
}

const mutations = {
  appLoading (state, appLoading) {
    state.appLoading = appLoading
  },
  userInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  menuTree (state, menuTree) {
    state.menuTree = menuTree
  },
  permission (state, permission) {
    state.permission = permission
  },
  allEnum (state, allEnum) {
    state.allEnum = allEnum
  },
  dataFactoryEnv (state, dataFactoryEnv) {
    state.dataFactoryEnv = dataFactoryEnv
  },
  dataFactoryEnvList (state, dataFactoryEnvList) {
    state.dataFactoryEnvList = dataFactoryEnvList
  },
  dataFactoryEnvErr (state, dataFactoryEnvErr) {
    state.dataFactoryEnvErr = dataFactoryEnvErr
  }
}

export default new Vuex.Store({
  state,
  mutations
})
