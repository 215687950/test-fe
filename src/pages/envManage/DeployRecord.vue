<style lang="scss">
.page-deployRecord {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
}
</style>
<template>
  <div class="page page-deployRecord">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="支持服务名/发布人"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <label>环境</label>
      <el-select v-model="searchData.env" clearable placeholder="请选择环境">
        <el-option v-for="item in envList" :key="item.id" :label="item.envName" :value="item.envName"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
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
        <el-table-column prop="id" label="id" align="center" width="70"></el-table-column>
        <el-table-column prop="projectName" label="服务名称" align="center" min-width="1"></el-table-column>
        <el-table-column prop="branch" label="分支" align="center" width="70"></el-table-column>
        <el-table-column prop="env" label="环境" align="center" width="100"></el-table-column>
        <el-table-column prop="imageName" label="image" align="center" min-width="2"></el-table-column>
        <el-table-column prop="publisher" label="发布人" align="center" width="150"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="180"></el-table-column>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"></Pagination>
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
        page: 1,
        pageSize: 10
      },
      envList: [],
      tableHeight: null,
      tableLoading: false,
      tableData: [],
      total: 0
    }
  },
  created () {
    this.getEnvList()
  },
  methods: {
    // 获取表格数据
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      params.size = params.pageSize
      delete params.pageSize
      this.tableLoading = true
      this.$service.listEmployRecord(params).then(res => {
        res.data.dataList.forEach(item => {
          this.envList.forEach(env => {
            if (env.id === String(item.env)) { item.envName = env.name }
          })
        })
        this.tableData = res.data.dataList
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
      })
    },
    getEnvList () {
      this.$service.selectAllConfigEnv().then(res => {
        this.envList = res.data
      })
    }
  }
}
</script>