<style lang="scss">
.page-plan-progress {
  header {
    height: 40px;
    display: flex;
    align-items: center;
    margin:10px 0 20px;
    .result-info {
      font-size: 18px;
      margin-right: 20px;
      .split {
        margin: 0 10px;
      }
    }
    .component-result-bar {
      width: 400px;
    }
  }
  main {
    .title {
      margin-bottom: 30px;
    }
    .table-box {
      height: 401px;
      overflow-y: auto;
      margin-bottom: 20px;
      padding: 0 16px;
      border: 1px solid #EBEEF5;
      &-title {
        height: 48px;
        line-height: 48px;
        background: #f7f8f9;
        margin: 0 -16px;
        padding: 0 16px;
      }
    }
    .progress {
      .el-table {
        th, td {
          padding: 8px 0;
          background: #fff;
          .cell {
            padding: 0;
          }
        }
      }
    }
    .user {
      table {
        width: 100%;
        font-size: 14px;
        color: #606266;
        tr:hover {
          background: #F5F7FA;
        }
        th, td {
          height: 40px;
          border-bottom: 1px solid #EBEEF5;
        }
        th {
          text-align: left;
          color: #606266;
        }
      }
    }
  }
}
</style>
<template>
  <div class="page page-plan-progress" v-loading="loading">
    <header v-if="!loading">
      <div class="result-info">
        <span>{{result.caseResult.successCount === 0 ? '0%' : ((result.caseResult.successCount / result.caseResult.totalCount) * 100).toFixed(2) + '%'}}测试通过</span>
        <span class="split">·</span>
        <span>已测用例{{result.caseResult.totalCount - result.caseResult.pendingCount}}/{{result.caseResult.totalCount}}</span>
      </div>
      <ResultBar :result="result.caseResult"></ResultBar>
    </header>
    <main>
      <div class="table-box progress">
        <div class="table-box-title">测试用例分布统计</div>
        <el-table
          :data="result.planProgress"
          style="width: 100%">
          <el-table-column
            prop="date"
            label="日期"
            width="200">
          </el-table-column>
          <el-table-column
            prop="totalCount"
            label="总计">
          </el-table-column>
          <el-table-column
            prop="successCount"
            label="通过">
          </el-table-column>
          <el-table-column
            prop="failCount"
            label="失败">
          </el-table-column>
          <el-table-column
            prop="blockCount"
            label="阻塞">
          </el-table-column>
          <el-table-column
            prop="pendingCount"
            label="未测">
          </el-table-column>
        </el-table>
      </div>
      <div class="table-box user">
        <div class="table-box-title">测试成员用例分布统计</div>
        <table border="0" cellspacing="0" cellpadding="0">
          <thead>
            <th style="width:200px">日期</th>
            <th>测试成员</th>
            <th>总计</th>
            <th>通过</th>
            <th>失败</th>
            <th>阻塞</th>
            <th>未测</th>
          </thead>
          <tbody v-if="result.userProgress && result.userProgress.length">
            <template v-for="(rows, index1) in result.userProgress">
              <tr v-for="(row, index2) in rows.progress" :key="index1 + '' + index2">
                <td v-if="index2 === 0" :rowspan="rows.progress.length">{{row.date}}</td>
                <td>{{row.operator}}</td>
                <td>{{row.totalCount}}</td>
                <td>{{row.successCount}}</td>
                <td>{{row.failCount}}</td>
                <td>{{row.blockCount}}</td>
                <td>{{row.pendingCount}}</td>
              </tr>
            </template>
          </tbody>
          <tbody v-else>
            <tr><td style="height:60px;text-align:center;color:#999" :colspan="7">暂无数据</td></tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</template>
<script>
import ResultBar from './components/ResultBar'
export default {
  components: { ResultBar },
  data () {
    return {
      loading: false,
      result: []
    }
  },
  created () {
    this.getPlanTestProgress()
  },
  methods: {
    getPlanTestProgress () {
      this.loading = true
      this.$service.getPlanTestProgress({ planId: this.$route.params.id }).then(res => {
        this.result = res.data
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>