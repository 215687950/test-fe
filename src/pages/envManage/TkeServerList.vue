<style lang="scss">
.page-tkeServerList {
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
    .el-textarea__inner {
      width: 520px;
    }
  }
}
</style>
<template>
  <div class="page page-tkeServerList">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <label>服务状态</label>
      <el-select v-model="searchData.serverStatus" clearable placeholder="请选择状态">
        <el-option v-for="item in statusArray" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="showDialog('add')">新增</el-button>
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
        <el-table-column prop="id" label="id" align="center" width="60" fixed></el-table-column>
        <el-table-column prop="serverName" label="服务名称" align="center" width="200" fixed></el-table-column>
        <el-table-column prop="intke" label="Tke内访问" align="center" width="200"></el-table-column>
        <el-table-column prop="outtke" label="Tke外访问" align="center" width="100"></el-table-column>
        <el-table-column prop="serverStatus" label="状态" align="center" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.serverStatus === 0">停用</span>
            <span v-if="scope.row.serverStatus === 1">启用</span>
          </template>
        </el-table-column>
        <el-table-column prop="serverPort" label="端口" align="center" width="100"></el-table-column>
        <el-table-column prop="devCharge" label="开发负责人" align="center" width="100"></el-table-column>
        <el-table-column prop="opsCharge" label="运维负责人" align="center" width="100"></el-table-column>
        <el-table-column prop="serverDesc" label="服务描述" align="center" width="300"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="200">
          <template slot-scope="scope">
            {{$utils.formatDate(
              scope.row.createTime.length === 10 ?
              scope.row.createTime * 1000 :
              scope.row.createTime,
              'yyyy-MM-dd hh:mm:ss'
            )}}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center" width="200">
          <template slot-scope="scope">
            {{$utils.formatDate(
              scope.row.createTime.length === 10 ?
              scope.row.createTime * 1000 :
              scope.row.createTime,
              'yyyy-MM-dd hh:mm:ss'
            )}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button type="primary" size="small" plain @click="showDialog('edit', scope.row)">编辑</el-button>
            <el-button
              :type="scope.row.serverStatus === 1 ? 'danger' : 'success'"
              size="small"
              plain
              @click="switchChange(scope.row)">
              {{scope.row.serverStatus === 1 ? '停用' : '启用'}}
            </el-button>
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
      center
      :title="dialogType === 'add' ? '新增服务' : '编辑服务'"
      :visible.sync="isShowDialog"
      width="690px"
      @close="reset">
      <el-form ref="ruleForm" :model="dialogData" :rules="rules" :inline="true" label-width="110px">
        <el-form-item label="服务名称" prop="serverName">
          <el-input v-model="dialogData.serverName" clearable placeholder="请输入服务名称"></el-input>
        </el-form-item>
        <el-form-item label="服务端口" prop="serverPort">
          <el-input v-model="dialogData.serverPort" clearable placeholder="请输入服务端口"></el-input>
        </el-form-item>
        <el-form-item label="开发负责人" prop="devCharge">
          <el-input v-model="dialogData.devCharge" clearable placeholder="请输入开发负责人"></el-input>
        </el-form-item>
        <el-form-item label="运维负责人" prop="opsCharge">
          <el-input v-model="dialogData.opsCharge" clearable placeholder="请输入运维负责人"></el-input>
        </el-form-item>
        <el-form-item label="内部访问类型" prop="intke">
          <el-select v-model="dialogData.intke" clearable placeholder="请选择内部类型">
            <el-option v-for="item in innerTypeArray" :key="item.key" :label="item.value" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="外部访问类型" prop="outtke">
          <el-select v-model="dialogData.outtke" clearable placeholder="请选择外部类型">
            <el-option v-for="item in outerTypeArray" :key="item.key" :label="item.value" :value="item.key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务备注" prop="serverDesc">
          <el-input v-model="dialogData.serverDesc" :autosize="{minRows: 2}" type="textarea" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          :loading="saveLoading"
          type="primary"
          size="small"
          style="width:100%"
          @click="handleSave">提 交</el-button>
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
        keywords: '',
        serverStatus: '',
        page: 1,
        pageSize: 10
      },
      statusArray: [
        { id: 0, name: '停用' },
        { id: 1, name: '启用' },
      ],
      tableHeight: null,
      tableLoading: false,
      tableData: [],
      total: 0,
      isShowDialog: false,
      dialogType: '',
      dialogData: {
        serverName: '',
        intke: '',
        outtke: '',
        serverPort: '',
        devCharge: '',
        opsCharge: '',
        serverDesc: ''
      },
      rules: {
        serverName: [
          { required: true, message: '请输入服务名称', trigger: 'blur' },
        ],
        intke: [
          { required: true, message: '请选择内部访问类型', trigger: 'change' },
        ],
        outtke: [
          { required: true, message: '请选择外部访问类型', trigger: 'change' },
        ],
        serverPort: [
          { required: true, message: '请输入服务端口', trigger: 'blur' },
        ],
        devCharge: [
          { required: true, message: '请输入开发负责人', trigger: 'blur' },
        ],
        opsCharge: [
          { required: true, message: '请输入运维负责人', trigger: 'blur' },
        ],
        serverDesc: [
          { required: true, message: '请输入备注', trigger: 'blur' },
        ]
      },
      innerTypeArray: [
        { key: '1', value: 'K8S内部域名' },
        { key: '2', value: 'ServiceName' },
      ],
      outerTypeArray: [
        { key: '1', value: '禁止' },
        { key: '2', value: 'Ingress' },
      ],
      editId: '',
      saveLoading: false
    }
  },
  methods: {
    showDialog (type, row) {
      this.dialogType = type
      this.isShowDialog = true
      if (type === 'edit') {
        let rowCopy = JSON.parse(JSON.stringify(row))
        Object.keys(this.dialogData).forEach( key => { this.dialogData[key] = rowCopy[key]})
        this.editId = rowCopy.id
      }
    },
    handleSave () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = {}
          let method = ''
          if (this.dialogType === 'add') {
            params = { ...this.dialogData }
            method = 'addTkeProject'
          } else {
            params = { ...this.dialogData, id: this.editId }
            method = 'updateTkeProject'
          }
          this.saveLoading = true
          this.$service[method](params).then(() => {
            this.$message.success(this.dialogType === 'add' ? '新增成功' : '编辑成功')
            this.isShowDialog = false
            this.reset()
            this.getTableData()
          }).finally(() => {
            this.saveLoading = false
          })
        }
      })
    },
    reset () {
      this.$refs['ruleForm'].resetFields()
      this.dialogData = {
        serverName: '',
        intke: '',
        outtke: '',
        serverPort: '',
        devCharge: '',
        opsCharge: '',
        serverDesc: ''
      }
    },
    // 停用/启用
    switchChange (row) {
      this.$service.updateTkeProject({
        id: row.id,
        serverStatus: row.serverStatus === 0 ? 1 : 0
      }).then(() => {
        this.$message.success(row.serverStatus === 0 ? '启用成功' : '停用成功')
        this.getTableData()
      })
    },
    // 获取表格数据
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      params.size = params.pageSize
      delete params.pageSize
      this.tableLoading = true
      this.$service.getTkeServerList(params).then(res => {
        this.tableData = res.data.projectList
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>