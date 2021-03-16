<style lang="scss">
.page-mergeEnv {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
  .add-dialog {
    .el-row:not(:last-child) {
      margin-bottom: 16px;
    }
    label {
      margin-right: 15px;
    }
  }
  .el-drawer__body {
    display: flex;
    flex-direction: column;
  }
}
</style>
<template>
  <div class="page page-mergeEnv">
    <div class="page-search-bar">
      <label>环境</label>
      <el-select v-model="searchData.env" clearable placeholder="请选择环境">
        <el-option v-for="item in envList" :key="item.id" :label="item.envName" :value="item.id"></el-option>
      </el-select>
      <label>执行人</label>
      <el-select
        v-model="searchData.userId"
        remote
        filterable
        clearable
        :remote-method="loadUsers"
        :loading="selectLoading"
        size="small">
        <el-option
          v-for="item in userList"
          :key="item.userId"
          :label="item.name"
          :value="item.userId"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="add">新增任务</el-button>
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
        <el-table-column prop="id" label="任务Id" align="center"></el-table-column>
        <el-table-column prop="env" label="环境" :formatter="formatterEnv" align="center"></el-table-column>
        <el-table-column prop="syncType" label="配置类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.syncType === 1">自选服务</span>
            <span v-if="scope.row.syncType === 2">配置文件</span>
          </template>
        </el-table-column>
        <el-table-column prop="operateUserName" label="操作人" align="center"></el-table-column>
        <el-table-column prop="status" label="执行结果" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 1" type="info" size="small" effect="plain">执行中</el-tag>
            <el-tag v-if="scope.row.status === 0" type="success" size="small" effect="plain">执行完成</el-tag>
            <el-tag v-if="scope.row.status === -1" type="danger" size="small" effect="plain">执行失败</el-tag>
            <el-tag v-if="scope.row.status === 2" type="warning" size="small" effect="plain">等待中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="200"></el-table-column>
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="scope">
            <el-button type="info" size="mini" @click="showSyncInfo(scope.row)" plain>任务详情</el-button>
            <el-button
              type="danger"
              size="mini"
              @click="completeTask(scope.row)"
              v-if="scope.row.status !== 0">置为完成</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"></Pagination>
    <el-dialog title="新增一键更新任务"
      class="add-dialog"
      :visible.sync="showDialog.add"
      center
      width="400px">
      <el-row>
        <el-switch
          v-model="addData.syncType"
          active-text="按组更新"
          active-value="2"
          inactive-value="1"
          inactive-text="按服务更新"></el-switch>
      </el-row>
      <el-row>
        <label>选择环境</label>
        <el-select
          v-model="addData.envList"
          clearable
          multiple
          collapse-tags
          value-key="id"
          placeholder="请选择环境"
          style="width: 270px">
          <el-option v-for="item in envList" :key="item.id" :label="item.envName" :value="item"></el-option>
        </el-select>
      </el-row>
      <el-row v-if="addData.syncType === '1'">
        <label>选择服务</label>
        <el-select
          v-model="addData.serverList"
          clearable
          multiple
          collapse-tags
          value-key="id"
          placeholder="请选择服务"
          style="width: 270px">
          <el-option v-for="item in serverList" :key="item.id" :label="item.pipelineName" :value="item"></el-option>
        </el-select>
      </el-row>
      <el-row v-else>
        <label>请选择组</label>
        <el-select
          v-model="addData.groupList"
          clearable
          multiple
          collapse-tags
          value-key="key"
          placeholder="请选择组"
          style="width: 270px">
          <el-option v-for="item in groupList" :key="item.key" :label="item.name" :value="item"></el-option>
        </el-select>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.add" type="primary" style="width: 100%" @click="addSubmit">开始任务</el-button>
      </span>
    </el-dialog>
    <el-dialog title="一键更新结果"
      :visible.sync="showDialog.detail"
      center
      width="825px">
      <el-form ref="ruleForm" :model="detailInfo" :inline="true" label-width="70px">
        <el-form-item label="服务名称">
          <el-input v-model="detailInfo.pipLineName" disabled></el-input>
        </el-form-item>
        <el-form-item label="项目名称">
          <el-input v-model="detailInfo.projectName" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前状态">
          <el-tag v-if="detailInfo.deployStatus === 1" type="info" size="small" effect="plain">Queued</el-tag>
          <el-tag v-if="detailInfo.deployStatus === 2" type="info" size="small" effect="plain">Running</el-tag>
          <el-tag v-if="detailInfo.deployStatus === 3" type="success" size="small" effect="plain">Finished</el-tag>
          <el-tag v-if="detailInfo.deployStatus === -1" type="danger" size="small" effect="plain">Error</el-tag>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="detailInfo.deployStartTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="detailInfo.deployEndTime" disabled></el-input>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-input v-model="detailInfo.updateTime" disabled></el-input>
        </el-form-item>
      </el-form>
      <el-tabs v-model="activeName">
        <el-tab-pane label="部署请求数据" name="reqData">
          <el-input type="textarea" :rows="15" v-model="detailInfo.deployReq" disabled></el-input>
        </el-tab-pane>
        <el-tab-pane label="部署返回数据" name="resData">
          <el-input type="textarea" :rows="15" v-model="detailInfo.deployRes" disabled></el-input>
        </el-tab-pane>
        <el-tab-pane label="状态返回数据" name="statusResData">
          <el-input type="textarea" :rows="15" v-model="detailInfo.statusRes" disabled></el-input>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-drawer title="更新详情"
      :visible.sync="showDrawer"
      size="600">
      <div class="page-search-bar" style="margin: 0 20px 10px 20px">
        <label>关键字</label>
        <el-input
          v-model="drawerSearchData.keywords"
          placeholder="请输入服务名称"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="getDrawerTableData"></el-input>
        <label>状态</label>
        <el-select v-model="drawerSearchData.status" clearable placeholder="请选择状态">
          <el-option v-for="item in detailStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" size="small" icon="el-icon-search" @click="getDrawerTableData">搜索</el-button>
      </div>
      <div class="table-box" ref="drawer-table-box">
        <el-table
          v-loading="drawerTableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#FFFAFA)"
          :data="drawerTableData"
          :height="drawerTableHeight"
          border
          style="width: 100%">
          <el-table-column prop="id" label="ID" align="center"></el-table-column>
          <el-table-column prop="pipLineName" label="服务" align="center"></el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.deployStatus === 1" type="info" size="small" effect="plain">Queued</el-tag>
              <el-tag v-if="scope.row.deployStatus === 2" type="info" size="small" effect="plain">Running</el-tag>
              <el-tag v-if="scope.row.deployStatus === 3" type="success" size="small" effect="plain">Finished</el-tag>
              <el-tag v-if="scope.row.deployStatus === -1" type="danger" size="small" effect="plain">Error</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="timeConsuming" label="耗时(ms)" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="240px">
            <template slot-scope="scope">
              <el-button type="info" size="mini" @click="showDetail(scope.row)">详情</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="restart(scope.row)"
                :disabled="scope.row.deployStatus === 3"
              >重试</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="cancelDeploy(scope.row)"
                :disabled="scope.row.deployStatus === 3"
              >取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>
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
      envList: [],
      selectLoading: false,
      userList: [],
      searchData: {
        env: '',
        userId: '',
        page: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableHeight: null,
      tableData: [],
      total: 0,
      loading: {
        add: false
      },
      showDialog: {
        add: false,
        detail: false
      },
      addData: {
        syncType: '2',
        envList: [],
        serverList: [],
        groupList: []
      },
      serverList: [],
      groupList: [
        { key: 1, name: 'php相关服务' },
        { key: 2, name: 'micro相关服务' },
        { key: 3, name: 'basic相关服务' }
      ],
      showDrawer: false,
      drawerSearchData: {
        taskId: '',
        keywords: '',
        status: ''
      },
      detailStatusList: [
        { id: 1, name: 'Queued' },
        { id: 2, name: 'Running' },
        { id: 3, name: 'Finished' },
        { id: -1, name: 'Error' }
      ],
      drawerTableLoading: false,
      drawerTableData: [],
      drawerTableHeight: null,
      detailInfo: {},
      activeName: 'reqData'
    }
  },
  created () {
    this.getEnvList()
    this.getTableData()
  },
  methods: {
    /* 任务详情抽屉相关 */
    showDetail (row) {
      row.deployReq = this.isJSON(row.deployReq)
        ? JSON.stringify(JSON.parse(row.deployReq), null, "\t")
        : row.deployReq
      row.deployRes = this.isJSON(row.deployRes)
        ? JSON.stringify(JSON.parse(row.deployRes), null, "\t")
        : row.deployRes
      row.statusRes = this.isJSON(row.statusRes)
        ? JSON.stringify(JSON.parse(row.statusRes), null, "\t")
        : row.statusRes
      this.detailInfo = row
      this.showDialog.detail = true
    },
    isJSON(str) {
      if (typeof str == 'string') {
        try {
          var obj = JSON.parse(str)
          if (typeof obj == 'object' && obj) {
            return true
          } else {
            return false
          }
        } catch (e) {
          return false
        }
      }
    },
    restart (row) {
      if (row.deployStatus === -1) {
        this.$service.deployServer({ productId: row.id }).then(() => {
          this.$message.success('重新部署成功')
          this.getDrawerTableData()
        })
      } else if (row.deployStatus === 1 || row.deployStatus === 2) {
        this.$service.updateDeployStatus({ productId: row.id }).then(() => {
          this.$message.success('重新获取状态成功')
          this.getDrawerTableData()
        })
      }
    },
    cancelDeploy (row) {
      this.$service.canceDeploylByProduct({ productId: row.id }).then(() => {
        this.$message.success('取消成功')
        this.getDrawerTableData()
      })
    },
    showSyncInfo (row) {
      this.showDrawer = true
      this.$nextTick(() => {
        this.drawerTableHeight = this.$refs['drawer-table-box'].offsetHeight
      })
      this.drawerSearchData.taskId = row.id
      this.getDrawerTableData()
    },
    getDrawerTableData () {
      this.drawerTableLoading = true
      this.$service.getTaskDetail(this.drawerSearchData).then(res => {
        this.drawerTableData = res.data
      }).finally(() => {
        this.drawerTableLoading = false
      })
    },
    // 新增
    add () {
      this.showDialog.add = true
      this.$service.getServerList().then(res => {
        this.serverList = res.data
      })
    },
    addSubmit () {
      let params = {
        syncType: this.addData.syncType,
        envList: this.addData.envList,
      }
      if (this.addData.syncType === '1') {
        params.configList = this.addData.serverList
      } else if (this.addData.syncType === '2') {
        params.serverList= this.addData.groupList
      }
      this.loading.add = true
      this.$service.mergeEnv(params).then(() => {
        this.$message.success('环境正在更新，刷新列表查看执行状态')
        this.showDialog.add = false
        this.getTableData()
      }).finally(() => {
        this.loading.add = false
      })
    },
    // 置为完成
    completeTask (row) {
      this.$msgbox.confirm('该任务将重置成完成状态, 是否继续??', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.setTaskComplete({ taskId: row.id }).then(() => {
          this.$message.success('重置任务状态成功')
          this.getTableData()
        })
      })
    },
    // 获取表格数据
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      params.size = params.pageSize
      delete params.pageSize
      this.tableLoading = true
      this.$service.getEnvTask(params).then(res => {
        this.tableData = res.data.dataList
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
      })
    },
    formatterEnv(row) {
      let envArray = JSON.parse(row.env)
      let env = ''
      envArray.forEach((item, index) => {
        env += item.envName + (index === envArray.length - 1 ? '' : '，')
      })
      return env
    },
    loadUsers (words) {
      if (words !== '') {
        this.selectLoading = true
        this.$service.loadUsers({ keyWord: words }).then(res => {
          this.userList = res.data
        }).finally(() => {
          this.selectLoading = false
        })
      } else {
        this.userList = []
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