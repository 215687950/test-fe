<style lang="scss">
.app-container-aside-box {
  position: relative;
  padding-bottom: 54px;
  border-right: solid 1px #e6e6e6;
  .el-aside {
    height: 100%;
    overflow-y: auto;
    .el-menu {
      border-right: none;
      .el-menu-item.is-active {
        background: #ecf5ff;
      }
    }
  }
  .fold-switch {
    position: absolute;
    width: calc(100% - 1px);
    height: 54px;
    line-height: 54px;
    padding: 0 10px;
    bottom: 0;
    border-top: solid 1px #e6e6e6;
    i {
      font-weight: bold;
      color: #42526e;
      cursor: pointer;
    }
  }
  .fold {
    text-align: center;
    i {
      transform: rotateY(180deg)
    }
  }
  .unfold {
    text-align: right;
  }
}
</style>
<template>
  <div class="app-container-aside-box">
    <el-aside :style="{width: isCollapse ? '64px' : '200px'}">
      <el-menu
        :default-active="active"
        unique-opened
        router
        :collapse="isCollapse"
        :collapse-transition="false"
        @select="selectMenu">
        <template v-for="level1 in menuTree">
          <el-menu-item v-if="level1.name === '墨菲'" :key="level1.id" :index="level1.url">
            <i :class="icons[level1.url]"></i>
            <span slot="title">{{level1.name}}</span>
          </el-menu-item>
          <el-submenu v-else :key="level1.id" :index="level1.url">
            <template slot="title">
              <i :class="icons[level1.url]"></i>
              <span>{{level1.name}}</span>
            </template>
            <template v-for="level2 in level1.children">
              <el-menu-item
                v-if="level2.type === 2"
                :key="level2.id"
                :index="level2.url">{{level2.name}}</el-menu-item>
            </template>
          </el-submenu>
        </template>
      </el-menu>
    </el-aside>
    <div class="fold-switch" :class="isCollapse ? 'fold' : 'unfold'">
      <i class="el-icon-d-arrow-left" @click="isCollapse = !isCollapse"></i>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      isCollapse: false,
      active: '',
      icons: {
        envManage: 'el-icon-monitor',
        caseManage: 'el-icon-edit-outline',
        etcdManage: 'el-icon-set-up',
        reimburse: 'el-icon-money',
        testTools: 'el-icon-help',
        reportManage: 'el-icon-files',
        dataFactory: 'el-icon-coin',
        codeManage: 'el-icon-c-scale-to-original',
        monitorManage: 'el-icon-odometer',
        autoTest: 'el-icon-cpu',
        mockManage: 'el-icon-paperclip',
        midManage: 'el-icon-attract',
        mofei: 'el-icon-map-location',
        checkMock: 'el-icon-paperclip',
      }
    }
  },
  computed: {
    menuTree () {
      return this.$store.state.menuTree
    }
  },
  watch: {
    // 监听路由，控制菜单栏收缩
    '$route': {
      handler (route) {
        this.active = route.meta.active
        // if (route.meta.isCollapse) {
        //   this.isCollapse = true
        // }
      },
      immediate: true
    }
  },
  methods: {
    selectMenu (index) {
      if (index === 'mofei') {
        window.open('http://mofei.wpt.la/tester', '_blank')
      }
    }
  }
}
</script>
