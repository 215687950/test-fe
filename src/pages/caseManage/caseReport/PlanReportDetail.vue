<style lang="scss">
.page-planReportDetail {
  padding-top: 60px;
  header {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 60px;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: rgba(216, 221, 228, 0.5) 0px 1px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 4px 0px;
    .left {
      color: #202d40;
      font-weight: bold;
      font-size: 20px;
    }
  }
  main {
    flex: 1;
    overflow: auto;
    padding: 0 14px;
    .info {
      padding: 10px 0 20px 0;
      display: flex;
      margin-bottom: 20px;
      font-size: 13px;
      border-bottom: 1px solid #00000012;
      &-left {
        width: 50%;
        padding-right: 50px;
      }
      &-right {
        width: 50%;
        padding-left: 50px;
        border-left: 1px solid #00000012;
      }
      .title {
        color: #9199a3;
        margin-bottom: 10px;
        i {
          margin-right: 4px;
        }
        .text-btn {
          cursor: pointer;
          color: #06f;
        }
      }
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
  <div class="page page-planReportDetail">
    <header>
      <div class="left">{{reportInfo.name}}</div>
      <div>
        <span style="font-weight: bold;color: #202d40;">{{reportInfo.creator}}</span>
        <span style="font-size: 12px;color: #9199a3;">
          <span style="margin: 0 5px;">创建于</span>{{reportInfo.createTime}}
        </span>
      </div>
    </header>
    <main>
      <section class="info">
        <div class="info-left">
          <div class="title">
            <i class="el-icon-document-checked"></i>
            <span>报告总结</span>
            <span>
              <span style="color: #00000012;margin: 0px 8px;">|</span>
              <span class="text-btn" v-if="!showEdit.conclusion" @click="edit('conclusion')">编辑</span>
              <span v-else>
                <span class="text-btn" @click="save('conclusion')">保存</span>
                <span style="color: #00000012;margin: 0px 8px;">|</span>
                <span class="text-btn" @click="cancel('conclusion')">取消</span>
              </span>
            </span>
          </div>
          <div v-if="!showEdit.conclusion" v-html="reportInfo.conclusionView"></div>
          <div v-else>
            <el-input v-model="editText.conclusion" type="textarea" :rows="3"></el-input>
          </div>
        </div>
        <div class="info-right">
          <div class="title">
            <i class="el-icon-document-delete"></i>
            <span>风险</span>
            <span>
              <span style="color: #00000012;margin: 0px 8px;">|</span>
              <span class="text-btn" v-if="!showEdit.risk" @click="edit('risk')">编辑</span>
              <span v-else>
                <span class="text-btn" @click="save('risk')">保存</span>
                <span style="color: #00000012;margin: 0px 8px;">|</span>
                <span class="text-btn" @click="cancel('risk')">取消</span>
              </span>
            </span>
          </div>
          <div v-if="!showEdit.risk" v-html="reportInfo.riskView"></div>
          <div v-else>
            <el-input v-model="editText.risk" type="textarea" :rows="3"></el-input>
          </div>
        </div>
      </section>
      <div class="table-box progress">
        <div class="table-box-title">测试用例分布统计</div>
        <el-table
          :data="reportInfo.planProgress"
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
          <tbody v-if="reportInfo.userProgress && reportInfo.userProgress.length">
            <template v-for="(rows, index1) in reportInfo.userProgress">
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
export default {
  data () {
    return {
      reportInfo: {},
      showEdit: {
        conclusion: false,
        risk: false
      },
      editText: {
        conclusion: '',
        risk: ''
      }
    }
  },
  watch: {
    'reportInfo.conclusion' (value) {
      this.reportInfo.conclusionView = value.replace(/\n/g,'<br/>')
    },
    'reportInfo.risk' (value) {
      this.reportInfo.riskView = value.replace(/\n/g,'<br/>')
    }
  },
  created () {
    this.getReportDetail()
  },
  methods: {
    edit (type) {
      this.editText[type] = this.reportInfo[type]
      this.showEdit[type] = true
    },
    save (type) {
      this.$service.updateReport({
        id: this.$route.params.id,
        [type]: this.editText[type]
      }).then(() => {
        this.$message.success('保存成功')
        this.reportInfo[type] = this.editText[type]
        this.editText[type] = ''
        this.showEdit[type] = false
      })
    },
    cancel (type) {
      this.editText[type] = ''
      this.showEdit[type] = false
    },
    getReportDetail () {
      this.$service.getReportDetail({ id: this.$route.params.id }).then(res => {
        this.reportInfo = res.data
      })
    }
  }
}
</script>