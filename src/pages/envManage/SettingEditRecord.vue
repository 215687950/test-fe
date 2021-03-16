<style lang="scss">
.page-settingEditRecord {
  .table-box {
    flex: 1;
    overflow: hidden;
    .status0 {
      color: #5dcfff;
    }
    .status1 {
      color: #ffcd5d;
    }
    .status2 {
      color: #73d897;
    }
    .status3 {
      color: #ff7575;
    }
  }
  .el-dialog__wrapper {
    .el-input,
    .el-date-editor.el-input,
    .el-select {
      width: 200px;
    }
    .el-textarea__inner {
      width: 785px;
    }
  }
}
</style>
<template>
  <div class="page page-settingEditRecord">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <label>环境</label>
      <el-select v-model="searchData.env" clearable placeholder="请选择环境">
        <el-option v-for="item in envList" :key="item.id" :label="item.completeName" :value="item.id"></el-option>
      </el-select>
      <label>类型</label>
      <el-select v-model="searchData.type" clearable placeholder="请选择类型">
        <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <label>状态</label>
      <el-select v-model="searchData.status" clearable placeholder="请选择状态">
        <el-option
          v-for="item in statusList"
          :key="item.id"
          :label="item.name"
          :value="item.id"></el-option>
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
        <el-table-column label="id" prop="id" align="center"></el-table-column>
        <el-table-column label="keyName" prop="keyName" show-overflow-tooltip min-width="300" align="center"></el-table-column>
        <el-table-column label="环境" prop="envName" align="center"></el-table-column>
        <el-table-column label="类型" prop="typeName" align="center" min-width="100"></el-table-column>
        <el-table-column label="状态" prop="statusName" align="center">
          <template slot-scope="scope">
            <span :class="'status' + scope.row.status">{{scope.row.statusName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="需求方" prop="demand" align="center"></el-table-column>
        <el-table-column label="操作人" prop="operator" align="center"></el-table-column>
        <el-table-column label="创建人" prop="creator" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" align="center" width="180"></el-table-column>
        <el-table-column label="操作" v-if="superPermission" width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="showDialog('edit', scope.row)">编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.row)">删除</el-button>
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
      class="big-dialog"
      :title="dialogType === 'add' ? '新增' : '编辑'"
      :visible.sync="isShowDialog"
      width="930px"
      @close="reset">
      <el-form ref="ruleForm" :model="dialogData" :rules="rules" :inline="true" label-width="83px">
        <el-form-item label="环境" prop="env">
          <el-select v-model="dialogData.env" :disabled="disabledEdit" clearable placeholder="请选择环境">
            <el-option v-for="item in envList" :key="item.id" :label="item.completeName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="dialogData.type" :disabled="disabledEdit" clearable placeholder="请选择类型">
            <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="dialogData.status" :disabled="user.roleId !== '1'" clearable placeholder="请选择状态">
            <el-option v-for="item in statusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-select :disabled="disabledEdit" v-model="dialogData.operator" clearable placeholder="请选择操作人">
            <el-option
              v-for="item in operatorArray"
              :key="item"
              :label="item"
              :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="需求方" prop="demand">
          <el-input :disabled="disabledEdit" v-model="dialogData.demand" placeholder="请填写需求方"></el-input>
        </el-form-item>
        <el-form-item label="keyName" prop="keyName">
          <el-input :disabled="disabledEdit" v-model="dialogData.keyName" placeholder="请填写keyName"></el-input>
        </el-form-item>
        <el-form-item label="影响范围" prop="influence">
          <el-input :disabled="disabledEdit" v-model="dialogData.influence" :autosize="{minRows: 2}" type="textarea" placeholder="请填写影响范围"></el-input>
        </el-form-item>
        <el-form-item label="原始值" prop="oldSetting">
          <el-input :disabled="disabledEdit" v-model="dialogData.oldSetting" :autosize="{minRows: 2}" type="textarea" placeholder="请填写原始值"></el-input>
        </el-form-item>
        <el-form-item label="修改值" prop="newSetting">
          <el-input :disabled="disabledEdit" v-model="dialogData.newSetting" :autosize="{minRows: 2}" type="textarea" placeholder="请填写修改值"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input :disabled="disabledEdit" v-model="dialogData.remark" :autosize="{minRows: 2}" type="textarea" placeholder="请填写备注"></el-input>
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input :disabled="disabledEdit" v-model="dialogData.reason" :autosize="{minRows: 2}" type="textarea" placeholder="请填写原因"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="dialogType === 'add'"
          :loading="saveLoading"
          type="primary"
          size="small"
          style="width:100%"
          @click="handleAdd">提 交</el-button>
        <el-button
          :disabled="disabledEdit"
          v-else
          :loading="saveLoading"
          type="primary"
          size="small"
          style="width:100%"
          @click="handleEdit">提 交</el-button>
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
        env: '',
        type: '',
        status: '',
        page: 1,
        pageSize: 10
      },
      envList: [],
      typeList: [
        { id: 1, name: 'env' },
        { id: 2, name: 'configmap' },
        { id: 3, name: 'mysql' },
        { id: 4, name: 'etcd' },
        { id: 5, name: '其他' },
      ],
      statusList: [
        { id: 0, name: '未处理' },
        { id: 1, name: '处理中' },
        { id: 2, name: '已完成' },
        { id: 3, name: '已拒绝' },
      ],
      tableHeight: null,
      tableLoading: false,
      tableData: [],
      total: 0,
      isShowDialog: false,
      dialogType: '',
      operatorArray: ['邵康', '冯辉', '陈梦燕'],
      dialogData: {
        env: null,
        type: null,
        status: 0,
        demand: '',
        keyName: '',
        operator: '',
        influence: '', // 影响范围
        newSetting: '', // 修改值
        oldSetting: '', // 原始值
        remark: '',
        reason: '',
      },
      rules: {
        env: [
          { required: true, message: '请选择环境', trigger: 'change' },
        ],
        type: [
          { required: true, message: '请选择类型', trigger: 'change' },
        ],
        status: [
          { required: true, message: '请选择状态', trigger: 'change' },
        ],
        operator: [
          { required: true, message: '请选择操作人', trigger: 'change' },
        ],
        demand: [
          { required: true, message: '请填写需求放', trigger: 'blur' },
        ],
        keyName: [
          { required: true, message: '请填写keyName', trigger: 'blur' },
        ],
        influence: [
          { required: true, message: '请填写影响范围', trigger: 'blur' },
        ],
        newSetting: [
          { required: true, message: '请填写修改值', trigger: 'blur' },
        ],
        oldSetting: [
          { required: true, message: '请填写原始值', trigger: 'blur' },
        ],
        reason: [
          { required: true, message: '请填写原因', trigger: 'blur' },
        ]
      },
      editId: '',
      disabledEdit: false,
      saveLoading: false
    }
  },
  computed: {
    user () {
      return this.$store.state.userInfo
    },
    superPermission () {
      return this.$store.state.permission.includes('/settingEditRecord/manage')
    }
  },
  created () {
    this.getEtcdEnv()
  },
  methods: {
    handleAdd () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$service.addRecord(this.dialogData).then(() => {
            this.$message.success('新增成功')
            this.isShowDialog = false
            this.reset()
            this.getTableData()
          })
        }
      })
    },
    handleEdit () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$service.updateRecord({ ...this.dialogData, id: this.editId }).then(() => {
            this.$message.success('编辑成功')
            this.isShowDialog = false
            this.reset()
            this.getTableData()
          })
        }
      })
    },
    showDialog (type, row) {
      this.dialogType = type
      if (type === 'edit') {
        this.$service.getRecordDetail({ id: row.id }).then(res => {
          let rowCopy = JSON.parse(JSON.stringify(res.data))
          Object.keys(this.dialogData).forEach( key => { this.dialogData[key] = rowCopy[key]})
          this.editId = rowCopy.id
          this.disabledEdit = this.dialogData.status !== 0 && this.user.roleId !== '1'
          this.isShowDialog = true
        })
      } else {
        this.isShowDialog = true
      }
    },
    reset () {
      this.$refs['ruleForm'].resetFields()
      this.dialogData = {
        env: null,
        type: null,
        status: 0,
        demand: '',
        keyName: '',
        operator: '',
        influence: '',
        newSetting: '',
        oldSetting: '',
        remark: '',
        reason: '',
      }
    },
    // 删除
    handleDelete (row) {
      this.$msgbox.confirm('确认删除此条数据?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.deleteRecord({ id: row.id }).then(() => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      })
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.getRecordList(this.searchData).then(res => {
        let list = res.data.list
        if (list.length) {
          list.forEach(item => {
            this.envList.forEach(env => {
              if (env.id === item.env) {
                item.envName = env.completeName
              }
            })
            this.typeList.forEach(type => {
              if (type.id === item.type) {
                item.typeName = type.name
              }
            })
            this.statusList.forEach(status => {
              if (status.id === item.status) {
                item.statusName = status.name
              }
            })
          })
        }
        this.tableData = list
        this.total = res.data.totalCount
      }).finally(() => {
        this.tableLoading = false
      })
    },
    getEtcdEnv() {
      this.$service.getEtcdEnv().then(res => {
        this.envList = res.data
      })
    }
  }
}
</script>