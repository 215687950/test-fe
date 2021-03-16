<template>
  <div id="app"
    v-loading="appLoading"
    element-loading-text="初始化页面中 。。。"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <Layout></Layout>
  </div>
</template>
<script>
import Layout from './components/Layout/index'
export default {
  name: 'App',
  components: { Layout },
  computed: {
    appLoading () {
      return this.$store.state.appLoading
    }
  }
}
</script>