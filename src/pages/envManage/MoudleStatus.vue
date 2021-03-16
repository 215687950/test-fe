<style lang="scss">
.page-moudleStatus {
  .table-box {
    flex: 1;
    overflow: hidden;
    .row-red {
      background: red;
      color: #fff;
    }
  }
  .el-dialog__wrapper {
    height: 100%;
    .el-dialog {
      height: 80%;
      .el-dialog__body {
        display: flex;
        flex-direction: column;
        .el-tabs {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          .el-tabs__content {
            flex: 1;
            overflow: hidden;
          }
        }
      }
    }
    .info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 5px;
      .time-box {
        font-weight: bold;
        color: #333;
        .time {
          color: red;
          font-size: 16px;
        }
      }
      .el-icon-refresh-left {
        margin-left: 10px;
        vertical-align: bottom;
        cursor: pointer;
        color: #e6a23c;
        font-weight: bold;
        font-size: 20px;
      }
    }
  }
}
</style>
<template>
  <div class="page page-moudleStatus">
    <div class="page-search-bar">
      <label>环境</label>
      <el-select v-model="searchData.env" placeholder="请选择环境">
        <el-option
          v-for="item in envList"
          :key="item.id"
          :label="item.envName"
          :value="item.id"></el-option>
      </el-select>
      <label>关键字</label>
      <el-input
        v-model="searchData.keyword"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="getTableData"></el-input>
      <label>类型</label>
      <el-select
        v-model="searchData.type"
        placeholder="请选择类型"
        multiple
        clearable
        collapse-tags>
        <el-option
          v-for="item in statusTypeList"
          :key="item.key"
          :label="item.label"
          :value="item.key"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="getTableData">搜索</el-button>
      <el-button type="success" size="small" :loading="tabLoading" @click="handleShowDiff">显示服务对比</el-button>
    </div>
    <div class="table-box" ref="table-box">
      <el-table
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#FFFAFA)"
        :data="tableData"
        :height="tableHeight"
        border
        :row-class-name="tableRowClassName"
        style="width: 100%">
        <el-table-column type="index" label="#" width="60" align="center"></el-table-column>
        <el-table-column prop="items[0]" label="NAME" min-width="400" align="center"></el-table-column>
        <el-table-column prop="items[1]" label="READY" align="center"></el-table-column>
        <el-table-column prop="items[2]" label="STATUS" align="center"></el-table-column>
        <el-table-column prop="items[3]" label="RESTARTS" align="center"></el-table-column>
        <el-table-column prop="items[4]" label="AGE" align="center"></el-table-column>
      </el-table>
    </div>
    <el-dialog
      class="big-dialog"
      title="服务对比"
      :visible.sync="showDialog"
      center
      width="650px">
      <div class="info">
        <div>
          <el-switch
            v-model="readType"
            active-text="读取缓存"
            active-value="1"
            inactive-value="0"
            inactive-text="重新同步"></el-switch>
          <i class="el-icon-refresh-left" @click="handleShowDiff"></i>
        </div>
        <div class="time-box">
          当前数据时间：
          <span class="time">{{$utils.formatDate(createTime, 'yyyy-MM-dd hh:mm:ss')}}</span>
        </div>
      </div>
      <el-tabs v-model="activeName" v-loading="tabLoading">
        <el-tab-pane label="所有服务" name="1">
          <el-table
            :data="allService"
            align="center"
            border
            :height="height">
            <el-table-column prop="name" align="center" label="名称"></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="不同服务" name="2">
          <el-table
            :data="diffService"
            align="center"
            border
            :height="height">
            <el-table-column prop="name" align="center" label="名称"></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      envList: [],
      statusTypeList: [
        { key: 'onlyShowError', label: '显示错误对比' },
        { key: 'showJustUpdate', label: '显示最近更新' },
        { key: 'showReplicasZ', label: '显示副本为0' },
      ],
      searchData: {
        env: '4',
        keyword: '',
        type: []
      },
      tableLoading: false,
      tableHeight: null,
      tableData: [],
      showDialog: false,
      tabLoading: false,
      readType: '1',
      createTime: '',
      allService: [],
      diffService: [],
      activeName: '1',
      height: null
    }
  },
  mounted () {
    this.getEnvList()
    this.tableHeight = this.$refs['table-box'].offsetHeight
    window.onresize = () => {
      this.tableHeight = this.$refs['table-box'].offsetHeight
    }
    this.getTableData()
  },
  methods: {
    handleShowDiff () {
      this.allService = []
      this.diffService = []
      this.tabLoading = true
      this.$service.showDiffStatus({
        env: this.searchData.env,
        type: this.readType
      }).then(res => {
        if (JSON.stringify(res.data) !== '{}') {
          res.data.all.forEach(item => {
            this.allService.push({ name: item })
          })
          res.data.current.forEach(item => {
            this.diffService.push({ name: item })
          })
          this.createTime = res.data.createTime
        }
        this.showDialog = true
        this.$nextTick(() => {
          this.height = document.getElementsByClassName('el-tabs__content')[0].offsetHeight
        })
      }).finally(() => {
        this.tabLoading = false
      })
    },
    // 获取表格数据
    getTableData () {
      let params = {
        env: this.searchData.env,
        keyword: this.searchData.keyword
      }
      this.searchData.type.forEach(item => {
        params[item] = '1'
      })
      this.tableLoading = true
      this.$service.getAllMoudleStatus(params).then(res => {
        this.tableData = res.data
      }).finally(() => {
        this.tableLoading = false
      })
    },
    tableRowClassName ({ row }) {
      if (row.status === 1) {
        return 'row-red'
      }
    },
    getEnvList () {
      this.$service.selectAllConfigEnv().then(res => {
        this.envList = res.data
      })
    }
  }
}
</script>