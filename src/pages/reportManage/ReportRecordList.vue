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
  .el-dialog__wrapper.repeatReport-dialog {
    .el-dialog__body {
      min-height: 500px;
    }
    .el-divider {
      background-color: #8cc5ff;
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
        placeholder="请输入迭代关键词"
      >
        <el-option
          v-for="item in iterationList"
          :key="item.id"
          :label="item.projName"
          :value="item.id"
        ></el-option>
      </el-select>
      <label>环境</label>
      <el-select v-model="searchData.env" placeholder="请选择环境">
        <el-option
          v-for="item in envList"
          :key="item.id"
          :label="item.name"
          :value="item.value"
        ></el-option>
      </el-select>
      <label>uuri</label>
      <el-input
        v-model="searchData.uuri"
        placeholder="请输入uuri"
        clearable
      ></el-input>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="search"
        >搜索</el-button
      >
      <el-button type="info" size="small" @click="viewRepeatReport">查看重复上报</el-button>
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
        style="width: 100%"
      >
        <el-table-column prop="" label="序号" align="center" width="80">
          <template slot-scope="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column
          prop="dpId"
          label="埋点Id"
          align="center"
          width="80"
        ></el-table-column>
        <el-table-column
          prop="dpDataDesc"
          label="埋点信息"
          align="center"
          width="200"
        ></el-table-column>
        <el-table-column label="Image" align="center" width="150">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.image"
              :preview-src-list="viewPicture(scope.row.image)"
              fit="contain"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          label="Type"
          align="center"
          width="150"
        ></el-table-column>
        <el-table-column label="PageName" align="center" min-width="2">
          <template slot-scope="scope">
            <div
              v-for="item in scope.row.pageNameList"
              :key="item"
              style="text-align: left"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="最后一次上报情况" align="center" min-width="1">
          <template slot-scope="scope">
            <el-tooltip
              placement="right-start"
              v-for="item in scope.row.results"
              :key="item.webType"
              style="margin: 0 5px 5px 0"
            >
              <div slot="content">
                <div>上报端：{{ item.webtype }}</div>
                <div v-if="item.createTime !== ''">
                  上报时间：{{ item.createTime }}
                </div>
                <div v-if="item.userName !== ''">
                  操作人：{{ item.userName }}
                </div>
                <div v-if="item.errorLog.length > 0" class="error-info">
                  错误信息：{{ item.errorLog }}
                </div>
              </div>
              <el-tag
                :type="getStatusTag(item.reportStatus)"
                @click="showExpressDetail(item)"
                >{{ item.webtype }}</el-tag
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"
    ></Pagination>
    <el-dialog
      class="report-detail-dialog"
      title="上报详情"
      :visible.sync="showDialog"
      width="800px"
      @close="dialogClose"
    >
      <el-tabs v-model="activeName">
        <el-tab-pane label="上报详情" name="reportInfo">
          <div style="margin-bottom: 16px">
            <label>上报端</label>
            <el-input
              v-model="reportDetail.webtype"
              disabled
              style="margin-right: 20px"
            ></el-input>
            <label>上报时间</label>
            <el-input v-model="reportDetail.createTime" disabled></el-input>
          </div>
          <div>
            <label>上报人</label>
            <el-input
              v-model="reportDetail.userName"
              disabled
              style="margin-right: 20px"
            ></el-input>
            <label>上报结果</label>
            <el-input v-model="reportDetail.statusName" disabled></el-input>
          </div>
        </el-tab-pane>
        <el-tab-pane
          label="上报数据"
          name="reportData"
          :disabled="reportDetail.reportStatus === -1"
        >
          <el-input
            type="textarea"
            :rows="10"
            v-model="reportData"
            :disabled="true"
          ></el-input>
        </el-tab-pane>
        <el-tab-pane
          label="错误详情"
          name="errorInfo"
          :disabled="reportDetail.reportStatus === 1"
        >
          <el-input
            type="textarea"
            :rows="10"
            v-model="reportDetail.errorInfo"
            :disabled="true"
          ></el-input>
        </el-tab-pane>
        <el-tab-pane
          label="原始错误详情"
          name="errorLog"
          :disabled="reportDetail.reportStatus === 1"
        >
          <el-input
            type="textarea"
            :rows="10"
            v-model="reportDetail.errorLog"
            :disabled="true"
          ></el-input>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog
      class="big-dialog repeatReport-dialog"
      title="重复上报列表"
      :visible.sync="showRepeatReport"
      center
      width="80%">
      <div class="page-search-bar">
        <label>日期</label>
        <el-date-picker
          v-model="startDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
        <label>时间间隔</label>
        <el-select v-model="gapTime">
          <el-option label="100ms" :value="100"></el-option>
          <el-option label="300ms" :value="300"></el-option>
          <el-option label="500ms" :value="500"></el-option>
          <el-option label="1s" :value="1000"></el-option>
        </el-select>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchRepeatReport">搜索</el-button>
      </div>
      <el-table
        v-loading="repeatReportLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#FFFAFA)"
        :data="repeatReport"
        border
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.repeatList" :key="item.id">
              <span style="margin-right:30px">Id：{{item.id}}</span>
              <span>时间：{{$utils.formatDate(item.identification.substring(0, 13), 'yyyy-MM-dd hh:mm:ss:ms')}}</span>
              <el-divider v-if="index < scope.row.repeatList.length - 1"></el-divider>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="schemaId" label="Id" align="center" width="80"></el-table-column>
        <el-table-column prop="name" label="名称" align="center"></el-table-column>
        <el-table-column prop="env" label="环境" align="center" width="100"></el-table-column>
        <el-table-column prop="uuri" label="uuri" align="center"></el-table-column>
        <el-table-column prop="userName" label="上报人" align="center"></el-table-column>
        <el-table-column prop="webtype" label="端" align="center" width="100"></el-table-column>
        <el-table-column prop="dataPointType" label="Type" align="center" width="100"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      timer: null,
      searchData: {
        projDataId: "",
        env: "",
        uuri: "",
        page: 1,
        pageSize: 10,
      },
      iterationList: [],
      iterationLoading: false,
      envList: [
        { id: 1, name: "TKE01", value: "tke_01" },
        { id: 2, name: "TKE02", value: "tke_02" },
        { id: 3, name: "TKE03", value: "tke_03" },
        { id: 4, name: "TKE04", value: "tke_04" },
        { id: 5, name: "TKE05", value: "tke_05" },
        { id: 6, name: "TKE06", value: "tke_06" },
        { id: 7, name: "TKE07", value: "tke_07" },
        { id: 8, name: "TKE08", value: "tke_08" },
        { id: 9, name: "TKE09", value: "tke_09" },
        { id: 11, name: "灰度1", value: "grey_01" },
        { id: 12, name: "灰度2", value: "grey_02" },
        { id: 13, name: 'dev-01', value: 'dev-01' },
        { id: 14, name: 'dev-02', value: 'dev-02' },
        { id: 15, name: 'dev-03', value: 'dev-03' },
        { id: 16, name: 'test-01', value: 'test-01' },
        { id: 17, name: 'test-02', value: 'test-02' },
        { id: 18, name: 'test-03', value: 'test-03' },
        { id: 19, name: 'test-04', value: 'test-04' },
        { id: 20, name: 'test-05', value: 'test-05' },
        { id: 21, name: 'test-06', value: 'test-06' }
      ],
      tableHeight: null,
      tableLoading: false,
      tableData: [],
      total: 0,
      showDialog: false,
      activeName: "reportInfo",
      reportDetail: {},
      reportData: "",
      showRepeatReport: false,
      startDate: '',
      gapTime: 300,
      repeatReportLoading: false,
      repeatReport: []
    };
  },
  mounted() {
    this.tableHeight = this.$refs["table-box"].offsetHeight;
    window.onresize = () => {
      this.tableHeight = this.$refs["table-box"].offsetHeight;
    };
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    searchRepeatReport () {
      this.repeatReportLoading = true
      this.$service.listRepeatData({
        projDataId: this.searchData.projDataId,
        env: this.searchData.env,
        uuri: this.searchData.uuri,
        startDate: this.startDate,
        gapTime: this.gapTime
      }).then(res => {
        this.repeatReport = res.data
      }).finally(() => {
        this.repeatReportLoading = false
      })
      this.showRepeatReport = true
    },
    // 查看重复上报
    viewRepeatReport () {
      if (!this.searchData.projDataId || !this.searchData.env) {
        this.$message.error("关键字、环境不能为空");
        return;
      }
      this.startDate = this.$utils.formatDate(new Date(), 'yyyy-MM-dd')
      this.searchRepeatReport()
    },
    showExpressDetail(item) {
      var status = item.reportStatus;
      var statusName =
        status === -1
          ? "未上报"
          : status === 0
          ? "上报失败"
          : status === 1
          ? "上报成功"
          : "未知上报";
      if (status !== -1) {
        this.$service.selectRecordInfo({ id: item.id }).then((res) => {
          this.reportDetail = res.data;
          this.reportDetail.statusName = statusName;
          this.reportData = JSON.stringify(
            JSON.parse(this.reportDetail.reportData),
            null,
            "\t"
          );
        });
      } else {
        this.reportDetail = item;
        this.reportDetail.statusName = statusName;
      }
      this.showDialog = true;
    },
    dialogClose() {
      (this.activeName = "reportInfo"),
        (this.reportDetail = {}),
        (this.reportData = "");
    },
    getStatusTag(status) {
      return status == -1
        ? "danger"
        : status == 0
        ? "warning"
        : status == 1
        ? "success"
        : "info";
    },
    // 转为array格式
    viewPicture(imageUrl) {
      return [imageUrl];
    },
    // 搜索
    search() {
      this.searchData.page = 1;
      this.getTableData();
    },
    // 切换每页条数
    handleSizeChange(value) {
      this.searchData.pageSize = value;
      this.searchData.page = 1;
      this.getTableData();
    },
    // 切换页码
    handleCurrentChange(value) {
      this.searchData.page = value;
      this.getTableData();
    },
    // 获取表格数据
    getTableData() {
      if (!this.searchData.projDataId || !this.searchData.env) {
        this.$message.error("关键字和环境不能为空");
        return;
      }
      this.tableLoading = true;
      this.$service
        .listReportData2(this.searchData)
        .then((res) => {
          this.$message.success("埋点上报数据已刷新");
          this.tableData = res.data.list;
          this.total = res.data.count;
        })
        .finally(() => {
          this.tableLoading = false;
          if (!this.timer) {
            this.timer = setInterval(() => {
              this.getTableData();
            }, 1000 * 10);
          }
        });
    },
    // 迭代
    getIterationList(query) {
      if (query !== "") {
        this.iterationLoading = true;
        this.$service
          .getIterationList({ keywords: query })
          .then((res) => {
            this.iterationList = res.data;
          })
          .finally(() => {
            this.iterationLoading = false;
          });
      } else {
        this.iterationList = [];
      }
    },
  },
};
</script>