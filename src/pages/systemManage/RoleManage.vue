<style lang="scss">
.page-roleManage {
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
  <div class="page page-roleManage">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keyWord"
        placeholder="请输入角色名称"
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
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="pName" label="上级角色" align="center"></el-table-column>
        <el-table-column prop="description" label="别名" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200" align="center"></el-table-column>
        <el-table-column prop="" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="light" content="分配" placement="top">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-s-custom"
                  :loading="allotIndex === scope.$index"
                  @click="handleAllot(scope.row, scope.$index)"
                ></el-button>
              </el-tooltip>
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
      :title="handleType === 'add' ? '新增角色' : '编辑角色'"
      :visible.sync="showDialog.addOrEdit"
      center
      width="630px"
      @close="resetAddForm">
      <el-form ref="ruleForm" :model="addFormData" :rules="rules" :inline="true" label-width="80px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="addFormData.name" placeholder="请输入角色名称"></el-input>
        </el-form-item>
        <el-form-item label="上级名称" prop="pid">
          <el-select
            v-model="addFormData.pid"
            placeholder="请选择上级名称"
            clearable>
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :label="item.name"
              :value="item.roleId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色排序" prop="sort">
          <el-input v-model="addFormData.sort" placeholder="请输入角色排序"></el-input>
        </el-form-item>
        <el-form-item label="角色别名" prop="description">
          <el-input v-model="addFormData.description" placeholder="请输入角色别名"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" style="width: 100%" @click="save">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="big-dialog"
      title="分配权限"
      :visible.sync="showDialog.permission"
      center
      width="500px"
      @close="permissionDialogClose">
      <div class="dialog-body">
        <el-tree
          ref="permssion-tree"
          :data="permissionTree"
          :default-checked-keys="defaultCheckList"
          :props="defaultProps"
          node-key="id"
          default-expand-all
          show-checkbox>
        </el-tree>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="savePermissionLoading" type="primary" style="width: 100%" @click="savePermission">提交</el-button>
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
      showDialog: {
        addOrEdit: false,
        permission: false
      },
      editRoleId: '',
      handleType: 'add',
      roleList: [],
      addFormData: {
        name: '',
        pid: '',
        sort: '',
        description: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        pid: [
          { required: true, message: '请选择上级名称', trigger: 'change' },
        ],
        description: [
          { required: true, message: '请输入角色别名', trigger: 'blur' },
        ]
      },
      saveLoading: false,
      permissionTree: [],
      allotRoleId: '',
      allotIndex: null,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultCheckList: [],
      savePermissionLoading: false
    }
  },
  methods: {
    // 新增
    handleAdd () {
      this.handleType = 'add'
      this.showDialog.addOrEdit = true
      this.getAllRoles()
    },
    // 编辑
    handleEdit (row) {
      this.handleType = 'edit'
      this.showDialog.addOrEdit = true
      this.getAllRoles()
      this.editRoleId = row.roleId
      Object.keys(this.addFormData).forEach((key) => { this.addFormData[key] = row[key] })
    },
    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.handleType === 'add') {
            this.$service.addRole(this.addFormData).then(() => {
              this.$message.success('新增角色成功')
              this.showDialog.addOrEdit = false
              this.getTableData()
            }).finally(() => {
              this.saveLoading = false
            })
          } else if (this.handleType === 'edit') {
            this.$service.editRole({ ...this.addFormData, roleId: this.editRoleId }).then(() => {
              this.$message.success('编辑角色成功')
              this.showDialog.addOrEdit = false
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
    },
    handleAllot (row, index) {
      this.allotRoleId = row.roleId
      this.allotIndex = index
      this.$service.getPermissionTree({
        roleId: row.pid === '0' ? row.roleId : row.pid
      }).then(res => {
        this.permissionTree = res.data
        this.$service.getRolePermission({ roleId: row.roleId}).then(res => {
          this.defaultCheckList = res.data
          this.showDialog.permission = true
        }).finally(() => {
          this.allotIndex = null
        })
      }).catch(() => {
        this.allotIndex = null
      })
    },
    savePermission () {
      let checkedNodes = this.$refs['permssion-tree'].getCheckedNodes(false, true);
      let ids = ''
      checkedNodes.forEach(item => {
        ids += `${item.id},`
      })
      this.savePermissionLoading = true
      this.$service.setAuthority({
        roleId: this.allotRoleId,
        ids
      }).then(() => {
        this.$message.success('分配成功')
        this.showDialog.permission = false
      }).finally(() => {
        this.savePermissionLoading = false
      })
    },
    permissionDialogClose () {
      this.permissionTree = []
      this.defaultCheckList = []
    },
    handleDel (row) {
      this.$msgbox.confirm('确认删除此角色?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.delRole({ roleId: row.roleId }).then(() => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      })
    },
    // 获取全部角色
    getAllRoles () {
      this.$service.getAllRoles().then(res => {
        this.roleList = res.data
      })
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.getRoleList(this.searchData).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>