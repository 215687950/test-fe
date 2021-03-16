<style lang="scss">
.page-pathCheckReport {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #eee;
  .wrapper {
    position: absolute;
    left: 10px;
    right: 10px;
    top: 10px;
    bottom: 10px;
    background: #fff;
    display: flex;
    flex-direction: column;
    .header {
      display: flex;
      justify-content: space-between;
      padding: 10px 10px 6px;
      border-bottom: 1px solid #ccc;
      font-size: 12px;
      font-weight: bold;
    }
    .body {
      flex: 1;
      overflow: hidden;
      padding: 10px;
      display: flex;
      flex-direction: column;
      .table-box {
        flex: 1;
        overflow: hidden;
      }
    }
  }
}
</style>
<template>
  <div class="page page-pathCheckReport">
    <div class="wrapper">
      <div class="header">
        <div>{{taskName}} > 检测报告</div>
        <div>
          <span style="color: blue; margin-right:16px;">总：{{total}}个</span>
          <span style="color: red; margin-right:16px">需新增：{{addCount}}个</span>
          <span style="color: gray;">需废弃：{{delCount}}个</span>
        </div>
      </div>
      <div class="body">
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
            <el-table-column prop="id" label="序号" align="center"></el-table-column>
            <el-table-column prop="host" label="host" align="center"></el-table-column>
            <el-table-column prop="uri" label="接口url" align="center"></el-table-column>
            <el-table-column prop="type" label="校验结果" align="center">
              <template slot-scope="{row}">
                <el-tag v-if="row.type === 0" type="info" size="small">需废弃</el-tag>
                <el-tag v-if="row.type === 1" type="danger" size="small">需新增</el-tag>
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
    </div>
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
      taskName: this.$route.params.name,
      searchData: {
        taskId: this.$route.params.id,
        page: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      addCount: 0,
      delCount: 0,
      tableHeight: null
    }
  },
  methods: {
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.mockCompareGetResultList(this.searchData).then(res => {
        this.tableData = res.data.resultList
        this.total = res.data.totalCount
        this.addCount = res.data.addCount
        this.delCount = res.data.delCount
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>