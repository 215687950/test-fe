<style lang="scss">
.page-reportData {
  .page-search-bar {
    .width300 .el-input {
      width: 300px;
    }
  }
  .table-box {
    flex: 1;
    overflow: hidden;
    .el-table__body-wrapper {
      overflow-y: auto;
    }
    .error-info {
      width: 300px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  .el-dialog__wrapper.report-detail-dialog {
    .el-dialog__body {
      padding-top: 10px;
      min-height: 320px;
    }
    label {
      margin-right: 10px;
    }
    .el-input,
    .el-date-editor.el-input,
    .el-select {
      width: 200px;
    }
  }
}
</style>
<template>
  <div class="page page-reportData">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-select
        class="width300"
        v-model="searchData.projDataId"
        remote
        filterable
        :remote-method="getIterationList"
        :loading="iterationLoading"
        size="small"
        placeholder="请输入迭代关键词">
        <el-option
          v-for="item in iterationList"
          :key="item.id"
          :label="item.projName"
          :value="item.id"></el-option>
      </el-select>
      <label>环境</label>
      <el-select v-model="searchData.env" placeholder="请选择环境">
        <el-option v-for="item in envList" :key="item.id" :label="item.name" :value="item.value"></el-option>
      </el-select>
      <label>uuri</label>
      <el-input v-model="searchData.uuri" placeholder="请输入uuri" clearable></el-input>
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
        <el-table-column prop="" label="序号" align="center" width="80">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="dpId" label="埋点Id" align="center" width="80"></el-table-column>
        <el-table-column prop="dpDataDesc" label="埋点信息" align="center" width="200"></el-table-column>
        <el-table-column label="Image" align="center" width="150">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.image"
              :preview-src-list="viewPicture(scope.row.image)"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="Type" align="center" width="150"></el-table-column>
        <el-table-column label="PageName" align="center" min-width="2">
          <template slot-scope="scope">
            <div
              v-for="item in scope.row.pageNameList"
              :key="item.pageName"
              style="text-align:left">{{ item.pageName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="最后一次上报情况" align="center" min-width="1">
          <template slot-scope="scope">
            <el-tooltip
              placement="right-start"
              v-for="item in scope.row.results"
              :key="item.webType"
              style="margin:0 5px 5px 0">
              <div slot="content">
                  <div v-if="item.reportId !== ''">reportId:{{ item.reportId }}</div>
                  <div v-if="item.infoId !== ''">infoId:{{ item.infoId }}</div>
                  <div>上报端：{{ item.webType }}</div>
                  <div v-if="item.createTime !== ''">上报时间：{{ item.createTime }}</div>
                  <div v-if="item.userName !== ''">操作人：{{ item.userName }}</div>
                  <div v-if="item.errorInfo.length > 0" class="error-info">错误信息：{{ item.errorInfo }}</div>
                </div>
              <el-tag :type="getStatusTag(item.status)" @click="showExpressDetail(item)">{{ item.webType }}</el-tag>
            </el-tooltip>
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
      class="report-detail-dialog"
      title="上报详情"
      :visible.sync="showDialog"
      width="800px"
      @close="dialogClose">
      <el-tabs v-model="activeName">
        <el-tab-pane label="上报详情" name="reportInfo">
          <div style="margin-bottom:16px">
            <label>上报端</label>
            <el-input v-model="reportDetail.webType" disabled style="margin-right: 20px"></el-input>
            <label>上报时间</label>
            <el-input v-model="reportDetail.createTime" disabled></el-input>
          </div>
          <div>
            <label>上报人</label>
            <el-input v-model="reportDetail.userName" disabled style="margin-right: 20px"></el-input>
            <label>上报结果</label>
            <el-input v-model="reportDetail.statusName" disabled></el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane label="上报数据" name="reportData" :disabled="reportDetail.status === -1">
          <el-input type="textarea" :rows="10" v-model="reportData" :disabled="true"></el-input>
        </el-tab-pane>
        <el-tab-pane label="错误详情" name="errorInfo" :disabled="reportDetail.status === 1">
          <el-input type="textarea" :rows="10" v-model="reportDetail.errorInfo" :disabled="true"></el-input>
        </el-tab-pane>
        <el-tab-pane label="原始错误详情" name="errorLog" :disabled="reportDetail.status === 1">
          <el-input type="textarea" :rows="10" v-model="reportInfoObj.errorLog" :disabled="true"></el-input>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data () {
    return {
      timer: null,
      searchData: {
        projDataId: '',
        env: '',
        uuri: '',
        page: 1,
        pageSize: 10
      },
      iterationList: [],
      iterationLoading: false,
      envList: [
        { id: 1, name: 'TKE01', value: 'tke_01' },
        { id: 2, name: 'TKE02', value: 'tke_02' },
        { id: 3, name: 'TKE03', value: 'tke_03' },
        { id: 4, name: 'TKE04', value: 'tke_04' },
        { id: 5, name: 'TKE05', value: 'tke_05' },
        { id: 6, name: 'TKE06', value: 'tke_06' },
        { id: 7, name: 'TKE07', value: 'tke_07' },
        { id: 11, name: '灰度1', value: 'grey_01' },
        { id: 12, name: '灰度2', value: 'grey_02' }
      ],
      tableHeight: null,
      tableLoading: false,
      tableData: [],
      total: 0,
      showDialog: false,
      activeName: 'reportInfo',
      reportDetail: {},
      reportInfoObj: {},
      reportData: ''
    }
  },
  mounted () {
    this.tableHeight = this.$refs['table-box'].offsetHeight
    window.onresize = () => {
      this.tableHeight = this.$refs['table-box'].offsetHeight
    }
  },
  destroyed () {
    clearInterval(this.timer)
  },
  methods: {
    showExpressDetail (item) {
      this.reportDetail = item
      this.reportDetail.statusName = item.status === -1
        ? "未上报"
        : status === 0
        ? "上报失败"
        : status === 1
        ? "上报成功"
        : "未知上报"
      if (item.status !== -1) {
        this.$service.selectReportInfo({ infoId: item.infoId }).then(res => {
          this.reportInfoObj = res.data
          this.reportData = JSON.stringify(JSON.parse(this.reportInfoObj.reportData),null,"\t")
        })
      }
      this.showDialog = true
    },
    dialogClose () {
      this.activeName = 'reportInfo',
      this.reportDetail = {},
      this.reportInfoObj = {},
      this.reportData = ''
    },
    getStatusTag(status) {
      return status == -1
        ? "danger"
        : status == 0
        ? "warning"
        : status == 1
        ? "success"
        : "info"
    },
    // 转为array格式
    viewPicture(imageUrl) {
      return [imageUrl]
    },
    // 搜索
    search () {
      this.searchData.page = 1
      this.getTableData()
    },
    // 切换每页条数
    handleSizeChange (value) {
      this.searchData.pageSize = value
      this.searchData.page = 1
      this.getTableData()
    },
    // 切换页码
    handleCurrentChange (value) {
      this.searchData.page = value
      this.getTableData()
    },
    // 获取表格数据
    getTableData () {
      if (!this.searchData.projDataId || !this.searchData.env) {
        this.$message.error('关键字和环境不能为空')
        return
      }
      this.tableLoading = true
      this.$service.listReportData(this.searchData).then(res => {
        this.$message.success('埋点上报数据已刷新')
        this.tableData = res.data.dataList
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
        if (!this.timer) {
          this.timer = setInterval(() => {
            this.getTableData()
          }, 1000 * 10)
        }
      })
    },
    // 迭代
    getIterationList (query) {
      if (query !== '') {
        this.iterationLoading = true
        this.$service.getIterationList({ keywords: query }).then(res => {
          this.iterationList = res.data
        }).finally(() => {
          this.iterationLoading = false
        })
      } else {
        this.iterationList = []
      }
    }
  }
}
</script>