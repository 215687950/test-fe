<style lang="scss">
.page-timedTask {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
  .el-dialog__wrapper {
    .el-input,
    .el-date-editor.el-input,
    .el-textarea__inner,
    .el-select {
      width: 200px;
    }
    .el-form-item {
      margin-bottom: 16px;
    }
    .el-textarea__inner {
      width: 490px;
      margin-top: 5px;
    }
  }
}
</style>
<template>
  <div class="page page-timedTask">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <label>状态</label>
      <el-select v-model="searchData.status" clearable>
        <el-option label="启用" :value="1"></el-option>
        <el-option label="禁用" :value="0"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-button type="primary" size="small" @click="goReport">测试报告</el-button>
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
        <el-table-column prop="jobName" label="任务名称" align="center"></el-table-column>
        <el-table-column prop="execEnv" label="执行环境" align="center"></el-table-column>
        <el-table-column prop="jobCron" label="定时时间" align="center"></el-table-column>
        <el-table-column prop="adminName" label="负责人" align="center"></el-table-column>
        <el-table-column label="启用/禁用" align="center">
          <template v-slot="{ row }">
            <el-switch
              v-model="row.triggerStatus"
              :inactive-value="0"
              :active-value="1"
              @change="switchChanged(row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="light" content="编辑" placement="top">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  @click="handleEdit(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除" placement="top">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  @click="handleDel(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="执行一次" placement="top">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-video-play"
                  @click="handleExecute(scope.row)"
                ></el-button>
              </el-tooltip>
            </el-button-group>
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
      :title="handleType === 'add' ? '新增' : '编辑'"
      :visible.sync="showDialog"
      center
      width="630px"
      @close="resetAddForm">
      <el-form ref="ruleForm" :model="addFormData" :rules="rules" :inline="true" label-width="80px">
        <el-form-item label="任务名称" prop="jobName">
          <el-input v-model="addFormData.jobName" placeholder="请输入任务名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="任务脚本" prop="projectInfoId">
          <el-select
            v-model="addFormData.projectInfoId"
            size="small"
            filterable
            remote
            clearable
            reserve-keyword
            :remote-method="getTaskList"
            :loading="taskListLoading"
            @change="taskChange"
            placeholder="请输入关键字">
            <el-option
              v-for="item in taskList"
              :key="item.value"
              :label="item.taskName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行环境" prop="execEnv">
          <el-select v-model="addFormData.execEnv" clearable placeholder="请选择执行环境">
            <el-option
              v-for="item in execEnvList"
              :key="item.value"
              :label="item.envName"
              :value="item.envName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="定时时间" prop="jobCron">
          <el-popover v-model="cronPopover">
            <cron @change="changeCron" @close="cronPopover=false" i18n="cn"></cron>
            <el-input slot="reference" @click="cronPopover=true" v-model="addFormData.jobCron" placeholder="请输入定时时间"></el-input>
          </el-popover>
        </el-form-item>
        <el-form-item label="负责人" prop="adminName">
          <el-input v-model="addFormData.adminName" placeholder="多位负责人英文逗号分隔" clearable></el-input>
        </el-form-item>
        <el-form-item label="失败重试" prop="executorFailRetryCount">
          <el-input v-model="addFormData.executorFailRetryCount" placeholder="请输入失败重试次数" clearable></el-input>
        </el-form-item>
        <el-form-item label="任务备注" prop="jobRemark">
          <el-input type="textarea" v-model="addFormData.jobRemark" placeholder="请输入任务备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" style="width: 100%" @click="save">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { cron } from 'vue-cron'
import mixin from '@/mixins/mixin'
export default {
  components: { Pagination, cron },
  mixins: [mixin],
  data () {
    return {
      searchData: {
        page: 1,
        pageSize: 10,
        keywords: '',
        infoId: '',
        status: ''
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      handleType: 'add',
      showDialog: false,
      taskList: [],
      taskListLoading: false,
      execEnvList: [],
      cronPopover: false,
      addFormData: {
        jobName: '',
        jobCron: '',
        execEnv: '',
        projectInfoId: '',
        adminName: '',
        executorFailRetryCount: '',
        jobRemark: ''
      },
      rules: {
        jobName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
        jobCron: [
          { required: true, message: '请输入定时时间', trigger: 'change' },
        ],
        execEnv: [
          { required: true, message: '请选择执行环境', trigger: 'change' },
        ],
        projectInfoId: [
          { required: true, message: '请选择任务脚本', trigger: 'change' },
        ],
        adminName: [
          { required: true, message: '请输入负责人', trigger: 'blur' },
        ],
        executorFailRetryCount: [
          { required: true, message: '请输入失败重试次数', trigger: 'blur' },
        ]
      },
      saveLoading: false,
      editId: ''
    }
  },
  methods: {
    handleExecute (row) {
      this.$service.scheduleTrigger({ scheduleId: row.id }).then(() => {
        this.$message.success('执行成功')
      })
    },
    switchChanged(row) {
      this.$service.scheduleChangeStatus({
        scheduleId: row.id,
        status: row.triggerStatus ? 1 : 0
      }).then(() => {
        this.$message.success('状态修改成功')
      }).finally(() => {
        this.getTableData()
      })
    },
    goReport () {
      this.$router.push('/timedTask/report')
    },
    getTaskList (query) {
      if (query !== '') {
        this.taskListLoading = true
        this.$service.getTaskList({ keywords: query }).then(res => {
          this.taskList = res.data
          this.taskListLoading = false
        })
      } else {
        this.taskList = []
      }
    },
    taskChange (value) {
      this.addFormData.execEnv = ''
      this.execEnvList = []
      this.addFormData.adminName = ''
      this.taskList.forEach(item => {
        if (item.id === value) {
          this.execEnvList = [...JSON.parse(item.envName)]
          this.$set(this.addFormData, 'adminName', item.adminName)
        }
      })
    },
    changeCron(val){
      this.addFormData.jobCron = val
    },
    resetAddForm () {
      this.$refs['ruleForm'].resetFields()
      this.taskList = []
      this.execEnvList = []
      this.addFormData = {
        jobName: '',
        jobCron: '',
        execEnv: '',
        projectInfoId: '',
        adminName: '',
        executorFailRetryCount: '',
        jobRemark: ''
      }
    },
    handleAdd () {
      this.handleType = 'add'
      this.showDialog = true
    },
    handleEdit (row) {
      this.handleType = 'edit'
      this.showDialog = true
      this.editId = row.id
      this.$service.getScheduleInfo({ configInfoId: row.projectInfoId }).then(res => {
        this.taskList = [res.data]
        this.execEnvList = JSON.parse(res.data.envName)
      })
      Object.keys(this.addFormData).forEach((key) => { this.addFormData[key] = row[key] })
    },
    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.handleType === 'add') {
            this.$service.addSchedule(this.addFormData).then(() => {
              this.$message.success('新增成功')
              this.showDialog = false
              this.getTableData()
            }).finally(() => {
              this.saveLoading = false
            })
          } else if (this.handleType === 'edit') {
            this.$service.editSchedule({ ...this.addFormData, id: this.editId }).then(() => {
              this.$message.success('编辑成功')
              this.showDialog = false
              this.getTableData()
            }).finally(() => {
              this.saveLoading = false
            })
          }
        }
      })
    },
    handleDel (row) {
      this.$msgbox.confirm('确认删除此数据?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.delSchedule({ scheduleId: row.id }).then(() => {
          this.$message.success('删除成功')
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
      this.$service.getScheduleList(params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>