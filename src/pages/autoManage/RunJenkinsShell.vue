<style lang="scss">
.page-runJenkinsShell {
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
    .form-item-block {
      display: flex;
      .el-form-item__content {
        flex: 1;
      }
    }
  }
}
</style>
<template>
  <div class="page page-runJenkinsShell">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"
      ></el-input>
      <label>任务类型</label>
      <el-select v-model="searchData.execType" clearable>
        <el-option label="手动执行" :value="0"></el-option>
        <el-option label="定时任务" :value="1"></el-option>
      </el-select>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="search"
        >搜索</el-button
      >
      <el-button
        v-if="showAddBtn"
        type="success"
        size="small"
        icon="el-icon-plus"
        @click="handleAdd"
        >新增</el-button
      >
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
        ><el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column
          prop="taskName"
          label="任务名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="execType"
          label="任务类型"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.execType == 0">手动执行</span>
            <span v-if="scope.row.execType == 1">定时任务</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="env"
          label="环境"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="notifier"
          label="通知人"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="manager"
          label="维护人"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        ></el-table-column>
        <el-table-column prop="" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              :type="scope.row.testReport ? 'success' : 'danger'"
              @click="showReport(scope.row)"
              size="mini"
              plain
              >{{scope.row.testReport ? '查看报告' : '报告生成中'}}</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="新增任务"
      :visible.sync="showDialog"
      width="620px"
      @close="resetDialog"
    >
      <el-form
        ref="ruleForm"
        :model="addObj"
        :rules="rules"
        :inline="true"
        label-width="80px"
      >
        <el-form-item label="模块" prop="moduleName">
          <el-select
            v-model="jenkinsObj"
            placeholder="请选择模块"
            value-key="moduleName"
            @change="changeProject"
          >
            <el-option
              v-for="item in jenkinsDataList"
              :key="item.moduleName"
              :label="item.moduleName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="子模块" prop="fileName">
          <el-select
            v-model="xmlObj"
            placeholder="请选择子模块"
            value-key="fileName"
            :disabled="!jenkinsObj.moduleName"
            @change="changeModule"
          >
            <el-option
              v-for="item in fileList"
              :key="item.fileName"
              :label="item.taskName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="环境" prop="name">
          <el-select
            v-model="envObj"
            placeholder="请选择环境"
            value-key="name"
            :disabled="!xmlObj.fileName"
          >
            <el-option
              v-for="item in tkeDataList"
              :key="item.id"
              :label="item.name"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通知人" prop="notifier">
          <el-input placeholder="多个逗号分隔" v-model="notifier"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          :loading="saveLoading"
          type="primary"
          style="width: 100%"
          @click="save"
          >提交</el-button
        >
      </span>
    </el-dialog>

    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"
    ></Pagination>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      searchData: {
        page: 1,
        pageSize: 10,
        keywords: "",
        execType: ''
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      showDialog: false,
      jenkinsDataList: [],
      tkeDataList: [],
      fileList: [],
      jenkinsObj: {},
      envObj: {},
      xmlObj: {},
      notifier: null,
      addObj: {
        moduleName: '',
        name: '',
        fileName: ''
      },
      rules: {
        moduleName: [
          {
            required: true,
            message: "请选择模块",
            trigger: "blur",
          },
        ],
        fileName: [{ required: true, message: "请选择子模块", trigger: "blur" }],
        name: [
          {
            required: true,
            message: "请选择环境",
            trigger: "blur",
          },
        ]
      },
      saveLoading: false,
    };
  },
  mounted() {
    this.tableHeight = this.$refs["table-box"].offsetHeight;
    window.onresize = () => {
      this.tableHeight = this.$refs["table-box"].offsetHeight;
    }
  },
  watch: {
    '$route': {
      handler (route) {
        if (route.path === '/runJenkinsShell') {
          this.searchData.execType = 0
          this.showAddBtn = true
        } else if (route.path === '/timedTask/report') {
          this.searchData.execType = 1
          this.showAddBtn = false
        }
        this.getTableData();
      },
      immediate: true
    }
  },
  methods: {
    showReport(row) {
      if ("" == row.testReport || undefined == row.testReport) {
        this.$message.info("测试报告还未生成, 请稍候.");
        return;
      }
      // this.$confirm("点击确定自动跳转", "提示", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消",
      //   type: "success",
      // }).then(() => {
      //   window.open(row.testReport, "_blank");
      // });
      window.open(row.testReport, "_blank");
    },

    handleAdd() {
      this.getJenkinsList();
      this.showDialog = true;
    },

    async getJenkinsList() {
      this.$service.getJenkinsData().then((res) => {
        this.jenkinsDataList = res.data.moduleList;
      });
    },

    resetDialog() {
      this.$refs["ruleForm"].resetFields();
      this.jenkinsObj = {};
      this.envObj = {};
      this.xmlObj = {};
    },

    changeProject(item) {
      this.jenkinsObj = item;

      this.envObj = {};
      this.xmlObj = {};
      this.tkeDataList = [];
      this.fileList = item.taskList;
    },

    changeModule(item) {
      this.envObj = {};
      this.tkeDataList = item.envList;
    },

    save() {
      this.addObj.moduleName = this.jenkinsObj.moduleName
      this.addObj.fileName = this.xmlObj.fileName
      this.addObj.name = this.envObj.name
      this.addObj.env = this.envObj.name
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.addObj.jobName = this.jenkinsObj.jobName      
          this.addObj.adminName = this.xmlObj.adminName
          this.addObj.taskName = this.xmlObj.taskName
          this.addObj.userNum = this.xmlObj.userNum
          this.addObj.id = this.envObj.id   
          if (this.envObj.name.startsWith('gray')) {
            this.addObj.group = 'gray';
          } else if (this.envObj.name.startsWith('tke')) {
            this.addObj.group = 'tke';
          } else if (this.envObj.name.startsWith('online')) {
            this.addObj.group = 'online';
          }
          this.addObj.notifier = this.notifier;
          this.saveLoading = true;
          this.$service
            .addJenkinsTask(this.addObj)
            .then(() => {
              this.$message.success("新增成功");
              this.showDialog = false;
              this.getTableData();
            })
            .finally(() => {
              this.saveLoading = false;
            });
        }
      });
    },

    search() {
      this.searchData.page = 1;
      this.getTableData();
    },

    // 获取表格数据
    getTableData() {
      this.tableLoading = true;
      this.$service.jenkinsTaksList(this.searchData).then((res) => {
        this.tableData = res.data.items;
        this.total = res.data.totalCount;
      })
      .finally(() => {
        this.tableLoading = false;
      });
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
  },
};
</script>