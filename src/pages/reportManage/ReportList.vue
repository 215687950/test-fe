<style lang="scss">
.page-reportList {
  .table-box {
    flex: 1;
    overflow: hidden;
    .href_style {
      font-weight: bold;
      text-decoration: none;
      color: #67C23A;
      &:hover {
        text-decoration: underline;
      }
    }
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
  <div class="page page-reportList">
    <div class="page-search-bar">
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入迭代名"
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
        <el-table-column label="迭代名" align="center" min-width="200">
          <template slot-scope="scope">
            <a
              :href="scope.row.projUrl"
              target="_blank"
              class="href_style"
              :title="'跳转埋点: ' + scope.row.projUrl">{{ scope.row.projName }}</a>
          </template>
        </el-table-column>
        <el-table-column prop="projPm" label="PM" align="center"></el-table-column>
        <el-table-column prop="projPo" label="PO" align="center"></el-table-column>
        <el-table-column prop="businessName" label="业务方" align="center"></el-table-column>
        <el-table-column prop="createUserAccount" label="创建人" align="center"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center" width="170"></el-table-column>
        <el-table-column prop="updateTime" label="最后修改时间" align="center" width="170"></el-table-column>
        <el-table-column label="操作" align="center" width="170">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="light" content="查看" placement="top">
                <el-button
                  :loading="activeIndex === scope.$index && editLoading"
                  type="success"
                  size="mini"
                  icon="el-icon-s-order"
                  @click="handleView(scope.row, scope.$index)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="编辑" placement="top">
                <el-button type="primary" size="mini" icon="el-icon-edit" @click="handleEdit(scope.row.id)"></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="删除" placement="top">
                <el-button type="danger" size="mini" icon="el-icon-delete" @click="handleDel(scope.row.id)"></el-button>
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
    <Drawer :data="drawerData" :visible="showDrawer"></Drawer>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import Drawer from './components/ReportListDrawer'
import mixin from '@/mixins/mixin'
export default {
  components: { Pagination, Drawer },
  mixins: [mixin],
  data () {
    return {
      searchData: {
        keywords: '',
        page: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      editLoading: false,
      showDrawer: false,
      activeIndex: '',
      drawerData: {}
    }
  },
  methods: {
    handleView (row, index) {
      this.activeIndex = index
      this.editLoading = true
      this.$service.getIterationDetail({ id: row.id }).then(res => {
        this.drawerData = res.data
        this.drawerData.creatorName = row.createUserAccount
        this.showDrawer = true
      }).finally(() => {
        this.editLoading = false
      })
    },
    handleEdit (id) {
      // this.$router.push(`/reportSetting/edit/${id}`)
      this.$router.push({
        name: "reportSetting",
        params: {
          projDataId: id
        }
      })
    },
    // 删除
    handleDel (id) {
      this.$msgbox.confirm('确认删除此条数据?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.delIterationPoint({ id }).then(() => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      })
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.getIterationPoint(this.searchData).then(res => {
        this.tableData = res.data.data
        this.total = res.data.totalCount
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>