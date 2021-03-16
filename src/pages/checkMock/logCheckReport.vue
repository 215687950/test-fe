<style lang="scss">
.page-logCheckReport {
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
      .el-radio-button {
        .el-radio-button__inner {
          width: 80px;
        }
        &:first-child,
        &:last-child {
          .el-radio-button__inner {
            border-radius: 0;
          }
        }
      }
      .table-box {
        flex: 1;
        overflow: hidden;
      }
    }
    .result-dialog.el-dialog__wrapper {
      .el-dialog__header {
        display: none !important;
      }
      .el-dialog__body {
        padding: 0;
        table {
          color: #000;
          .warning-row {
            background: #EAA3A3;
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="page page-logCheckReport">
    <div class="wrapper">
      <div class="header">
        <div>{{taskName}} > 检测报告</div>
        <div>
          <span style="color: blue; margin-right:16px;">总：{{total}}个</span>
          <span style="color: green; margin-right:16px">检测成功：{{sucCount}}个</span>
          <span style="color: red; margin-right:16px">待更新：{{needUpdateCount}}个</span>
          <span style="color: gray;">未检测到：{{unCheckedCount}}个</span>
        </div>
      </div>
      <div class="body">
        <el-radio-group v-model="searchData.type" size="small" @change="search">
          <el-radio-button label="总"></el-radio-button>
          <el-radio-button label="检测正确"></el-radio-button>
          <el-radio-button label="检测失败"></el-radio-button>
          <el-radio-button label="未检测"></el-radio-button>
        </el-radio-group>
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
            <el-table-column prop="uri" label="接口url" align="center"></el-table-column>
            <el-table-column prop="type" label="校验结果" align="center">
              <template slot-scope="{row}">
                <el-button v-if="row.type === 0" type="success" size="small">检测正确</el-button>
                <el-button v-if="row.type === 1" type="danger" size="small" @click="viewResult(row)">查看结果</el-button>
                <el-button v-if="row.type === 2" type="info" size="small">未检测</el-button>
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
          class="result-dialog"
          :visible.sync="viewResultDialogVisible"
          width="30%">
          <el-table
            :data="resultData"
            border
            :show-header="false"
            style="width: 100%"
            :cell-class-name="tableClassName">
            <el-table-column prop="error" align="center"></el-table-column>
            <el-table-column prop="result" align="center"></el-table-column>
          </el-table>
        </el-dialog>
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
        type: '总',
        page: 1,
        pageSize: 10
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      sucCount: 0,
      needUpdateCount: 0,
      unCheckedCount: 0,
      tableHeight: null,
      viewResultDialogVisible: false,
      resultData: []
    }
  },
  methods: {
    viewResult (row) {
      this.resultData = []
      this.resultData.push({ error: '请求方式', result: row.methodError})
      this.resultData.push({ error: '请求参数', result: row.paramError})
      this.resultData.push({ error: '返回数据', result: row.respError})
      this.viewResultDialogVisible = true
    },
    tableClassName ({columnIndex}) {
      if (columnIndex === 1) {
        return 'warning-row';
      }
      return '';
    },
    // 类型过滤
    search () {
      this.searchData.page = 1
      this.getTableData()
    },
    // 获取表格数据
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      switch (params.type) {
        case '总':
          params.type = -1
          break
        case '检测正确':
          params.type = 0
          break
        case '检测失败':
          params.type = 1
          break
        case '未检测':
          params.type = 2
          break
      }
      this.tableLoading = true
      this.$service.mockCompareGetLogResultList(params).then(res => {
        this.tableData = res.data.resultList
        this.total = res.data.totalCount
        this.sucCount = res.data.sucCount
        this.needUpdateCount = res.data.needUpdateCount
        this.unCheckedCount = res.data.unCheckedCount
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>