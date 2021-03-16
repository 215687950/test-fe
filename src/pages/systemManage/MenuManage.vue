<style lang="scss">
.page-menuManage {
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
  <div class="page page-menuManage">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="keywords"
        placeholder="请输入部门名称"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="getTableData"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click="getTableData">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      <el-button type="info" size="small" icon="el-icon-s-management" @click="expandToggle(true, tableData)">展开所有</el-button>
      <el-button type="info" size="small" icon="el-icon-s-ticket" @click="expandToggle(false, tableData)">折叠所有</el-button>
    </div>
    <div class="table-box" ref="table-box">
      <el-table
        ref="table"
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#FFFAFA)"
        :data="tableData"
        row-key="id"
        :height="tableHeight"
        border
        style="width: 100%">
        <el-table-column prop="name" label="名称" min-width="120" align="left"></el-table-column>
        <el-table-column prop="urlVue" label="路由" align="center"></el-table-column>
        <el-table-column prop="iconVue" label="ICON" show-overflow-tooltip align="center"></el-table-column>
        <el-table-column prop="levels" label="层级" align="center"></el-table-column>
        <el-table-column prop="menuFlag" label="是否是菜单" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.menuFlag">{{scope.row.menuFlag === 'Y' ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="120" align="center"></el-table-column>
        <el-table-column prop="" label="操作" width="140" align="center">
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
    <el-dialog
      :title="handleType === 'add' ? '新增菜单' : '编辑菜单'"
      :visible.sync="showDialog"
      center
      width="670px"
      @close="resetAddForm">
      <el-form ref="ruleForm" :model="addFormData" :rules="rules" :inline="true" label-width="100px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="addFormData.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单编号" prop="code">
          <el-input v-model="addFormData.code" placeholder="请输入菜单编号"></el-input>
        </el-form-item>
        <el-form-item label="路由" prop="urlVue">
          <el-input v-model="addFormData.urlVue" placeholder="请输入路由"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="addFormData.sort" placeholder="请输入排序"></el-input>
        </el-form-item>
        <el-form-item label="父级菜单" prop="pid">
          <el-select
            v-model="addFormData.pid"
            placeholder="请选择父级菜单"
            remote
            filterable
            clearable
            :remote-method="fuzzyMenuList"
            :loading="searchMenuLoading">
            <el-option
              v-for="item in menuList"
              :key="item.menuId"
              :label="item.name"
              :value="item.menuId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="icon" prop="iconVue">
          <el-input v-model="addFormData.iconVue" placeholder="请输入icon"></el-input>
        </el-form-item>
        <el-form-item label="是否是菜单" prop="menuFlag">
          <el-select v-model="addFormData.menuFlag" placeholder="请选择">
            <el-option value="Y" label="是"></el-option>
            <el-option value="N" label="否"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" style="width: 100%" @click="save">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import mixin from '@/mixins/mixin'
export default {
  mixins: [mixin],
  data () {
    return {
      keywords: '',
      tableLoading: false,
      tableData: [],
      tableHeight: null,
      handleType: 'add',
      editMenuId: '',
      showDialog: false,
      addFormData: {
        name: '',
        code: '',
        urlVue: '',
        sort: '',
        pid: '',
        iconVue: '',
        menuFlag: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请输入菜单编号', trigger: 'blur' },
        ],
        urlVue: [
          { required: true, message: '请输入路由', trigger: 'blur' },
        ],
        pid: [
          { required: true, message: '请选择父级菜单', trigger: 'change' },
        ],
        menuFlag: [
          { required: true, message: '请选择是否是菜单', trigger: 'change' },
        ]
      },
      menuList: [],
      searchMenuLoading: false,
      saveLoading: false
    }
  },
  methods: {
    handleDel (row) {
      this.$msgbox.confirm('确认删除此菜单?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.delMenu({
          menuId: row.id,
          roleId: this.$store.state.userInfo.roleId
        }).then(() => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      })
    },
    handleEdit (row) {
      this.handleType = 'edit'
      this.showDialog = true
      this.editMenuId = row.id
      Object.keys(this.addFormData).forEach((key) => {
        if (key === 'pid') {
          if (row.pcode === '0') {
            this.addFormData.pid = '0'
          } else {
            this.$service.getMenuByCode({pCode: row.pcode}).then(res => {
              this.menuList.push({
                menuId: res.data.menuId,
                name: res.data.name
              })
              this.addFormData.pid = res.data.menuId
            })
          }
        } else {
          this.addFormData[key] = row[key]
        }
      })
    },
    handleAdd () {
      this.handleType = 'add'
      this.showDialog = true
    },
    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.saveLoading = true
          if (this.handleType === 'add') {
            this.$service.addMenu(this.addFormData).then(() => {
              this.$message.success('新增菜单成功')
              this.showDialog = false
              this.getTableData()
            }).finally(() => {
              this.saveLoading = false
            })
          } else if (this.handleType === 'edit') {
            this.$service.editMenu({ ...this.addFormData, menuId: this.editMenuId }).then(() => {
              this.$message.success('编辑菜单成功')
              this.showDialog = false
              this.getTableData()
            }).finally(() => {
              this.saveLoading = false
            })
          }
        }
      })
    },
    // 模糊查询menu列表
    fuzzyMenuList (keywords) {
      if(keywords === '0'){
        this.addFormData.pid = '0'
        return
      }
      if (keywords !== '') {
        this.searchMenuLoading = true
        this.$service.fuzzyMenuList({ keywords }).then(res => {
          this.menuList = res.data
        }).finally(() => {
          this.searchMenuLoading = false
        })
      } else {
        this.menuList = []
      }
    },
    resetAddForm () {
      this.$refs['ruleForm'].resetFields()
      this.addFormData = {
        name: '',
        code: '',
        urlVue: '',
        sort: '',
        pid: '',
        iconVue: '',
        menuFlag: ''
      }
      this.menuList = []
    },
    expandToggle (bool, data) {
      data.forEach(item => {
        this.$refs['table'].toggleRowExpansion(item, bool)
        if (item.children.length) {
          this.expandToggle(bool, item.children)
        }
      })
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.getPermissionTree({
        roleId: this.$store.state.userInfo.roleId,
        keywords: this.keywords
      }).then(res => {
        this.tableData = res.data
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>