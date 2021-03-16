<style lang="scss">
.page-etcdPermission {
  .width80 .el-input {
      width: 80px;
    }
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
    .el-date-editor {
      .el-range-separator,
      .el-range__icon,
      .el-range__close-icon {
        line-height: 22px;
      }
    }
  }
}
</style>
<template>
  <div class="page page-etcdPermission">
    <div class="page-search-bar">
      <label>是否有效</label>
      <el-select v-model="searchData.effective" clearable class="width80">
        <el-option label="有效" :value="1"></el-option>
        <el-option label="无效" :value="0"></el-option>
      </el-select>
      <label>环境</label>
      <el-select
        v-model="searchData.env"
        clearable
        placeholder="请选择环境">
        <el-option
          v-for="item in envList"
          :key="item.id"
          :label="item.completeName"
          :value="item.id"></el-option>
      </el-select>
      <label>关键字</label>
      <el-input
        v-model="searchData.keyWord"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
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
        <el-table-column prop="id" label="id" align="center" width="100"></el-table-column>
        <el-table-column prop="envName" label="环境" align="center" width="100"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center" width="100"></el-table-column>
        <el-table-column prop="keyName" label="keyName" align="center"></el-table-column>
        <el-table-column prop="effective" label="是否有效" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.effective === 1" type="success" effect="plain" size="small">有效</el-tag>
            <el-tag v-if="scope.row.effective === 0" type="danger" effect="plain" size="small">无效</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="permissionType" label="期限" align="center" width="180">
          <template slot-scope="scope">
            <div v-if="scope.row.permissionType === 1">永久</div>
            <div v-if="scope.row.permissionType === 2">
              {{scope.row.startTime}}
              <div>至</div>
              {{scope.row.endTime}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="80" align="center">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
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
        <el-row>
          <el-form-item label="时效" prop="permissionType" style="margin-bottom: 12px">
            <el-radio-group v-model="addFormData.permissionType">
              <el-radio :label="1">永久</el-radio>
              <el-radio :label="2">临时</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="时间" v-if="addFormData.permissionType === 2">
            <el-date-picker
              v-model="times"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
              :default-time="['00:00:00', '23:59:59']"
              align="right"
              style="width: 488px">
            </el-date-picker>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="环境" prop="env">
            <el-select
              v-model="addFormData.env"
              placeholder="请选择环境">
              <el-option
                v-for="item in envList"
                :key="item.id"
                :label="item.completeName"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-select
              v-model="addFormData.name"
              remote
              filterable
              clearable
              :remote-method="loadUsers"
              :loading="searchUserLoading"
              placeholder="请输入关键字"
              size="small">
              <el-option
                v-for="item in userList"
                :key="item.userId"
                :label="item.name"
                :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="路径" prop="keyName">
            <el-input v-model="addFormData.keyName" placeholder="请输入路径"></el-input>
          </el-form-item>
          <el-form-item label="类型" prop="keyType">
            <el-radio-group v-model="addFormData.keyType">
              <el-radio :label="1">文件夹</el-radio>
              <el-radio :label="2">key</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-row>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="addFormData.remark" placeholder="请输入备注" style="width:488px"></el-input>
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
import mixin from '@/mixins/mixin'
export default {
  components: { Pagination },
  mixins: [mixin],
  data () {
    return {
      searchData: {
        page: 1,
        pageSize: 10,
        keyWord: '',
        effective: 1,
        env: ''
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      handleType: 'add',
      showDialog: false,
      envList: [],
      searchUserLoading: false,
      userList: [],
      times: null,
      addFormData: {
        env: '',
        name: '',
        permissionType: 1,
        keyName: '',
        keyType: 2,
        remark: ''
      },
      rules: {
        env: [
          { required: true, message: '请选择环境', trigger: 'change' },
        ],
        name: [
          { required: true, message: '请选择姓名', trigger: 'change' },
        ],
        keyName: [
          { required: true, message: '请输入keyName', trigger: 'blur' },
        ]
      },
      saveLoading: false,
      editId: ''
    }
  },
  created () {
    this.getEtcdEnv()
  },
  methods: {
    handleEdit (row) {
      this.handleType = 'edit'
      this.showDialog = true
      this.editId = row.id
      Object.keys(this.addFormData).forEach((key) => { this.addFormData[key] = row[key] })
      if (row.permissionType === 2) {
        this.times = [row.startTime, row.endTime]
      }
    },
    // 新增
    handleAdd () {
      this.handleType = 'add'
      this.showDialog = true
    },
    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.addFormData))
          if (params.permissionType === 2) {
            if (this.times === null) {
              this.$message.error('请选择时间')
              return
            }
            params.startTime = this.times[0]
            params.endTime = this.times[1]
          }
          this.saveLoading = true
          if (this.handleType === 'add') {
            this.$service.addEtcdPerm(params).then(() => {
              this.$message.success('新增成功')
              this.showDialog = false
              this.getTableData()
            }).finally(() => {
              this.saveLoading = false
            })
          } else if (this.handleType === 'edit') {
            params.id = this.editId
            this.$service.editEtcdPerm(params).then(() => {
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
    resetAddForm () {
      this.$refs['ruleForm'].resetFields()
      this.addFormData = {
        env: '',
        name: '',
        permissionType: 1,
        keyName: '',
        keyType: 2,
        remark: ''
      }
      this.userList = []
      this.times = null
    },
    // 模糊查询人
    loadUsers (words) {
      if (words !== '') {
        this.searchUserLoading = true
        this.$service.loadUsers({ keyWord: words }).then(res => {
          this.userList = res.data
        }).finally(() => {
          this.searchUserLoading = false
        })
      } else {
        this.userList = []
      }
    },
    // 获取环境
    getEtcdEnv () {
      this.$service.getEtcdEnv().then(res => {
        this.envList = res.data
      })
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.getEtcdPermList(this.searchData).then(res => {
        this.tableData = res.data.list
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>