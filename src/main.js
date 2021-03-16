import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import UmyUi from 'umy-ui'
import 'umy-ui/lib/theme-chalk/index.css'
Vue.use(UmyUi)

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.scss'
Vue.use(ElementUI)

import hljs from 'highlight.js'
import 'highlight.js/styles/atelier-estuary-light.css';
Vue.directive('highlight', {
  // 被绑定元素插入父节点时调用
  inserted: function(el) {
      let blocks = el.querySelectorAll('pre code');
      for (let i = 0; i < blocks.length; i++) {
          hljs.highlightBlock(blocks[i]);
      }
  },
  // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
  componentUpdated: function(el) {
      let blocks = el.querySelectorAll('pre code');
      for (let i = 0; i < blocks.length; i++) {
          hljs.highlightBlock(blocks[i]);
      }
  }
})

import service from './server/api/index'
import * as utils from './utils/index'

import clickoutside from './directives/clickoutside'

Vue.config.productionTip = false

Vue.prototype.$service = service
Vue.prototype.$utils = utils

Vue.directive('click-out-side', clickoutside)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
