<style lang="scss">
.page-mockConf {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
}
</style>
<template>
  <div class="page page-mockConf">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入项目名称"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <label>状态</label>
      <el-select v-model="searchData.isUse" clearable class="width80">
        <el-option label="停用" :value="0"></el-option>
        <el-option label="启用" :value="1"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="handleAdd">新增配置</el-button>
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
        <el-table-column prop="mockName" label="Mock名称" align="center"></el-table-column>
        <el-table-column prop="mockHost" label="HOST" align="center"></el-table-column>
        <el-table-column prop="mockUri" label="URI" align="center"></el-table-column>
        <el-table-column prop="isUse" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isUse === 0" type="danger" size="small" effect="plain">停用</el-tag>
            <el-tag v-if="scope.row.isUse === 1" type="success" size="small" effect="plain">启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reqType" label="请求方式" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.reqType === 0" type="danger" size="small" effect="plain">GET</el-tag>
            <el-tag v-if="scope.row.reqType === 1" type="success" size="small" effect="plain">POST</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="info" size="mini" plain @click="handleView(scope.row)">查看</el-button>
            <el-button type="warning" size="mini" plain @click="handleEdit(scope.row)">修改</el-button>
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
      :title="handleType"
      :visible.sync="showDialog"
      center
      width="900px"
      @close="resetAddForm">
      <el-form ref="dataForm" :model="formData" :inline="true" label-width="80px">
        <el-form-item label="Mock名称">
          <el-input v-model="formData.mockName" placeholder="请输入Mock名称" clearable :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="MockHost">
          <el-input v-model="formData.mockHost" placeholder="请输入MockHost" clearable :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="MockUri">
          <el-input v-model="formData.mockUri" placeholder="请输入MockUri" clearable :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="请求方式">
          <el-select v-model="formData.reqType" placeholder="请选择请求方式" clearable :disabled="isDisabled">
            <el-option :value="0" label="GET"></el-option>
            <el-option :value="1" label="POST"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Mock状态">
          <el-select v-model="formData.isUse" placeholder="请选择Mock状态" clearable :disabled="isDisabled">
            <el-option :value="0" label="停用"></el-option>
            <el-option :value="1" label="启用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Mock备注">
          <el-input v-model="formData.remark" placeholder="请输入Mock备注" clearable :disabled="isDisabled"></el-input>
        </el-form-item>
      </el-form>
      <el-tabs v-model="detailActive">
        <el-tab-pane label="SuccessData" name="success">
          <el-input
            v-model="formData.successData"
            type="textarea"
            :rows="10"
            :disabled="isDisabled"
            placeholder="请输入内容"></el-input>
        </el-tab-pane>
        <el-tab-pane label="ErrorData" name="error">
          <el-input
            v-model="formData.errorData"
            type="textarea"
            :rows="10"
            :disabled="isDisabled"
            placeholder="请输入内容"></el-input>
        </el-tab-pane>
      </el-tabs>
      <span v-if="handleType !== '查看'" slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" style="width: 100%" @click="submit">提交</el-button>
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
        keywords: '',
        isUse: ''
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      handleType: '',
      showDialog: false,
      saveLoading: false,
      formData: {
        mockName: '',
        mockHost: '',
        mockUri: '',
        reqType: '',
        isUse: '',
        remark: '',
        successData: '',
        errorData: ''
      },
      editId: '',
      detailActive: 'success'
    }
  },
  computed: {
    isDisabled () {
      return this.handleType === '查看'
    }
  },
  methods: {
    handleAdd () {
      this.handleType = '新增'
      this.showDialog = true
    },
    handleEdit (row) {
      this.handleType = '修改'
      this.editId = row.id
      Object.keys(this.formData).forEach(key => this.formData[key] = row[key])
      this.showDialog = true
    },
    handleView (row) {
      this.handleType = '查看'
      Object.keys(this.formData).forEach(key => this.formData[key] = row[key])
      this.showDialog = true
    },
    submit () {
      let url = ''
      let msg = ''
      let params = {}
      if (this.handleType === '新增') {
        url = 'addMockConf'
        msg = '新增成功'
        params = this.formData
      } else if (this.handleType === '修改') {
        url = 'editMockConf'
        msg = '修改成功'
        params = { ...this.formData, id: this.editId }
      }
      this.saveLoading = true
      this.$service[url](params).then(() => {
        this.$message.success(msg)
        this.showDialog = false
        this.getTableData()
      }).finally(() => {
        this.saveLoading = false
      })
    },
    resetAddForm () {
      this.formData = {
        mockName: '',
        mockHost: '',
        mockUri: '',
        reqType: '',
        isUse: '',
        remark: '',
        successData: '',
        errorData: ''
      },
      this.detailActive = 'success'
    },
    // 获取表格数据
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      params.size = params.pageSize
      delete params.pageSize
      this.tableLoading = true
      this.$service.listMockConf(params).then(res => {
        this.tableData = res.data.dataList
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>