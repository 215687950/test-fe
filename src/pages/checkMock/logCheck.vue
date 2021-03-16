<style lang="scss">
.page-logCheck {
  .table-box {
    flex: 1;
    overflow: hidden;
    .fresh-btn {
      margin-left: 10px;
      font-weight: bold;
      font-size:16px;
      cursor: pointer;
    }
  }
  .el-dialog__wrapper {
    .el-input,
    .el-date-editor.el-input,
    .el-select {
      width: 350px;
    }
    .el-form-item {
      margin-bottom: 16px !important;
    }
  }
}
</style>
<template>
  <div class="page page-logCheck">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keyWord"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="add">新增</el-button>
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
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="taskName" label="检测任务名称" align="center"></el-table-column>
        <el-table-column prop="envs" label="检测环境" align="center"></el-table-column>
        <el-table-column prop="notifiers" label="通知人" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" type="danger" plain>报告生成中</el-button>
            <el-button v-if="scope.row.status === 1" type="success" plain @click="goReport(scope.row)">查看报告</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"></Pagination>
    <el-dialog
      title="新增"
      :visible.sync="showDialog"
      center
      width="500px"
      @close="resetAddForm">
      <el-form ref="ruleForm" :model="addFormData" :rules="rules" :inline="true" label-width="80px">
        <el-form-item label="任务名称" prop="taskName">
          <el-input v-model="addFormData.taskName" placeholder="请输入任务名称"></el-input>
        </el-form-item>
        <el-form-item label="检测模块" prop="projAndSubsMap">
          <el-cascader
            v-model="addFormData.projAndSubsMap"
            :options="projAndSubs"
            :props="{
              multiple: true,
              value: 'id',
              label: 'name',
              children: 'subProjectsList'
            }"
            separator=" - "
            placeholder="请选择检测模块"
            clearable></el-cascader>
        </el-form-item>
        <el-form-item label="检测环境" prop="envs">
          <el-select v-model="addFormData.envs" multiple clearable placeholder="请选择检测环境">
            <el-option v-for="item in envList" :key="item.id" :label="item.envName" :value="item.envName"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="通知人" prop="notifiers">
          <el-select
            v-model="addFormData.notifiers"
            size="small"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请选择通知人"
            :remote-method="remoteMethod"
            :loading="selectLoading">
            <el-option
              v-for="item in users"
              :key="item.value"
              :label="item.name"
              :value="item.accountName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="desc">
          <el-input v-model="addFormData.desc" rows="2" type="textarea" style="width:350px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" style="width: 100%" @click="saveAdd">提交</el-button>
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
      searchData: {
        page: 1,
        pageSize: 10,
        keyWord: ''
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      showDialog: false,
      projAndSubs: [],
      envList: [],
      selectLoading: false,
      users: [],
      addFormData: {
        taskName: '',
        projAndSubsMap: [],
        envs: [],
        notifiers: [],
        desc: ''
      },
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        projAndSubsMap: [
          { required: true, message: '请选择检测模块', trigger: 'change' }
        ],
        envs: [
          { required: true, message: '请选择检测环境', trigger: 'change' }
        ],
        notifiers: [
          { required: true, message: '请选择通知人', trigger: 'change' }
        ]
      },
      saveLoading: false
    }
  },
  methods: {
    add () {
      this.showDialog = true
      this.getProjAndSubs()
      this.getEnvList()
    },
    saveAdd () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.addFormData))
          let projAndSubsMap = {}
          params.projAndSubsMap.forEach(item => {
            if (!(item[0] in projAndSubsMap)) {
              projAndSubsMap[item[0]] = []
            }
            projAndSubsMap[item[0]].push(item[1])
          })
          params.projAndSubsMap = projAndSubsMap
          // console.log(params);
          this.saveLoading = true
          this.$service.saveLogCompareTask(params).then(() => {
            this.$message.success('新增成功')
            this.showDialog = false
            this.getTableData()
          }).finally(() => {
            this.saveLoading = false
          })
        }
      })
    },
    resetAddForm () {
      this.$refs['ruleForm'].resetFields()
      this.addFormData = {
        taskName: '',
        projAndSubsMap: [],
        envs: '',
        notifiers: '',
        desc: ''
      }
    },
    // 搜索人
    remoteMethod (query) {
      if (query !== '') {
        this.selectLoading = true
        this.$service.getUserByName({ name: query }).then(res => {
          this.users = res.data
          this.selectLoading = false
        })
      } else {
        this.users = []
      }
    },
    getProjAndSubs () {
      this.$service.mockCompareGetProjAndSubs().then(res => {
        this.projAndSubs = res.data
      })
    },
    getEnvList () {
      this.$service.selectAllConfigEnv().then(res => {
        this.envList = res.data
      })
    },
    goReport (row) {
      this.$router.push(`/logCheckReport/${row.id}/${encodeURIComponent(row.taskName)}`)
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.mockCompareGetLogTaskList(this.searchData).then(res => {
        this.tableData = res.data.taskList
        this.total = res.data.totalCount
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>