<style lang="scss">
.page-syncEnvConfig {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
}
</style>
<template>
  <div class="page page-syncEnvConfig">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <label>服务类型</label>
      <el-select v-model="searchData.serverType" clearable>
        <el-option
          v-for="item in serverTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"></el-option>
      </el-select>
      <label>服务状态</label>
      <el-select v-model="searchData.isUse" clearable>
        <el-option
          v-for="item in statusList"
          :key="item.id"
          :label="item.name"
          :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="warning" size="small" icon="el-icon-aim" @click="syncServerDialog">同步服务</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="add">新增环境</el-button>
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
        style="width: 100%">
        <el-table-column prop="id" label="id" align="center" width="70px"></el-table-column>
        <el-table-column prop="pipelineName" label="PipelineName" align="center"></el-table-column>
        <el-table-column prop="projectCode" label="project" align="center"></el-table-column>
        <el-table-column prop="serverType" label="所属服务" :formatter="formatType" align="center"></el-table-column>
        <el-table-column prop="configStatus" label="当前状态" align="center" width="90px">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.configStatus === 0 ? 'success' : 'danger'"
              effect="plain"
              size="small">{{ formatStatus(scope.row.configStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
        <el-table-column label="操作" align="center" width="100px">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.configStatus === 1"
              type="success"
              size="mini"
              icon="el-icon-s-order"
              @click="modifyStatus(scope.row, 0)"
              plain
            >启用</el-button>
            <el-button
              v-if="scope.row.configStatus === 0"
              type="danger"
              size="mini"
              icon="el-icon-s-order"
              @click="modifyStatus(scope.row, 1)"
              plain
            >停用</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"></Pagination>
    <el-dialog title="同步服务"
      :visible.sync="showDialog.sync"
      center
      width="309px">
      <label style="margin-right: 10px">服务类型</label>
      <el-select v-model="tkeList" multiple  clearable collapse-tags>
        <el-option
          v-for="item in serverTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.name"></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="syncLoading" type="primary" style="width: 100%" @click="syncSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增环境"
      class="big-dialog"
      :visible.sync="showDialog.addEnv"
      center
      width="520px">
      <div class="page-search-bar">
        <label>环境名称</label>
        <el-input
          v-model="envName"
          placeholder="格式：env-*"
          clearable></el-input>
        <el-button type="success" size="small" icon="el-icon-plus" @click="addEnv">新增环境</el-button>
        <el-button type="primary" size="small" icon="el-icon-refresh-left" @click="getEnvList">刷新</el-button>
      </div>
      <el-table
        :data="envList"
        border
        style="width: 100%">
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column prop="envName" label="环境" align="center"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="syncLoading" type="primary" style="width: 100%" @click="syncSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import mixin from '@/mixins/mixin'
export default {
  components: { Pagination },
  mixins: [mixin],
  data () {
    return {
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      searchData: {
        keywords: '',
        serverType: '',
        isUse: '',
        page: 1,
        pageSize: 10
      },
      serverTypeList: [
        { id: 1, name: 'PHP' },
        { id: 2, name: 'MICRO' },
        { id: 3, name: 'BASIC' }
      ],
      statusList: [
        { id: 0, name: '启用' },
        { id: 1, name: '停用' },
        { id: 2, name: '废弃' }
      ],
      showDialog: {
        sync: false,
        addEnv: false
      },
      tkeList: [],
      syncLoading: false,
      envName: '',
      envList: []
    }
  },
  methods: {
    // 同步
    syncServerDialog () {
      this.tkeList = []
      this.showDialog.sync = true
    },
    syncSubmit () {
      this.syncLoading = true
      this.$service.syncServer({ tkeList: this.tkeList }).then(() => {
        this.$message.success('同步服务成功')
        this.showDialog.sync = false
        this.getTableData()
      }).finally(() => {
        this.syncLoading = false
      })
    },
    // 新增
    add () {
      this.showDialog.addEnv = true
      this.getEnvList()
    },
    addEnv () {
      this.$service.addConfigEnv({ envName: this.envName }).then(() => {
        this.$message.success('新增环境成功')
        this.getEnvList()
      })
    },
    getEnvList () {
      this.$service.selectAllConfigEnv().then(res => {
        this.envList = res.data
      })
    },
    // 启用/停用
    modifyStatus (row, status) {
      this.$service.changedConfigStatus({ id: row.id, status }).then(() => {
        this.$message.success('修改状态成功')
        this.getTableData()
      })
    },
    // 获取表格数据
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      params.size = params.pageSize
      delete params.pageSize
      this.tableLoading = true
      this.$service.getSyncConfigList(params).then(res => {
        this.tableData = res.data.dataList
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
      })
    },
    formatType(row) {
      let item = this.serverTypeList.find(item => item.id === row.serverType)
      return item === undefined ? '' : item.name
    },
    formatStatus(configStatus) {
      let item = this.statusList.find(item => item.id === configStatus)
      return item === undefined ? '' : item.name
    }
  }
}
</script>