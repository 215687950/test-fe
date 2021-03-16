<style lang="scss">
.page-graywhitelist {
  .table-box {
    flex: 1;
    overflow: hidden;
    .el-table-column--selection .cell {
      padding-right: 10px;
    }
  }
  .el-dialog {
    .el-form-item:last-child {
      margin-bottom: 0;
      display: flex;
      .el-form-item__content {
        flex: 1;
        overflow: hidden;
      }
    }
  }
  .view-dialog {
    height: 100%;
    .el-dialog {
      height: 80%;
      .el-dialog__body {
        display: flex;
        flex-direction: column;
        .ace_editor {
          flex: 1;
        }
      }
    }
  }
}
</style>
<template>
  <div class="page page-graywhitelist">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="showAddDialog = true">新增</el-button>
      <el-button v-if="checkedList.length && permission" type="success" size="small" @click="sync(checkedList)">批量同步</el-button>
      <el-button v-if="permission" type="danger" size="small" icon="el-icon" @click="showCookieDialog = true">修改cookie</el-button>
      <el-button v-if="checkedList.length && permission" type="info" size="small" @click="showViewDialogHandle">查看</el-button>
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
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <template v-if="permission === true">
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="ownerUserDept" label="部门" align="center"></el-table-column>
          <el-table-column prop="ownerUserName" label="所属人" align="center"></el-table-column>
          <el-table-column prop="greyUserId" label="uid" align="center"></el-table-column>
          <el-table-column prop="greyUserPhone" label="手机号" align="center"></el-table-column>
          <el-table-column prop="operateDesc" label="用途" align="center"></el-table-column>
          <el-table-column prop="operateUserName" label="操作人" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button
                type="success"
                plain
                size="mini"
                @click="sync([scope.row])">同步</el-button>
            </template>
          </el-table-column>
        </template>
        <template v-if="permission === false">
          <el-table-column prop="ownerUserDept" label="部门" align="center"></el-table-column>
          <el-table-column prop="ownerUserName" label="所属人" align="center"></el-table-column>
          <el-table-column prop="greyUserId" label="uid" align="center"></el-table-column>
          <el-table-column prop="greyUserPhone" label="手机号" align="center"></el-table-column>
          <el-table-column prop="operateDesc" label="用途" align="center"></el-table-column>
          <el-table-column prop="operateUserName" label="操作人" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        </template>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"></Pagination>
    <el-dialog title="新增灰度白名单"
      class="add-dialog"
      :visible.sync="showAddDialog"
      center
      width="568px"
      @close="resetAddForm">
      <el-form ref="ruleForm" :model="addFormData" :rules="rules" :inline="true" label-width="70px">
        <el-form-item label="部门" prop="ownerUserDept">
          <el-input v-model="addFormData.ownerUserDept" placeholder="请输入部门名称"></el-input>
        </el-form-item>
        <el-form-item label="所属人" prop="ownerUserName">
          <el-input v-model="addFormData.ownerUserName" placeholder="请输入所属人"></el-input>
        </el-form-item>
        <el-form-item label="uid" prop="greyUserId">
          <el-input v-model="addFormData.greyUserId" placeholder="请输入uid"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="greyUserPhone">
          <el-input v-model="addFormData.greyUserPhone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="用途" prop="operateDesc">
          <el-input type="textarea" v-model="addFormData.operateDesc" placeholder="请输入用途" style="width:100%"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="addLoading" type="primary" style="width: 100%" @click="addSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看"
      class="big-dialog view-dialog"
      :visible.sync="showViewDialog"
      center
      width="568px">
      <el-tabs v-model="activeName" ref="tab">
        <el-tab-pane label="uid" name="1"></el-tab-pane>
        <el-tab-pane label="name & uid" name="2"></el-tab-pane>
      </el-tabs>
      <editor
        v-model="viewData"
        lang="json"
        :options="{
          showPrintMargin: false,
          enableBasicAutocompletion: true,
          enableSnippets: true,
          enableLiveAutocompletion: true
        }"
        @init="editorInit"></editor>
    </el-dialog>
    <el-dialog title="修改cookie"
      :visible.sync="showCookieDialog"
      center
      width="400px"
      @close="getCookie">
      <el-input type="textarea" v-model="gCookie"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="cookieLoading" type="primary" style="width: 100%" @click="cookieSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import mixin from '@/mixins/mixin'
