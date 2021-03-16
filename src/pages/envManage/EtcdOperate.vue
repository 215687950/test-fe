<style lang="scss">
.page-etcdSettingOperate {
  .page-search-bar {
    .env-select {
      .el-input {
        width: 823px !important;
      }
    }
  }
  .table-box {
    flex: 1;
    overflow: hidden;
  }
  .el-dialog__wrapper {
    .el-row {
      display: flex;
    }
    .el-form-item {
      margin-bottom: 6px;
    }
    .el-input,
    .el-date-editor.el-input,
    .el-select {
      width: 305px;
    }
  }
}
</style>
<template>
  <div class="page page-etcdSettingOperate">
    <div class="page-search-bar">
      <label>环境</label>
      <el-select
        class="env-select"
        v-model="selectedEnv"
        multiple
        clearable
        placeholder="请选择环境"
      >
        <el-option
          v-for="item in envList"
          :key="item.id"
          :label="item.completeName"
          :value="item.id"
        ></el-option>
      </el-select>
    </div>
    <div class="page-search-bar">
      <label>keyName</label>
      <el-input
        v-model="keyName"
        clearable
        placeholder="请输入keyName"
        style="width:260px"
        @keyup.enter.native="search"></el-input>
      <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
      <el-button type="info" size="small" v-if="superPermission" @click="add">新增配置</el-button>
      <el-button type="info" size="small" v-if="superPermission" @click="editPath">修改路径</el-button>
      <el-button type="info" size="small" v-if="superPermission" @click="syncPath">同步路径</el-button>
      <el-button type="info" size="small" @click="editWhiteList">修改白名单</el-button>
      <el-button type="info" size="small" v-if="superPermission" @click="handleExport">导入</el-button>
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
        <el-table-column prop="envName" label="环境" width="120" align="center"></el-table-column>
        <el-table-column prop="keyName" label="key" width="300"></el-table-column>
        <el-table-column prop="setting" label="配置">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">{{ scope.row.setting }}</div>
              <div style="width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{ scope.row.setting }}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="light" content="查看" placement="top">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="handleView(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="编辑" placement="top">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  v-if="superPermission"
                  @click="handleEdit(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除" placement="top">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  v-if="superPermission"
                  @click="handleDel(scope.row)"
                ></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="'ETCD配置查看：' + viewData.keyName"
      class="big-dialog"
      :visible.sync="showDialog.view"
      center
      width="600px"
      >
      <el-input v-model="viewData.setting" disabled type="textarea" :rows="30"></el-input>
    </el-dialog>
    <el-dialog :title="'ETCD配置修改：' + editData.keyName"
      class="big-dialog"
      :visible.sync="showDialog.edit"
      center
      width="1000px"
      >
      <el-form v-model="editData" label-width="55px">
        <el-row>
          <el-form-item label="需求方">
            <el-input v-model="editData.demand" clearable placeholder="请输入需求方"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input v-model="editData.remark" clearable placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-input v-model="editData.oldSetting" disabled type="textarea" :rows="26" style="margin-right:20px"></el-input>
          <el-input v-model="editData.setting" type="textarea" :rows="26"></el-input>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="dialogSubmitLoading.edit" type="primary" style="width: 100%" @click="editSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="删除配置"
      class="big-dialog"
      :visible.sync="showDialog.delete"
      center
      width="405px"
      >
      <div style="margin: 10px 0">删除【{{deleteData.envName}}】下的：{{deleteData.keyName}}</div>
      <el-form v-model="deleteData" label-width="55px">
        <el-form-item label="需求方">
          <el-input v-model="deleteData.demand" clearable placeholder="请输入需求方"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="deleteData.remark" clearable placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="dialogSubmitLoading.delete" type="primary" style="width: 100%" @click="deleteSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增配置"
      class="big-dialog"
      :visible.sync="showDialog.add"
      center
      width="800px">
      <el-form v-model="addData" label-width="70px">
        <el-row>
          <el-form-item label="环境" prop="targetEnv">
            <el-select
              v-model="addData.targetEnv"
              placeholder="请选择环境"
              multiple
              clearable>
              <el-option
                v-for="item in envList"
                :key="item.id"
                :label="item.completeName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="key" prop="keyName">
            <el-input v-model="addData.keyName" clearable placeholder="请输入keyName"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="需求方" prop="demand">
            <el-input v-model="addData.demand" clearable placeholder="请输入需求方"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input v-model="addData.remark" clearable placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="配置内容" prop="setting">
          <el-input v-model="addData.setting" type="textarea" :rows="20" placeholder="请输入配置内容"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="dialogSubmitLoading.add" type="primary" style="width: 100%" @click="addSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="配置路径修改"
      class="big-dialog"
      :visible.sync="showDialog.editPath"
      center
      width="420px">
      <el-form v-model="editPathData" label-width="70px" label-position="left">
        <el-form-item label="环境">
          <el-select
            v-model="editPathData.sourceEnv"
            placeholder="请选择环境"
            clearable>
            <el-option
              v-for="item in envList"
              :key="item.id"
              :label="item.completeName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="原路径">
          <el-input v-model="editPathData.prefixPath" placeholder="请输入原路径"></el-input>
        </el-form-item>
        <el-form-item label="目标路径">
          <el-input v-model="editPathData.newPath" placeholder="请输入目标路径"></el-input>
        </el-form-item>
        <el-form-item label="是否删除">
          <el-switch
            v-model="editPathData.deleteFlag"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeDeleteType"></el-switch>
        </el-form-item>
        <el-form-item label="需求方">
          <el-input v-model="editPathData.demand" placeholder="请输入需求方"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editPathData.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="dialogSubmitLoading.editPath" type="primary" style="width: 100%" @click="editPathSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="同步路径下的配置"
      class="big-dialog"
      :visible.sync="showDialog.syncPath"
      center
      width="490px">
      <el-form v-model="syncPathData" label-width="100px">
        <el-form-item label="同步配置路径">
          <el-input v-model="syncPathData.path" placeholder="例：/config/test/"></el-input>
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
            <el-option
              v-for="item in envList"
              :key="item.id"
              :label="item.completeName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="目标环境">
          <el-select
            v-model="syncPathData.targetEnv"
            placeholder="请选择目标环境"
            multiple
            clearable>
            <el-option
              v-for="item in envList"
              :key="item.id"
              :label="item.completeName"
              :value="item.id"
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
        <el-form-item label="替换env内容">
          <el-switch
            v-model="syncPathData.replaceFlag"
            active-color="#13ce66"
            inactive-color="#ff4949"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="dialogSubmitLoading.syncPath" type="primary" style="width: 100%" @click="syncPathSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改测试白名单"
      class="big-dialog"
      :visible.sync="showDialog.whiteList"
      center
      width="420px">
      <el-form v-model="whiteListData" label-width="68px">
        <el-form-item label="环境">
          <el-select
            v-model="whiteListData.targetEnv"
            placeholder="请选择环境"
            multiple
            clearable>
            <el-option
              v-for="item in envList"
              :key="item.id"
              :label="item.completeName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="whiteListData.phone" clearable placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="whiteListData.name" clearable placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="一级部门">
          <el-input v-model="whiteListData.level1" clearable placeholder="例：微拍堂研发中心"></el-input>
        </el-form-item>
        <el-form-item label="二级部门">
          <el-input v-model="whiteListData.level2" clearable placeholder="例：测试部"></el-input>
        </el-form-item>
        <el-form-item label="三级部门">
          <el-input v-model="whiteListData.level3" clearable placeholder="例：测试四组"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="dialogSubmitLoading.whiteList" type="primary" style="width: 100%" @click="whiteListSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="从文件导入etcd配置"
      class="big-dialog"
      :visible.sync="showDialog.export"
      center
      width="420px">
      <el-form v-model="exportData" label-width="68px">
        <el-form-item label="环境">
          <el-select
            v-model="exportData.targetEnv"
            placeholder="请选择环境"
            multiple
            clearable>
            <el-option
              v-for="item in envList"
              :key="item.id"
              :label="item.completeName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="文件夹名">
          <el-input v-model="exportData.filePath" clearable placeholder="例：etcdkeys"></el-input>
        </el-form-item>
        <el-form-item label="需求方">
          <el-input v-model="exportData.demand" clearable placeholder="例：张三"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="exportData.remark" clearable placeholder="例：备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="dialogSubmitLoading.export" type="primary" style="width: 100%" @click="exportSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      envList: [],
      envIds: [],
      selectedEnv: [],
      keyName: '/micro-services/wpt.api.uc/config/login/noLandingMobile',
      tableLoading: false,
      tableData: [],
      tableHeight: null,
      showDialog: {
        view: false,
        edit: false,
        delete: false,
        add: false,
        editPath: false,
        syncPath: false,
        whiteList: false,
        export: false
      },
      dialogSubmitLoading: {
        edit: false,
        delete: false,
        add: false,
        editPath: false,
        syncPath: false,
        whiteList: false,
        export: false
      },
      viewData: {},
      editData: {
        targetEnv: [],
        keyName: '',
        demand: '',
        remark: '',
        oldSetting: '',
        setting: ''
      },
      deleteData: {
        env: '',
        envName: '',
        keyName: '',
        demand: '',
        remark: ''
      },
      addData: {
        targetEnv: [],
        keyName: '',
        demand: '',
        remark: '',
        setting: ''
      },
      editPathData: {
        sourceEnv: '',
        prefixPath: '',
        newPath: '',
        deleteFlag: false,
        demand: '',
        remark: ''
      },
      syncPathData: {
        path: '',
        sourceEnv: '',
        targetEnv: [],
        demand: '',
        remark: '',
        prefixFlag: true,
        replaceFlag: true
      },
      whiteListData: {
        targetEnv: [],
        phone: '',
        name: '',
        level1: '',
        level2: '',
        level3: ''
      },
      exportData: {
        targetEnv: [],
        filePath: '',
        demand: '',
        remark: ''
      }
    }
  },
  computed: {
    superPermission () {
      return this.$store.state.permission.includes('/etcdOperate/manage')
    }
  },
  created () {
    this.getEtcdEnv()
  },
  mounted () {
    this.tableHeight = this.$refs['table-box'].offsetHeight
    window.onresize = () => {
      this.tableHeight = this.$refs['table-box'].offsetHeight
    }
  },
  methods: {
    // 导入
    handleExport () {
      this.exportData = {
        targetEnv: [],
        filePath: '',
        demand: '',
        remark: ''
      }
      this.showDialog.export = true
    },
    exportSubmit () {
      this.dialogSubmitLoading.export = true
      this.$service.importEtcdSetting(this.exportData).then(() => {
        this.$message.success('导入成功')
        this.showDialog.export = false
      }).finally(() => {
        this.dialogSubmitLoading.export = false
      })
    },
    // 修改白名单
    editWhiteList () {
      let targetEnv = this.envIds.filter(envId => envId !== 1 && envId !== 10)
      this.whiteListData = {
        targetEnv,
        phone: '',
        name: '',
        level1: '',
        level2: '',
        level3: ''
      }
      this.showDialog.whiteList = true
    },
    whiteListSubmit () {
      for (let [key, value] of Object.entries(this.whiteListData)) {
        if (key === 'targetEnv' && !value.length) {
          this.$message.error('请选择修改的环境')
          return
        } else if (!value) {
          this.$message.error('请填写完整页面数据')
          return
        }
      }
      this.dialogSubmitLoading.whiteList = true
      this.$service.editTestWhiteList(this.whiteListData).then(() => {
        this.$message.success('修改成功')
      }).finally(() => {
        this.dialogSubmitLoading.whiteList = false
      })
    },
    // 同步路径
    syncPath () {
      this.syncPathData = {
        path: '',
        sourceEnv: '',
        targetEnv: [],
        demand: '',
        remark: '',
        prefixFlag: true,
        replaceFlag: true
      }
      this.showDialog.syncPath = true
    },
    syncPathSubmit () {
      let params = this.syncPathData
      if (!params.path) {
        this.$message.error('同步路径不能为空')
        return
      }
      if (!params.sourceEnv || !params.targetEnv.length || params.targetEnv.includes(params.sourceEnv)) {
        this.$message.error('请正确选择环境，且目标环境不能与源环境相同')
        return
      }
      this.$msgbox.confirm('将同步该路径下全部配置内容且无法回滚, 是否继续?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.dialogSubmitLoading.syncPath = true
        this.$service.syncPathKeyToEnv(this.syncPathData).then(() => {
          this.$message.success('路径同步成功')
          this.showDialog.syncPath = false
        }).finally(() => {
          this.dialogSubmitLoading.syncPath = false
        })
      })
    },
    // 修改路径
    editPath () {
      this.editPathData = {
        sourceEnv: '',
        prefixPath: '',
        newPath: '',
        deleteFlag: false,
        demand: '',
        remark: ''
      }
      this.showDialog.editPath = true
    },
    changeDeleteType(bool) {
      this.editPathData.remark = bool ? '删除原数据' : ''
    },
    editPathSubmit () {
      this.dialogSubmitLoading.editPath = true
      this.$service.copyKeyToPath(this.editPathData).then(() => {
        this.$message.success('路径修改成功')
        this.showDialog.editPath = false
      }).finally(() => {
        this.dialogSubmitLoading.editPath = false
      })
    },
    // 新增配置
    add () {
      this.addData = {
        targetEnv: this.envIds,
        keyName: '',
        demand: '',
        remark: '',
        setting: ''
      }
      this.showDialog.add = true
    },
    addSubmit () {
      this.dialogSubmitLoading.add = true
      this.$service.addEtcdKey(this.addData).then(() => {
        this.$message.success('新增配置成功')
        this.showDialog.add = false
      }).finally(() => {
        this.dialogSubmitLoading.add = false
      })
    },
    // 查看
    handleView (row) {
      this.viewData = {
        keyName: row.keyName,
        setting: row.setting
      }
      this.showDialog.view = true
    },
    // 编辑
    handleEdit (row) {
      this.editData = {
        targetEnv: [row.env],
        keyName: row.keyName,
        demand: '',
        remark: '',
        oldSetting: row.setting,
        setting: ''
      }
      this.showDialog.edit = true
    },
    editSubmit () {
      let params = JSON.parse(JSON.stringify(this.editData))
      delete params.oldSetting
      this.dialogSubmitLoading.edit = true
      this.$service.updateEtcdKey(params).then(() => {
        this.$message.success('编辑成功')
        this.showDialog.edit = false
        this.search()
      }).finally(() => {
        this.dialogSubmitLoading.edit = false
      })
    },
    // 删除
    handleDel (row) {
      this.deleteData = {
        env: row.env,
        envName: row.envName,
        keyName: row.keyName,
        demand: '',
        remark: ''
      }
      this.showDialog.delete = true
    },
    deleteSubmit () {
      this.dialogSubmitLoading.delete = true
      this.$service.deleteEtcdKey({
        env: this.deleteData.env,
        targetEnv: [this.deleteData.env],
        keyName: this.deleteData.keyName,
        keyNameList: [this.deleteData.keyName],
        demand: this.deleteData.demand,
        remark: this.deleteData.remark
      }).then(() => {
        this.$message.success('删除成功')
        this.showDialog.delete = false
        this.search()
      }).finally(() => {
        this.dialogSubmitLoading.delete = false
      })
    },
    // 获取表格数据
    search () {
      this.tableLoading = true
      this.$service.getEtcdKey({
        targetEnv: this.selectedEnv,
        keyNameList: this.keyName
      }).then(res => {
        this.tableData = res.data
      }).catch(() => {
        this.tableData = []
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 获取环境
    getEtcdEnv () {
      this.$service.getEtcdEnv().then(res => {
        this.envList = res.data
        let envIds = []
        res.data.forEach(item => {
          envIds.push(item.id)
        })
        this.envIds = envIds
        this.selectedEnv = envIds
      })
    }
  }
}
</script>