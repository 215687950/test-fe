<style lang="scss">
.page-pathCheck {
  .table-box {
    flex: 1;
    overflow: hidden;
    .fresh-btn {
      margin-left: 10px;
      font-weight: bold;
      font-size:16px;
      cursor: pointer;
    }
  }
}
</style>
<template>
  <div class="page page-pathCheck">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keyWord"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
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
        <el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column prop="taskName" label="检测项目任务名称" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column prop="isDel" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="success" plain @click="goReport(scope.row)">查看报告</el-button>
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
        page: 1,
        pageSize: 10,
        keyWord: ''
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null
    }
  },
  methods: {
    goReport (row) {
      this.$router.push(`/pathCheckReport/${row.id}/${encodeURIComponent(row.taskName)}`)
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.mockCompareGetTaskList(this.searchData).then(res => {
        this.tableData = res.data.taskList
        this.total = res.data.totalCount
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>