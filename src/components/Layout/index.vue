<style lang="scss">
.app-container {
  height: 100%;
  flex-direction: column !important;
  overflow: hidden;
  &-container {
    overflow: hidden;
    &-main {
      padding: 2px !important;
      background: #f5f5f5;
      &-box {
        position: relative;
        height: 100%;
        padding: 10px;
        background: #fff;
        overflow: hidden;
      }
    }
  }
}
</style>

<template>
  <el-container class="app-container">
    <Header></Header>
    <el-container class="app-container-container">
      <Aside></Aside>
      <el-main class="app-container-container-main">
        <div class="app-container-container-main-box">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Header from './Header'
import Aside from './Aside'
export default {
  components: { Header, Aside }
}
</script>
