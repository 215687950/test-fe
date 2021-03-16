<style lang="scss">
.page-userManage {
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
  <div class="page page-userManage">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入名称/账号"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <label>角色</label>
      <el-select v-model="searchData.roleId" clearable>
        <el-option
          v-for="item in roleList"
          :key="item.roleId"
          :label="item.name"
          :value="item.roleId"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <div class="table-box" ref="table-box">
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#FFFAFA)"
        :data="tableData"
        :height="tableHeight"
        border
        style="width: 100%">
        <el-table-column prop="account" label="账号" align="center"></el-table-column>
        <el-table-column prop="name" label="姓名" align="center"></el-table-column>
        <el-table-column prop="sex" label="性别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.sex === 'M'">男</span>
            <span v-if="scope.row.sex === 'F'">女</span>
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色" align="center"></el-table-column>
        <el-table-column prop="deptName" label="部门" align="center"></el-table-column>
        <el-table-column prop="email" label="邮箱" min-width="200" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="168" align="center"></el-table-column>
        <el-table-column prop="" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="light" content="分配" placement="top">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-s-custom"
                  @click="handleAllot(scope.row)"
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
    <Pagination :total="total" :currentPage="searchData.page" @on-size-change="handleSizeChange" @on-current-change="handleCurrentChange"></Pagination>
    <el-dialog
      :title="handleType === 'add' ? '新增用户' : '编辑用户'"
      :visible.sync="showDialog.addOrEdit"
      center
      width="630px"
      @close="resetAddForm">
      <el-form ref="ruleForm" :model="addFormData" :rules="rules" :inline="true" label-width="80px">
        <el-form-item label="账号" prop="account">
          <el-input v-model="addFormData.account" placeholder="请输入账号"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="addFormData.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label=部门 prop="deptId">
          <el-select
            v-model="addFormData.deptId"
            placeholder="请选择部门"
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
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addFormData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-input v-model="addFormData.phone" placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="出生日期" prop="birthday">
          <el-date-picker v-model="addFormData.birthday" type="date" value-format="yyyy-MM-dd" placeholder="请选择出生日期"></el-date-picker>
        </el-form-item>
        <el-form-item v-if="handleType === 'add'" label="密码" prop="password">
          <el-input v-model="addFormData.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item v-if="handleType === 'add'" label="重复密码" prop="repeatPwd">
          <el-input v-model="addFormData.repeatPwd" placeholder="请重复密码"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="sex" class="el-form-item-heigth30">
          <el-radio-group v-model="addFormData.sex">
            <el-radio label="M">男</el-radio>
            <el-radio label="F">女</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" style="width: 100%" @click="save">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="分配角色"
      :visible.sync="showDialog.allotRole"
      center
      width="250px">
      <el-select
        v-model="allotRole.roleIds"
        placeholder="请选择要分配的角色"
        @change="submitAllotRole">
        <el-option
          v-for="item in roleList"
          :key="item.roleId"
          :label="item.name"
          :value="item.roleId"></el-option>
      </el-select>
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
      tableHeight: null,
      roleList: [],
      searchData: {
        page: 1,
        pageSize: 10,
        keywords: '',
        roleId: ''
      },
      loading: false,
      tableData: [],
      total: 0,
      showDialog: {
        addOrEdit: false,
        allotRole: false
      },
      // 分配角色
      allotRole: {
        roleIds: '',
        userId: ''
      },
      // 新增、编辑
      handleType: 'add',
      saveLoading: false,
      deptList: [],
      searchDeptLoading: false,
      editUserId: '',
      addFormData: {
        account: '',
        name: '',
        deptId: '',
        email: '',
        phone: '',
        birthday: '',
        password: '',
        repeatPwd: '',
        sex: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        deptId: [
          { required: true, message: '请选择部门', trigger: 'change' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入电话', trigger: 'blur' },
        ],
        birthday: [
          { required: true, message: '请选择出生日期', trigger: 'change' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        repeatPwd: [
          { required: true, message: '请重复密码', trigger: 'blur' },
        ],
        sex: [
          { required: true, message: '请选择性别', trigger: 'change' },
        ]
      }
    }
  },
  mounted () {
    this.getAllRoles()
  },
  methods: {
    resetAddForm () {
      this.$refs['ruleForm'].resetFields()
      this.deptList = []
    },
    // 新增
    add () {
      this.handleType = 'add'
      this.showDialog.addOrEdit = true
    },
    // 编辑
    handleEdit (row) {
      this.handleType = 'edit'
      this.showDialog.addOrEdit = true
      this.editUserId = row.userId
      this.$service.getDeptById(row.deptId).then(res => {
        this.deptList.push({ deptId: row.deptId, fullName: res.fullName })
      })
      Object.keys(this.addFormData).forEach((key) => { this.addFormData[key] = row[key] })
    },
    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.handleType === 'add') {
            if (this.addFormData.password !== this.addFormData.repeatPwd) {
              this.$message.error('两次密码输入不一致!')
              return
            }
            this.$service.addUser(this.addFormData).then(() => {
              this.$message.success('新增用户成功')
              this.showDialog.addOrEdit = false
              this.getTableData()
            }).finally(() => {
              this.saveLoading = false
            })
          } else if (this.handleType === 'edit') {
            let params = JSON.parse(JSON.stringify(this.addFormData))
            delete params.password
            delete params.repeatPwd
            params.userId = this.editUserId
            this.$service.editUser(params).then(() => {
              this.$message.success('编辑用户成功')
              this.showDialog.addOrEdit = false
              this.getTableData()
            }).finally(() => {
              this.saveLoading = false
            })
          }
        }
      })
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
    // 分配
    handleAllot (row) {
      this.showDialog.allotRole = true
      this.allotRole.userId = row.userId
      this.allotRole.roleIds = row.roleId
    },
    submitAllotRole () {
      this.$service.setRole(this.allotRole).then(() => {
        this.$message.success('分配成功')
        this.showDialog.allotRole = false
        this.getTableData()
      })
    },
    // 删除
    handleDel (row) {
      this.$msgbox.confirm('确认删除此用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.delUser({ userId: row.userId }).then(() => {
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
      this.loading = true
      this.$service.getUserList(this.searchData).then(res => {
        this.tableData = res.data.data
        this.total = res.data.totalCount
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
