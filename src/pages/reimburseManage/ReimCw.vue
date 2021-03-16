<style lang="scss">
.page-reimCw {
  .table-box {
    flex: 1;
    overflow: hidden;
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
  <div class="page page-reimCw">
    <div class="page-search-bar">
      <el-input
        v-model="searchData.condition"
        placeholder="申请人关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <download-excel
        style="display:inline-block;margin-left:10px"
        :fetch="getExcelDataByCW"
        :fields="json_fields"
        name="bb.xls">
        <el-button type="success" size="small" icon="el-icon-download" plain>导出excel</el-button>
      </download-excel>
      <el-input
        v-model="newWarnValue"
        placeholder="请输入核销阀值"
        clearable
        style="margin-left: 20px"></el-input>
      <el-button type="primary" size="small" @click="setWarnValue">设置阀值</el-button>
      <span style="margin-left: 10px;font-weight:bold">当前阀值：{{warnValue}}</span>
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
        <el-table-column prop="commitName" label="申请人" align="center" width="120"></el-table-column>
        <el-table-column prop="reimDesc" label="申请描述" align="center" width="200"></el-table-column>
        <el-table-column label="金额统计" align="center" width="150">
          <template slot-scope="scope">
            <div>实际金额：{{ scope.row.actAmount }}</div>
            <div>手续费：{{ scope.row.fee }}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单信息" align="center" width="300">
          <template slot-scope="scope">
            <div>
              报销单号：
              <div
                style="marginLeft:20px;color:red"
                v-for="item in scope.row.reimNums"
                :key="item">{{ item }}</div>
            </div>
            <div>
              订单描述：
              <div
                style="marginLeft:20px;color:red"
                v-for="item in scope.row.orderDescs"
                :key="item">{{ item }}</div>
            </div>
            <div>支付方式：{{ scope.row.payTypes }}</div>
            <div>支付环境：{{ scope.row.payEnvStr }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" min-width="150">
          <template slot-scope="scope">
            <div>
              <el-input
                type="textarea"
                :disabled="scope.row.disRemark"
                style="width:120px"
                v-model="scope.row.remark"
                size="mini"
              ></el-input>
            </div>
            <div style="marginTop:10px">
              <el-button
                size="mini"
                type="primary"
                @click="changeDisRemark(scope.row)"
              >{{ scope.row.disRemark ? "修改" : "确认"}}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="申请图片" align="center" width="150">
          <template slot-scope="scope">
            <VuePictureSwipe :items="scope.row.allImageBeans || []"></VuePictureSwipe>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="danger" size="mini" @click="checkUnPass(scope.row)">驳回</el-button>
            <br>
            <el-button type="primary" size="mini" style="margin-top:10px" @click="verification(scope.row)">核销</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="checkStatusStr" label="审核状态" align="center" width="110"></el-table-column>
        <el-table-column prop="auditorName" label="审核人" align="center" width="110"></el-table-column>
        <el-table-column prop="reimTime" label="报销时间" align="center" width="110"></el-table-column>
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
import VuePictureSwipe from 'vue-picture-swipe'
import Pagination from '@/components/Pagination'
import DownloadExcel from 'vue-json-excel'
import mixin from '@/mixins/mixin'
export default {
  components: { VuePictureSwipe, Pagination, DownloadExcel },
  mixins: [mixin],
  data () {
    return {
      searchData: {
        page: 1,
        pageSize: 10,
        condition: ''
      },
      warnValue: '',
      newWarnValue: '',
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      //需要导出的字段
      json_fields: {
        申请人: 'commitName',
        申请描述: 'reimDesc',
        // 申请金额: 'amount',
        实际金额: 'actAmount',
        手续费: 'fee',
        报销单号: {
          field: 'reimNums',
          callback: value => {
            var str = ''
            for (var i = 0; i < value.length; i++) {
              str += value[i] + '\n'
            }
            return str.substring(0, str.length - 1)
          }
        },
        订单描述: {
          field: 'orderDescs',
          callback: value => {
            var str = ''
            for (var i = 0; i < value.length; i++) {
              str += value[i] + '\n'
            }
            return str.substring(0, str.length - 1)
          }
        },
        支付方式: {
          field: 'payTypes',
          callback: value => {
            var str = ''
            for (var i = 0; i < value.length; i++) {
              str += value[i] + '\n'
            }
            return str.substring(0, str.length - 1)
          }
        },
        支付环境: 'payEnvStr',
        备注: 'remark',
        申请图片: {
          field: 'images',
          callback: value => {
            var str = ''
            for (var i = 0; i < value.length; i++) {
              str += value[i] + '\n'
            }
            return str.substring(0, str.length - 1);
          }
        },
        审核状态: 'checkStatusStr',
        报销时间: 'reimTime'
      }
    }
  },
  methods: {
    // 导出Excel
    async getExcelDataByCW () {
      const res = await this.$service.getExcelDataByCW()
      return res.data
    },
    // 核销
    verification(row) {
      this.$msgbox.confirm('是否核销该笔申请?', '核销', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.updateVerification({ reimId: row.id, verification: 1 }).then(() => {
          this.$message.success('已核销')
          this.getTableData()
        })
      })
    },
    // 驳回
    checkUnPass(row) {
      this.$prompt('请输入驳回原因', '驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        this.$service.cwCheckUnpass({ reimId: row.id, pass: 6, reason: value }).then(() => {
          this.$message.success('已驳回')
          this.getTableData()
        })
      })
    },
    // 设置阈值
    setWarnValue () {
      if (!this.newWarnValue) {
        this.$message.error('请输入阈值')
        return
      }
      this.$service.changeWarnValue({ warnValue: this.newWarnValue }).then(() => {
        this.$message.success('设置成功')
        this.warnValue = this.newWarnValue
        this.newWarnValue = ''
      })
    },
    // 切换备注输入状态
    changeDisRemark(row) {
      if (!row.disRemark) {
        this.$service.updateReimRemark({ reimId: row.id, remark: row.remark }).then(() => {
          this.$message.success('修改成功')
        })
      }
      row.disRemark = !row.disRemark;
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.tableData = []
      this.$service.getAllReimCheckCw(this.searchData).then(res => {
        this.tableData = res.data
        this.total = res.totalCount
        this.warnValue = res.extra.warnValue
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>