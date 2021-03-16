<style lang="scss">
.page-EtcdBackManage {
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
    .el-form-item {
      margin-bottom: 6px;
    }
  }
  .syncPathDialog {
    .el-input,
    .el-date-editor.el-input,
    .el-select {
      width: 305px;
    }
  }
}
</style>
<template>
  <div class="page page-EtcdBackManage">
    <div class="page-search-bar">
      <el-button type="success" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-button type="info" size="small" @click="syncPath">同步路径</el-button>
      <el-button type="info" size="small" @click="syncEnv">同步新环境</el-button>
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
        <el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column prop="completeName" label="环境名称" align="center"></el-table-column>
        <el-table-column prop="nameSpace" label="nameSpace" align="center"></el-table-column>
        <el-table-column prop="type" label="类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 0">模版</span>
            <span v-if="scope.row.type === 1">普通环境</span>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="etcd地址" align="center" min-width="200"></el-table-column>
        <el-table-column prop="remark" label="备注" align="center"></el-table-column>
        <el-table-column prop="" label="操作" width="430" align="center">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="handleDel(scope.row)">删除</el-button>
            <el-button type="primary" size="mini" @click="handleGetSettingFromEnv(scope.row.id)">数据备份</el-button>
            <el-button type="primary" size="mini" @click="handleRollBackFromDb(scope.row.id)">数据恢复</el-button>
            <el-button type="primary" size="mini" @click="handleDeleteEnvSetting(scope.row.id)">数据删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="handleType === 'add' ? '新增' : '编辑'"
      :visible.sync="showDialog"
      center
      width="650px"
      @close="resetAddForm">
      <el-form ref="ruleForm" :model="addFormData" :inline="true" label-width="88px">
        <el-form-item label="环境名称" prop="completeName">
          <el-input v-model="addFormData.completeName" placeholder="请输入环境名称"></el-input>
        </el-form-item>
        <el-form-item label="环境类型" prop="type">
          <el-select v-model="addFormData.type">
            <el-option label="模版" :value="0"></el-option>
            <el-option label="普通环境" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="nameSpace" prop="nameSpace">
          <el-input v-model="addFormData.nameSpace" placeholder="请输入nameSpace"></el-input>
        </el-form-item>
        <el-form-item label="etcd地址" prop="url">
          <el-input v-model="addFormData.url" placeholder="请输入etcd地址"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addFormData.remark" placeholder="请输入备注" style="width:500px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" style="width: 100%" @click="save">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="同步路径下的配置"
      class="big-dialog syncPathDialog"
      :visible.sync="showSyncPathDialog"
      center
      width="490px">
      <el-form v-model="syncPathData" label-width="100px">
        <el-form-item label="同步配置路径">
          <el-input v-model="syncPathData.keyNameList" placeholder="例：/config/test/"></el-input>
          <el-tooltip class="item" effect="dark" placement="right-start" style="margin-left:10px">
            <div slot="content">
              请正确输入同步文件的路径。
              <br />/config/test/ 将会同步 /config/test/ 路径下所有key
              <br />/config/test 将会同步 /config/ 路径下前缀为 test的所有key
              <br />
            </div>
            <i class="el-icon-question" style="color:#FFA500; font-size:16px"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="源环境">
          <el-select
            v-model="syncPathData.sourceEnv"
            placeholder="请选择源环境"
            clearable>
            <template v-for="item in tableData">
              <el-option
                v-if="item.type === 0"
                :key="item.id"
                :label="item.completeName"
                :value="item.id"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="目标环境">
          <el-select
            v-model="syncPathData.targetEnvList"
            placeholder="请选择目标环境"
            multiple
            clearable>
            <el-option
              v-for="item in tableData"
              :key="item.id"
              :label="item.completeName"
              :value="item.id"
              :disabled="item.id === syncPathData.sourceEnv"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求方">
          <el-input v-model="syncPathData.demand" placeholder="请输入需求方"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="syncPathData.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="作为前缀同步">
          <el-switch
            v-model="syncPathData.prefixFlag"
            active-color="#13ce66"
            inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="syncPathLoading" type="primary" style="width: 100%" @click="syncPathSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="同步新环境"
      :visible.sync="showSyncEnvDialog"
      center
      width="350px">
      <el-form :model="syncEnvData" :inline="true" label-width="88px">
        <el-form-item label="targetUrl">
          <el-input v-model="syncEnvData.targetUrl" placeholder="请输入targetUrl"></el-input>
        </el-form-item>
        <el-form-item label="nameSpace">
          <el-input v-model="syncEnvData.nameSpace" placeholder="请输入nameSpace"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="syncEnvLoading" type="primary" style="width: 100%" @click="syncEnvSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      handleType: 'add',
      showDialog: false,
      addFormData: {
        completeName: '',
        type: '',
        nameSpace: '',
        url: '',
        remark: '',
      },
      saveLoading: false,
      editId: '',
      showSyncPathDialog: false,
      syncPathData: {
        keyNameList: '',
        sourceEnv: '',
        targetEnvList: [],
        demand: '',
        remark: '',
        prefixFlag: true
      },
      syncPathLoading: false,
      showSyncEnvDialog: false,
      syncEnvData: {
        targetUrl: '',
        nameSpace: ''
      },
      syncEnvLoading: false
    }
  },
  mounted () {
    this.tableHeight = this.$refs['table-box'].offsetHeight
    window.onresize = () => {
      this.tableHeight = this.$refs['table-box'].offsetHeight
    }
    this.getTableData()
  },
  methods: {
    syncEnv () {
      this.syncEnvData = {
        targetUrl: '',
        nameSpace: ''
      }
      this.showSyncEnvDialog = true
    },
    syncEnvSubmit () {
      this.syncEnvLoading = true
      this.$service.etcdTemplateCopy(this.syncEnvData).then(() => {
        this.$message.success('同步成功')
      }).finally(() => {
        this.syncEnvLoading = false
      })
    },
    // 数据备份
    handleGetSettingFromEnv (id) {
      this.$service.getSettingFromEnv({env: id}).then(() => {
        this.$message.success('数据备份成功')
      })
    },
    // 数据恢复
    handleRollBackFromDb (id) {
      this.$msgbox.confirm('确认恢复?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.rollBackFromDb({env: id}).then(() => {
          this.$message.success('数据恢复成功')
        })
      })
    },
    // 数据删除
    handleDeleteEnvSetting (id) {
      this.$msgbox.confirm('确认删除?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.deleteEnvSetting({env: id}).then(() => {
          this.$message.success('数据删除成功')
        })
      })
    },
    // 同步路径
    syncPath () {
      this.syncPathData = {
        keyNameList: '',
        sourceEnv: '',
        targetEnvList: [],
        demand: '',
        remark: '',
        prefixFlag: true
      }
      this.showSyncPathDialog = true
    },
    syncPathSubmit () {
      this.$msgbox.confirm('将同步该路径下全部配置内容且无法回滚, 是否继续?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        let params = JSON.parse(JSON.stringify(this.syncPathData))
        params.keyNameList = [params.keyNameList]
        this.syncPathLoading = true
        this.$service.etcdTemplateSynchronization(params).then(() => {
          this.$message.success('路径同步成功')
          this.showSyncPathDialog = false
        }).finally(() => {
          this.syncPathLoading = false
        })
      })
    },
    handleAdd () {
      this.handleType = 'add'
      this.showDialog = true
    },
    resetAddForm () {
      this.addFormData = {
        completeName: '',
        type: '',
        nameSpace: '',
        url: '',
        remark: '',
      }
    },
    handleEdit (row) {
      this.handleType = 'edit'
      this.showDialog = true
      this.editId = row.id
      Object.keys(this.addFormData).forEach((key) => { this.addFormData[key] = row[key] })
    },
    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.handleType === 'add') {
            this.$service.addEtcdEnv(this.addFormData).then(() => {
              this.$message.success('新增成功')
              this.showDialog = false
              this.getTableData()
            }).finally(() => {
              this.saveLoading = false
            })
          } else if (this.handleType === 'edit') {
            this.$service.updateEtcdEnv({ ...this.addFormData, id: this.editId }).then(() => {
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
      this.$msgbox.confirm('确认删除?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.deleteEtcdEnv({ id: row.id }).then(() => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      })
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.getEtcdEnv().then(res => {
        this.tableData = res.data
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>