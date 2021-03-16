<style lang="scss">
.page-deptManage {
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
  <div class="page page-deptManage">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入部门名称"
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
        <el-table-column prop="simpleName" label="部门名称" align="center"></el-table-column>
        <el-table-column prop="fullName" label="部门全程" align="center"></el-table-column>
        <el-table-column prop="sort" label="排序" align="center"></el-table-column>
        <el-table-column prop="description" label="备注" align="center"></el-table-column>
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
      :title="handleType === 'add' ? '新增部门' : '编辑部门'"
      :visible.sync="showDialog"
      center
      width="630px"
      @close="resetAddForm">
      <el-form ref="ruleForm" :model="addFormData" :rules="rules" :inline="true" label-width="80px">
        <el-form-item label="部门名称" prop="simpleName">
          <el-input v-model="addFormData.simpleName" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="上级名称" prop="pid">
          <el-select
            v-model="addFormData.pid"
            placeholder="请选择上级部门"
            remote
            filterable
            clearable
            :remote-method="fuzzyDeptList"
            :loading="searchDeptLoading">
            <el-option
              v-for="item in deptList"
              :key="item.deptId"
              :label="item.fullName"
              :value="item.deptId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门全称" prop="fullName">
          <el-input v-model="addFormData.fullName" placeholder="请输入部门全称"></el-input>
        </el-form-item>
        <el-form-item label="部门备注" prop="description">
          <el-input v-model="addFormData.description" placeholder="请输入部门备注"></el-input>
        </el-form-item>
        <el-form-item label="部门排序" prop="sort">
          <el-input v-model="addFormData.sort" placeholder="请输入部门排序"></el-input>
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
        keywords: ''
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      handleType: 'add',
      showDialog: false,
      deptList: [],
      searchDeptLoading: false,
      addFormData: {
        simpleName: '',
        pid: '',
        fullName: '',
        description: '',
        sort: ''
      },
      rules: {
        simpleName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
        ],
        pid: [
          { required: true, message: '请选择上级名称', trigger: 'change' },
        ],
        fullName: [
          { required: true, message: '请输入部门全称', trigger: 'blur' },
        ],
        description: [
          { required: true, message: '请输入部门备注', trigger: 'blur' },
        ],
        sort: [
          { required: true, message: '请输入部门排序', trigger: 'blur' },
        ]
      },
      saveLoading: false,
      editDeptId: ''
    }
  },
  methods: {
    handleDel (row) {
      this.$msgbox.confirm('确认删除此部门?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.deleteDept({ deptId: row.deptId }).then(() => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      })
    },
    handleEdit (row) {
      this.handleType = 'edit'
      this.showDialog = true
      this.editDeptId = row.deptId
      this.$service.getDeptById(row.pid).then(res => {
        this.deptList.push({ deptId: row.pid, fullName: res.fullName })
      })
      Object.keys(this.addFormData).forEach((key) => { this.addFormData[key] = row[key] })
    },
    // 新增
    handleAdd () {
      this.handleType = 'add'
      this.showDialog = true
    },
    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.handleType === 'add') {
            this.$service.addDept(this.addFormData).then(() => {
              this.$message.success('新增部门成功')
              this.showDialog = false
              this.getTableData()
            }).finally(() => {
              this.saveLoading = false
            })
          } else if (this.handleType === 'edit') {
            this.$service.updateDept({ ...this.addFormData, deptId: this.editDeptId }).then(() => {
              this.$message.success('编辑部门成功')
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
      this.deptList = []
    },
    // 模糊查询部门列表
    fuzzyDeptList (keywords) {
      if (keywords !== '') {
        this.searchDeptLoading = true
        this.$service.fuzzyDeptList({ keywords }).then(res => {
          this.deptList = res.data
        }).finally(() => {
          this.searchDeptLoading = false
        })
      } else {
        this.deptList = []
      }
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.listDept(this.searchData).then(res => {
        this.tableData = res.data.data
        this.total = res.data.totalCount
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>