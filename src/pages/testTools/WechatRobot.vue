<style lang="scss">
.page-wechatRobot {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
  .el-dialog__wrapper {
    .el-input,
    .el-date-editor.el-input,
    .el-select {
      width: 200px;
    }
  }
}
</style>
<template>
  <div class="page page-wechatRobot">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <label>状态</label>
      <el-select v-model="searchData.isEnable" clearable class="width80">
        <el-option label="停用" :value="0"></el-option>
        <el-option label="启用" :value="1"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-button type="info" size="small" @click="showRobotList">机器人列表</el-button>
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
        <el-table-column prop="projectName" label="项目名称" align="center"></el-table-column>
        <el-table-column prop="isEnable" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isEnable === 0" type="danger" size="small" effect="plain">停用</el-tag>
            <el-tag v-if="scope.row.isEnable === 1" type="success" size="small" effect="plain">启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="projectRemark" label="备注" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="" label="操作" width="320" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row)">删除</el-button>
            <el-button
              :type="scope.row.isEnable === 1 ? 'danger' : 'success'"
              size="small"
              plain
              @click="switchChange(scope.row)">
              {{scope.row.isEnable === 1 ? '停用' : '启用'}}
            </el-button>
            <el-button type="success" size="mini" @click="configRobot(scope.row)">配置机器人</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"></Pagination>
    <el-dialog :title="handleType === 'add' ? '新增项目' : '修改项目'"
      :visible.sync="showDialog.project"
      center
      width="340px"
      @close="reset">
      <el-form ref="ruleForm" :model="addFormData" :inline="true" label-width="80px">
        <el-form-item label="项目名称">
          <el-input v-model="addFormData.projectName" placeholder="请输入项目名称"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addFormData.projectRemark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.project" type="primary" style="width: 100%" @click="save">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="机器人列表"
      class="big-dialog"
      :visible.sync="showDialog.allRobot"
      center
      width="700px">
      <div class="page-search-bar">
        <label>关键字</label>
        <el-input
          v-model="searchRobotData.keywords"
          placeholder="请输入关键字"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchRobot"></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchRobot">搜索</el-button>
        <el-button type="success" size="small" icon="el-icon-plus" @click="handleAddRobot">新增</el-button>
      </div>
      <div class="table-box">
        <el-table
          v-loading="loading.allRobot"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#FFFAFA)"
          :data="allRobotList"
          border
          style="width: 100%">
          <el-table-column prop="robotName" label="机器人名称" align="center"></el-table-column>
          <el-table-column prop="robotUrl" label="url" align="center"></el-table-column>
          <el-table-column prop="robotRemark" label="备注" align="center"></el-table-column>
          <el-table-column prop="" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleEditRobot(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog :title="handleRobotType === 'add' ? '新增机器人' : '修改机器人'"
      :visible.sync="showDialog.addRobot"
      center
      width="320px"
      @close="resetRobot">
      <el-form ref="robotForm" :model="addRobotFormData" :rules="robotRules" :inline="true" label-width="60px">
        <el-form-item label="名称" prop="robotName">
          <el-input v-model="addRobotFormData.robotName" placeholder="请输入名称"></el-input>
        </el-form-item>
        <el-form-item label="url" prop="robotUrl">
          <el-input v-model="addRobotFormData.robotUrl" placeholder="请输入url"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addRobotFormData.robotRemark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.addRobot" type="primary" style="width: 100%" @click="addRobotSave">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="机器人配置"
      class="big-dialog"
      :visible.sync="showDialog.configRobot"
      center
      width="340px">
      <div class="table-box">
        <el-table
          ref="configRobotTable"
          :data="allRobotList"
          border
          style="width: 100%"
          @selection-change="handleRobotChange">
          <el-table-column type="selection" align="center" width="60"></el-table-column>
          <el-table-column prop="robotName" label="机器人名称" align="center"></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.configRobot" type="primary" style="width: 100%" @click="configRobotSave">提交</el-button>
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
        keywords: '',
        isEnable: ''
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      addFormData: {
        projectName: '',
        projectRemark: ''
      },
      showDialog: {
        project: false,
        allRobot: false,
        addRobot: false,
        configRobot: false
      },
      loading: {
        project: false,
        allRobot: false,
        addRobot: false,
        configRobot: false
      },
      handleType: '',
      editId: '',
      searchRobotData: {
        keywords: '',
        isDel: ''
      },
      allRobotList: [],
      handleRobotType: '',
      addRobotFormData: {
        robotName: '',
        robotUrl: '',
        robotRemark: ''
      },
      robotRules: {
        robotName: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        robotUrl: [
          { required: true, message: '请输入url', trigger: 'blur' },
        ]
      },
      editRobotId: '',
      checkedRobotList: [],
      configRobotId: ''
    }
  },
  methods: {
    // 所有机器人
    showRobotList () {
      this.showDialog.allRobot = true
      this.searchRobot()
    },
    searchRobot () {
      this.$service.getAllRobot(this.searchRobotData).then(res => {
        this.allRobotList = res.data
      })
    },
    handleAddRobot () {
      this.handleRobotType = 'add'
      this.showDialog.addRobot = true
    },
    handleEditRobot (row) {
      this.handleRobotType = 'edit'
      this.editRobotId = row.id
      Object.keys(this.addRobotFormData).forEach(key => { this.addRobotFormData[key] = row[key] })
      this.showDialog.addRobot = true
    },
    addRobotSave () {
      this.$refs['robotForm'].validate((valid) => {
        if (valid) {
          this.loading.addRobot = true
          if (this.handleRobotType === 'add') {
            this.$service.addRobot(this.addRobotFormData).then(() => {
              this.$message.success('新增成功')
              this.showDialog.addRobot = false
              this.searchRobot()
            }).finally(() => {
              this.loading.addRobot = false
            })
          } else if (this.handleRobotType === 'edit') {
            this.$service.updateRobot({ ...this.addRobotFormData, id: this.editRobotId }).then(() => {
              this.$message.success('修改成功')
              this.showDialog.addRobot = false
              this.searchRobot()
            }).finally(() => {
              this.loading.addRobot = false
            })
          }
        }
      })
    },
    resetRobot () {
      this.$refs['robotForm'].resetFields()
      this.addRobotFormData = {
        robotName: '',
        robotUrl: '',
        robotRemark: ''
      }
    },
    // 项目机器人
    configRobot (row) {
      this.checkedRobotList = []
      this.configRobotId = row.id
      this.$service.getAllRobot().then(result => {
        this.allRobotList = result.data
        this.$service.getRobotByProject({ projectId: row.id}).then(res => {
          if (res.data.length) {
            res.data.forEach(item => {
              let index = this.allRobotList.findIndex(i => i.id === item.id)
              if (index > -1) {
                this.$refs['configRobotTable'].toggleRowSelection(this.allRobotList[index], true)
              }
            })
            this.checkedRobotList = res.data
          }
        })
      })
      this.showDialog.configRobot = true
    },
    handleRobotChange (val) {
      this.checkedRobotList = val
    },
    configRobotSave () {
      if (this.checkedRobotList.length === 0) {
        this.$message.error('未选择机器人')
        return
      }
      let robotIdList = []
      this.checkedRobotList.forEach(item => {
        robotIdList.push(item.id)
      })
      this.loading.configRobot = true
      this.$service.relRobot({ projectId: this.configRobotId, robotIdList }).then(() => {
        this.$message.success('配置成功')
        this.showDialog.configRobot = false
      }).finally(() => {
        this.loading.configRobot = false
      })
    },
    // 停用/启用
    switchChange (row) {
      this.$service.updateRobotProject({
        id: row.id,
        isEnable: row.isEnable === 0 ? 1 : 0
      }).then(() => {
        this.$message.success(row.isEnable === 0 ? '启用成功' : '停用成功')
        this.getTableData()
      })
    },
    // 新增项目
    handleAdd () {
      this.handleType = 'add'
      this.showDialog.project = true
    },
    // 删除项目
    handleDel (row) {
      this.$msgbox.confirm('是否确认此项目?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.delRobotProject({ projectId: row.id }).then(() => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      })
    },
    // 修改项目
    handleEdit (row) {
      this.handleType = 'edit'
      this.editId = row.id
      Object.keys(this.addFormData).forEach(key => { this.addFormData[key] = row[key] })
      this.showDialog.project = true
    },
    save () {
      if (!this.addFormData.projectName) {
        this.$message.error('项目名称不能为空')
        return
      }
      this.loading.project = true
      if (this.handleType === 'add') {
        this.$service.addRobotProject({ ...this.addFormData, isEnable: 1 }).then(() => {
          this.$message.success('新增成功')
          this.showDialog.project = false
          this.getTableData()
        }).finally(() => {
          this.loading.project = false
        })
      } else if (this.handleType === 'edit') {
        this.$service.updateRobotProject({ ...this.addFormData, id: this.editId }).then(() => {
          this.$message.success('修改成功')
          this.showDialog.project = false
          this.getTableData()
        }).finally(() => {
          this.loading.project = false
        })
      }
    },
    reset () {
      this.editId = ''
      this.addFormData = {
        projectName: '',
        projectRemark: '',
        isEnable: 1
      }
    },
    // 获取表格数据
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      params.size = params.pageSize
      delete params.pageSize
      this.tableLoading = true
      this.$service.listRobotProject(params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>