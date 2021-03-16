<style lang="scss">
.page-dataFactoryLots {
  flex-direction: row;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: #f5f5f5;
  &-left {
    width: 340px;
    padding: 16px 20px;
    margin-right: 20px;
    background: #fff;
    overflow-y: auto;
  }
  &-right {
    flex: 1;
    overflow: hidden;
    padding: 20px;
    background: #fff;
    display: flex;
    flex-direction: column;
    .table-box {
      flex: 1;
      overflow: hidden;
    }
    textarea {
      background: #f5f5f5;
    }
  }
}
</style>
<template>
  <div class="page page-dataFactoryLots">
    <section class="page-dataFactoryLots-left">
      <DynamicElement :eleList="eleList" @on-submit="submit" :loading="submitLoading"></DynamicElement>
    </section>
    <section class="page-dataFactoryLots-right">
      <div style="text-align:right;margin-bottom: 10px">
        <el-button type="success" icon="el-icon-refresh-left" size="small" @click="getTableData">刷新</el-button>
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
          <el-table-column prop="id" label="ID" align="center" width="60"></el-table-column>
          <el-table-column prop="env" label="环境" align="center"></el-table-column>
          <el-table-column prop="shoper" label="商家" align="center"></el-table-column>
          <el-table-column prop="userName" label="创建人" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-if="scope.row.logStatus === 0" type="info" size="mini" plain disabled>执行中</el-button>
              <el-button v-if="scope.row.logStatus === 1" type="success" size="mini" plain @click="handleView(scope.row.result, 1)">查看结果</el-button>
              <el-button v-if="scope.row.logStatus === 2" type="danger" size="mini" plain @click="handleView(scope.row.result, 2)">执行失败</el-button>
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
        title="查看详情"
        :visible.sync="showDialog"
        center
        width="630px">
        <el-input v-model="resultValue" rows="20" type="textarea"></el-input>
      </el-dialog>
    </section>
  </div>
</template>
<script>
import DynamicElement from './components/DynamicElement'
import Pagination from '@/components/Pagination'
import mixin from '@/mixins/mixin'
export default {
  components: { DynamicElement, Pagination },
  mixins: [mixin],
  data () {
    return {
      eleList: [],
      submitLoading: false,
      searchData: {
        page: 1,
        pageSize: 10,
        creator: this.$store.state.userInfo.account
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      showDialog: false,
      resultValue: ''
    }
  },
  created () {
    this.saleGetInfo()
  },
  methods: {
    handleView (value, status) {
      if (status === 1) {
        try {
          this.resultValue = JSON.stringify(JSON.parse(value), null, 2)
        } catch (err) {
          this.$message.error(err)
        }
      } else if (status === 2) {
        this.resultValue = value
      }
      this.showDialog = true
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.getSaleRecords(this.searchData).then(res => {
        this.tableData = res.data.items
        this.total = res.data.totalCount
      }).finally(() => {
        this.tableLoading = false
      })
    },
    submit (params) {
      this.submitLoading = true
      this.$service.salePublish(params).then(res => {
        this.$message.success('提交成功')
        this.getTableData()
        try {
          this.resultVaule = JSON.stringify(res.data, null, '\t')
        } catch (err) {
          this.$message.error(err)
        }
      }).finally(() => {
        this.submitLoading = false
      })
    },
    // 获取字典
    saleGetInfo () {
      this.$service.saleGetInfo().then(res => {
        this.$store.commit('dataFactoryEnvList', res.data.envList)
        this.eleList = res.data.valueList
      })
    }
  }
}
</script>