export default {
  components: { Pagination, editor: require('vue2-ace-editor') },
  mixins: [mixin],
  data () {
    return {
      gCookie: '',
      showCookieDialog: false,
      cookieLoading: false,
      searchData: {
        keywords: '',
        page: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableHeight: null,
      tableData: [],
      total: 0,
      showAddDialog: false,
      addFormData: {
        ownerUserDept: '',
        ownerUserName: '',
        greyUserId: '',
        greyUserPhone: '',
        operateDesc: ''
      },
      rules: {
        ownerUserDept: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
        ],
        ownerUserName: [
          { required: true, message: '请输入所属人', trigger: 'blur' },
        ],
        greyUserId: [
          { required: true, message: '请输入uid', trigger: 'blur' },
        ],
        greyUserPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
        ],
        operateDesc: [
          { required: true, message: '请输入用途', trigger: 'blur' },
        ]
      },
      addLoading: false,
      checkedList: [],
      viewData: '',
      showViewDialog: false,
      activeName: '1'
    }
  },
  computed: {
    permission () {
      return this.$store.state.permission.includes('/grayWhiteList/handle')
    }
  },
  watch: {
    'activeName' (value) {
      if (value === '1') {
        this.viewData = ''
        let checkedUid = []
        this.checkedList.forEach(item => {
          checkedUid.push(item.greyUserId)
        })
        this.viewData = JSON.stringify(checkedUid, null, 4)
      } else {
        this.viewData = ''
        let checkedNameUid = ''
        this.checkedList.forEach((item, index) => {
          if (index === this.checkedList.length - 1) {
            checkedNameUid += `\t"${item.ownerUserName}": "${item.greyUserId}"\n`
          } else {
            checkedNameUid += `\t"${item.ownerUserName}": "${item.greyUserId}",\n`
          }
        })
        this.viewData = `{\n${checkedNameUid}}`
      }
    }
  },
  methods: {
    // 修改cookie
    cookieSubmit () {
      this.cookieLoading = true
      this.$service.saveCookie({ cookie: this.gCookie }).then(() => {
        this.$message.success('修改成功')
      }).finally(() => {
        this.cookieLoading = false
      })
      this.showCookieDialog = false
    },
    // 查看
    showViewDialogHandle () {
      this.activeName = '1'
      this.viewData = ''
      let checkedUid = []
      this.checkedList.forEach(item => {
        checkedUid.push(item.greyUserId)
      })
      this.viewData = JSON.stringify(checkedUid, null, 4)
      this.showViewDialog = true
    },
    editorInit() {
      require("brace/ext/language_tools")
      require("brace/ext/emmet")
      require("brace/theme/chrome")
      require("brace/mode/json")
    },
    // 勾选
    handleSelectionChange (value) {
      this.checkedList = value
    },
    // 新增
    addSubmit () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.addLoading = true
          this.$service.addGreyWhite(this.addFormData).then(() => {
            this.$message.success('新增成功')
            this.showAddDialog = false
            this.getTableData()
          }).finally(() => {
            this.addLoading = false
          })
        }
      })
    },
    resetAddForm () {
      this.$refs['ruleForm'].resetFields()
    },
    // 同步
    sync (syncList) {
      this.$service.syncGrey({ syncList }).then(() => {
        this.$message.success('同步成功')
        this.getTableData()
      })
    },
    // 获取表格数据
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      params.size = params.pageSize
      delete params.pageSize
      this.tableLoading = true
      this.$service.getGreyWhiteList(params).then(res => {
        this.gCookie = res.data.gCookie
        this.tableData = res.data.data
        this.total = res.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    },
    getCookie () {
      this.$service.getGreyWhiteList({
        page: 1,
        size: 10
      }).then(res => {
        this.gCookie = res.data.gCookie
      })
    }
  }
}
</script>