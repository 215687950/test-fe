<style lang="scss">
.app-container-header {
  height: 50px !important;
  padding: 0 20px;
  border-bottom: 1px solid #dcdfe6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  &-logo {
    display: flex;
    font-size: 16px;
    cursor: pointer;
    img {
      width: 20px;
      height: 20px;
      vertical-align: sub;
      margin-right: 2px;
    }
    .data-factory-env {
      margin-left: 70px;
      .env-label {
        color: #606266;
        margin-right: 8px;
        font-size: 14px;
        &::before {
          content: '*';
          color: red;
          margin-right: 3px;
        }
      }
    }
  }
  &-handler {
    line-height: 1;
    cursor: pointer;
  }
}
</style>
<template>
  <el-header class="app-container-header">
    <div class="app-container-header-logo">
      <div @click="goHome">
        <img src="https://cdn.weipaitang.com/static/2019110192c3b08a-190c-40e4-a969-6bc8b97e3587-W40H40" alt="logo">
        微拍堂测试平台
      </div>
      <div v-if="showCenter" class="data-factory-env">
        <label class="env-label" :style="{color: dataFactoryEnvErr ? 'red' : ''}">选择环境</label>
        <el-select v-model="env" clearable placeholder="请选择测试环境" @change="envChange" style="width:220px">
          <el-option
            v-for="item in envList"
            :key="item.envNum"
            :label="item.envName"
            :value="item.envNum"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="app-container-header-handler">
      <el-dropdown @command="handleCommand">
        <el-avatar :src="avatar"></el-avatar>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="logout">退出当前账号</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </el-header>
</template>
<script>
export default {
  data () {
    return {
      env: ''
    }
  },
  computed: {
    avatar () {
      return this.$store.state.userInfo.avatar
    },
    showCenter () {
      return this.$route.path.indexOf('/dataFactory') > -1
    },
    envList () {
      return this.$store.state.dataFactoryEnvList
    },
    dataFactoryEnvErr () {
      return this.$store.state.dataFactoryEnvErr
    },
  },
  methods: {
    envChange (value) {
      this.$store.commit('dataFactoryEnvErr', value ? false : true)
      this.$store.commit('dataFactoryEnv', value)
    },
    goHome () {
      this.$router.push('/')
    },
    handleCommand (command) {
      if (command === 'logout') {
        this.$service.logout().then(() => {
          localStorage.removeItem('wechatToken')
          this.$message.success("退出成功")
          window.location.href = `https://login.weipaitang.com/wechatLogin?loginUrl=http://${window.location.host}`
        })
      }
    }
  }
}
</script>
