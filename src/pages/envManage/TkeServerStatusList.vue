<style lang="scss">
.page-tkeServerStatusList {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
}
</style>
<template>
  <div class="page page-tkeServerStatusList">
    <div class="page-search-bar">
      <label>服务名称</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入服务名称"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <label>环境</label>
      <el-select v-model="searchData.tke" clearable placeholder="请选择环境">
        <el-option v-for="item in tkeTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <label>状态</label>
      <el-select v-model="searchData.status" clearable placeholder="请选择状态">
        <el-option v-for="item in tkeStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
        <el-table-column prop="id" label="id" align="center" width="100"></el-table-column>
        <el-table-column prop="projectName" label="服务名称" align="center" min-width="200"></el-table-column>
        <el-table-column prop="env" label="环境" align="center">
          <template slot-scope="scope">{{scope.row.env.replace("env", "tke")}}</template>
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status === 0" type="success" size="small" effect="plain">SUCCESS</el-tag>
            <el-tag v-if="scope.row.status === 1" type="danger" size="small" effect="plain">FAIL</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" align="center">
          <template slot-scope="scope">
            {{$utils.formatDate(scope.row.updateTime * 1000, 'yyyy-MM-dd hh:mm:ss')}}
          </template>
        </el-table-column>
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
        tke: '',
        status: '',
        page: 1,
        pageSize: 10
      },
      tkeTypeList: [
        { id: 'env-01', name: 'tke-01' },
        { id: 'env-02', name: 'tke-02' },
        { id: 'env-03', name: 'tke-03' },
        { id: 'env-04', name: 'tke-04' },
        { id: 'env-05', name: 'tke-05' },
        { id: 'env-06', name: 'tke-06' },
        { id: 'env-07', name: 'tke-07' },
        { id: 'env-08', name: 'tke-08' }
      ],
      tkeStatusList: [
        { id: '0', name: 'SUCCESS' },
        { id: '1', name: 'FAIL' }
      ],
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null
    }
  },
  methods: {
    // 获取表格数据
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      params.size = params.pageSize
      delete params.pageSize
      this.tableLoading = true
      this.$service.getServerStatusList(params).then(res => {
        this.tableData = res.data.projectStatusList
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>