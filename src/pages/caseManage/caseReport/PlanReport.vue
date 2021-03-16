<style lang="scss">
.page-planReport {
  &-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    height: 50px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 0 8px 0 rgba(0,0,0,.1);
  }
  &-main {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background: #f5f5f5;
    &-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 20px;
      background: #fff;
      .page-search-bar {
        position: relative;
        .only-my {
          position: absolute;
          right: 0;
          display: flex;
          align-items: center;
          font-size: 12px;
          color: #888;
          .el-switch {
            margin-left: 5px;
            .el-switch__core {
              height: 8px;
              background: #e4e7ec;
              &::after {
                top: -5px;
                left: -1px;
                background: #a3acb8;
              }
            }
          }
          .el-switch.is-checked {
            .el-switch__core {
              background: #409eff4d;
              &::after {
                margin-left: 12px;
                background: #409EFF;
              }
            }
          }
        }
      }
      .table-box {
        flex: 1;
        .el-table {
          th, td {
            padding: 14px 0;
            height: 30px;
            line-height: 30px;
          }
          td {
            color: #333;
            cursor: pointer;
          }
          .el-table__header {
            th {
              background: #fff;
              color: #888;
              font-weight: normal;
            }
          }
          .handle-box {
            .text-btn {
              color: #409EFF;
            }
            .line {
              margin: 0 10px;
              color: rgba(0,0,0,.1);
            }
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="page page-planReport">
    <header class="page-planReport-header">
      <div>报告管理</div>
    </header>
    <main class="page-planReport-main">
      <div class="page-planReport-main-wrapper">
        <div class="page-search-bar">
          <label>创建时间</label>
          <el-date-picker
            v-model="searchData.startTime"
            value-format="yyyy-MM-dd"
            placeholder="请选择时间"
            style="width:150px;margin-right:0"
            :picker-options="pickerOptions1"></el-date-picker>
          <span style="margin: 0 5px">至</span>
          <el-date-picker
            v-model="searchData.endTime"
            value-format="yyyy-MM-dd"
            placeholder="请选择时间"
            style="width:150px"
            :picker-options="pickerOptions2"></el-date-picker>
          <label>报告名称</label>
          <el-input
            v-model="searchData.title"
            clearable
            placeholder="请输入关键字"
            style="width:200px;"
             @keyup.enter.native="search"></el-input>
          <el-button type="primary" icon="el-icon-search" size="small" @click="search">查询</el-button>
          <el-button type="info" icon="el-icon-refresh" size="small" @click="reset">重置</el-button>
          <div class="only-my">
            只看我创建的
            <el-switch v-model="onlyMy" :width="28" @change="getTableData"></el-switch>
          </div>
        </div>
        <div class="table-box" ref="table-box">
          <el-table
            :data="tableData"
            v-loading="tableLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="#FFFAFA)"
            :height="tableHeight"
            style="width: 100%">
            <el-table-column label="报告名称" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="180"></el-table-column>
            <el-table-column label="时间范围" width="350">
              <template slot-scope="scope">
                {{scope.row.startTime}}
                <span>至</span>
                {{scope.row.endTime}}
              </template>
            </el-table-column>
            <el-table-column label="创建人" prop="creator" width="100"></el-table-column>
            <el-table-column label="状态" prop="status" width="80">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.status === 1" type="danger" size="small" effect="plain">未生成</el-tag>
                <el-tag v-if="scope.row.status === 2" type="success" size="small" effect="plain">已生成</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <div v-if="scope.row.status === 1" class="handle-box">
                  <span class="text-btn" @click="handleProgress(scope.row)">查看进度</span>
                </div>
                <div v-if="scope.row.status === 2" class="handle-box">
                  <span class="text-btn" @click="handleView(scope.row)">查看报告</span>
                  <span class="line">|</span>
                  <span class="text-btn" @click="handleDel(scope.row)">删除</span>
                </div>
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
    </main>
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
      pickerOptions1: {
        disabledDate: time => {
          if (this.searchData.endTime) {
            return (
              time.getTime() > new Date(this.searchData.endTime).getTime() ||
              time.getTime() > Date.now()
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      pickerOptions2: {
        disabledDate: time => {
          if (this.searchData.startTime) {
            return (
              time.getTime() < new Date(this.searchData.startTime).getTime() - 24 * 3600 * 1000 ||
              time.getTime() > Date.now()
            )
          } else {
            return time.getTime() > Date.now()
          }
        }
      },
      searchData: {
        startTime: '',
        endTime: '',
        title: '',
        page: 1,
        pageSize: 10
      },
      onlyMy: false,
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null
    }
  },
  methods: {
    handleProgress (row) {
      this.$router.push(`/planReport/planProgress/${row.executionPlanId}`)
    },
    handleView (row) {
      this.$router.push(`/planReportDetail/${row.id}`)
    },
    handleDel (row) {
      this.$msgbox.confirm('确认删除此报告?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.delReport({ id: row.id }).then(() => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      })
    },
    reset () {
      this.searchData = {
        startTime: '',
        endTime: '',
        title: '',
        page: 1,
        pageSize: 10
      }
      this.getTableData()
    },
    // 获取表格数据
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      if (this.onlyMy) {
        params.creatorList = [this.$store.state.userInfo.name]
      }
      this.tableData = []
      this.tableLoading = true
      this.$service.getReportList(params).then(res => {
        this.tableData = res.data.list
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>