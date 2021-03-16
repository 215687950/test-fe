<style lang="scss">
.page-execShell {
  .content {
    flex: 1;
    overflow: hidden;
    display: flex;
  }
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
  <div class="page page-execShell">
    <div class="page-search-bar">
      <label>服务名称</label>
      <el-input
        v-model="searchData.serverName"
        placeholder="请输入服务名称"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"
      ></el-input>

      <label>选择环境</label>
      <el-select v-model="searchData.env" placeholder="请选择" clearable>
        <el-option
          v-for="item in envTypeList"
          :key="item"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <label>选择组</label>
      <el-select v-model="searchData.groupType" placeholder="请选择" clearable>
        <el-option
          v-for="item in groupTypeList"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        ></el-option>
      </el-select>

      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="search"
        >搜索</el-button
      >

      <el-button
        type="success"
        size="small"
        icon="el-icon-plus"
        @click="handleAdd"
        >执行</el-button
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
        ><el-table-column prop="id" label="ID" align="center"></el-table-column>
        <el-table-column
          prop="env"
          label="环境名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="serverName"
          label="服务名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="container"
          label="容器"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="groupName"
          label="执行组"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="执行时间"
          align="center"
        ></el-table-column>
        <el-table-column prop="" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="info"
              @click="showDetail(scope.row)"
              size="mini"
              plain
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      title="脚本执行详情"
      :visible.sync="showDialog.detail"
      width="60%"
      @close="resetDialog"
    >
      <el-tabs v-model="detailActive">
        <el-tab-pane label="执行命令" name="commandShell">
          <el-input
            type="textarea"
            :rows="row"
            v-model="infoObj.shellCommand"
            :disabled="true"
          ></el-input>
        </el-tab-pane>
        <el-tab-pane label="请求数据" name="reqData">
          <el-input
            type="textarea"
            :rows="row"
            v-model="infoObj.shellReqData"
            :disabled="true"
          ></el-input>
        </el-tab-pane>
        <el-tab-pane label="返回数据" name="resData">
          <el-input
            type="textarea"
            :rows="row"
            v-model="infoObj.shellResData"
            :disabled="true"
          ></el-input>
        </el-tab-pane>
        <el-tab-pane label="脚本日志" name="shellLog">
          <el-input
            type="textarea"
            :rows="row"
            v-model="infoObj.shellLog"
            :disabled="true"
          ></el-input>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="width: 100%" @click="closeDetail"
          >关闭</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="执行脚本"
      :visible.sync="showDialog.addShell"
      width="620px"
      @close="resetAddDialog"
    >
      <el-form
        ref="ruleForm"
        :model="addInfo"
        :rules="rules"
        :inline="true"
        label-width="80px"
      >
        <el-form-item label="环境名称" prop="env">
          <el-select v-model="addInfo.env" placeholder="请选择环境">
            <el-option
              v-for="item in envTypeList"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="选择组" prop="group">
          <el-select v-model="addInfo.group" placeholder="请选择组">
            <el-option
              v-for="item in groupTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="输入容器" prop="container">
          <el-input v-model="addInfo.container"></el-input>
        </el-form-item>

        <el-form-item label="服务名" prop="serverName">
          <el-input v-model="addInfo.serverName"></el-input>
        </el-form-item>

        <el-form-item label="执行命令" prop="command" class="form-item-block">
          <el-input v-model="addInfo.command" style="width: 490px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          :loading="saveLoading"
          type="primary"
          style="width: 100%"
          @click="save"
          >开始执行</el-button
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
      envTypeList: [
        "tke-01",
        "tke-02",
        "tke-03",
        "tke-04",
        "tke-05",
        "tke-06",
        "tke-07",
        "tke-08",
      ],
      groupTypeList: [
        { id: "CS01", name: "测试一组" },
        { id: "CS02", name: "测试二组" },
        { id: "CS03", name: "测试三组" },
      ],
      searchData: {
        page: 1,
        size: 10,
        env: "",
        serverName: "",
        groupType: "",
      },
      tableHeight: null,
      tableLoading: false,
      tableData: [],
      total: 0,
      showDialog: {
        detail: false,
        addShell: false,
      },
      infoObj: {},
      detailActive: "commandShell",
      row: "",
      saveLoading: false,
      addInfo: {
        env: "",
        group: "",
        container: "php-fpm",
        serverName: "",
        command: "",
      },
      rules: {
        env: [{ required: true, message: "请选择环境", trigger: "blur" }],
        group: [{ required: true, message: "请选择组", trigger: "blur" }],
        serverName: [
          { required: true, message: "请输入服务名", trigger: "blur" },
        ],
        command: [
          { required: true, message: "请输入执行命令", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    this.tableHeight = this.$refs["table-box"].offsetHeight;
    this.row = (this.tableHeight * 0.5) / 21;
    window.onresize = () => {
      this.tableHeight = this.$refs["table-box"].offsetHeight;
      this.row = (this.tableHeight * 0.5) / 21;
    };
    this.getTableData();
  },
  methods: {
    resetAddDialog() {
      this.addInfo = {
        env: "",
        group: "",
        container: "php-fpm",
        serverName: "",
        command: "",
      };
      this.$refs["ruleForm"].resetFields();
    },

    handleAdd() {
      this.showDialog.addShell = true;
    },

    save() {
      this.saveLoading = true;
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          this.$service
            .execCommand(this.addInfo)
            .then(() => {
              this.$message.success("新增成功");
              this.showDialog.addShell = false;
              this.getTableData();
            })
            .finally(() => {
              this.saveLoading = false;
            });
        }
      });
    },

    resetDialog() {
      this.infoObj = {};
      this.detailActive = "commandShell";
    },

    showDetail(row) {
      this.showDialog.detail = true;
      this.infoObj.shellCommand = row.command;
      this.infoObj.shellReqData = JSON.parse(JSON.stringify(row.requestData));
      this.infoObj.shellResData = JSON.parse(JSON.stringify(row.resultData));
      this.infoObj.shellLog = row.shellLog;
    },

    closeDetail() {
      this.showDialog.detail = false;
      this.infoObj = {};
    },

    search() {
      this.searchData.page = 1;
      this.getTableData();
    },

    // 获取表格数据
    getTableData() {
      this.tableLoading = true;
      this.$service
        .listExecRecord(this.searchData)
        .then((res) => {
          this.tableData = res.data.dataList;
          this.total = res.data.count;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },

    // 切换每页条数
    handleSizeChange(value) {
      this.searchData.size = value;
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