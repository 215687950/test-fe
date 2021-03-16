<style lang="scss">
.page-reimVeri {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
}
</style>
<template>
  <div class="page page-reimVeri">
    <div class="page-search-bar">
      <el-input
        v-model="searchData.condition"
        placeholder="申请人关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-search" @click="allComplete">全部完成</el-button>
      <download-excel
        style="display:inline-block;margin-left:10px"
        :fetch="getExcelDataVeri"
        :fields="json_fields"
        name="bb.xls">
        <el-button type="success" size="small" icon="el-icon-download" plain>导出excel</el-button>
      </download-excel>
      <span style="margin-left:20px;font-weight:bold">当前未打款总金额：{{totalAmount}}</span>
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
        <el-table-column prop="commitName" label="申请人" align="center" width="100"></el-table-column>
        <el-table-column prop="reimDesc" label="申请描述" align="center" min-width="200"></el-table-column>
        <el-table-column label="金额统计" align="center" width="140">
          <template slot-scope="scope">
            <div>实际金额: {{ scope.row.actAmount }}</div>
            <div>手续费: {{ scope.row.fee }}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单信息" align="center" width="280">
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
        <el-table-column prop="remark" label="备注" align="center" width="180"></el-table-column>
        <el-table-column label="申请图片" align="center" width="150">
          <template slot-scope="scope">
            <VuePictureSwipe :items="scope.row.allImageBeans || []"></VuePictureSwipe>
          </template>
        </el-table-column>
        <el-table-column prop="checkStatusStr" label="审核状态" align="center" width="130"></el-table-column>
        <el-table-column prop="auditorName" label="审核人" align="center" width="100"></el-table-column>
        <el-table-column prop="reimTime" label="报销时间" align="center" width="170"></el-table-column>
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
      totalAmount: '',
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      json_fields: {
        申请人: 'commitName',
        申请描述: 'reimDesc',
        // 申请金额: 'amount',
        实际金额: 'actAmount',
        手续费: 'fee',
        报销单号: {
          field: 'reimNums',
          callback: value => {
            var str = '';
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
            var str = '';
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
            return str.substring(0, str.length - 1)
          }
        },
        审核状态: 'checkStatus',
        报销时间: 'reimTime'
      }
    }
  },
  methods: {
    // 导出Excel
    async getExcelDataVeri () {
      const res = await this.$service.getExcelDataVeri()
      return res.data
    },
    // 全部完成
    allComplete () {
      this.$msgbox.confirm('是否确认已全部打款?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.reimveriAllComplete().then(() => {
          this.$message.success('请求成功')
          this.getTableData()
        })
      })
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.tableData = []
      this.$service.getAllReimVeri(this.searchData).then(res => {
        this.tableData = res.data
        this.total = res.totalCount
        this.totalAmount = res.extra.totalAmount
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>