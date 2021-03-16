<style lang="scss">
.page-testngConfig {
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
    .setting-info {
      margin-top: 10px;
      border: 1px solid #ebeef5;
      padding: 10px 0;
      .el-form-item {
        margin-bottom: 10px;
      }
      .setting-info-button {
        margin-left: 50px;
      }
    }
  }
}
</style>
<template>
  <div class="page page-testngConfig">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"
      ></el-input>
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
          prop="moduleName"
          label="模块名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        ></el-table-column>
        <el-table-column prop="" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="info" @click="edit(scope.row)" size="mini" plain
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      class="big-dialog"
      :title="handleType === 'add' ? '新增配置' : '编辑配置'"
      :visible.sync="showDialog"
      width="920px"
      @close="resetDialog"
    >
      <el-form
        ref="ruleForm"
        :model="infoObj"
        :inline="true"
        label-width="80px"
      >
        <el-row>
          <el-form-item label="项目名称" prop="projectName">
            <el-input
              v-model="infoObj.projectName"
              placeholder="请输入项目名称"
              :disabled="handleType === 'edit'"
            ></el-input>
          </el-form-item>
          <el-form-item label="模块名称" prop="moduleName">
            <el-input
              v-model="infoObj.moduleName"
              placeholder="请输入工程名称"
              :disabled="handleType === 'edit'"
            ></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-collapse>
            <el-collapse-item title="配置详情" name="1">
              <el-button
                type="success"
                size="small"
                @click="addSettingInfo"
                plain
                >新增配置信息</el-button
              >
              <el-row
                v-for="(item, index) in configInfoList"
                :key="index"
                class="setting-info"
              >
                <el-form-item label="任务名称" prop="taskName">
                  <el-input v-model="item.taskName" clearable placeholder="请输入任务名称"></el-input>
                </el-form-item>
                <el-form-item label="文件名称" prop="fileName">
                  <el-input v-model="item.fileName" clearable placeholder="请输入文件名称"></el-input>
                </el-form-item>
                <el-form-item label="环境">
                  <el-select
                    v-model="item.envName"
                    size="small"
                    :style="{ width: '165px' }"
                    value-key="id"
                    multiple
                    filterable
                    collapse-tags
                  >
                    <el-option
                      v-for="item in envList"
                      :key="item.id"
                      :label="item.envName"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="维护人" prop="adminName">
                  <el-input
                    v-model="item.adminName"
                    placeholder="请输入维护人名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="用户数量" prop="userNum">
                  <el-input
                    type="number"
                    v-model="item.userNum"
                    placeholder="请输入用户数量"
                  ></el-input>
                  <el-button
                    class="setting-info-button"
                    type="danger"
                    size="small"
                    @click="delConfigInfo(index, item)"
                    plain>删除</el-button>
                </el-form-item>
              </el-row>
            </el-collapse-item>
          </el-collapse>
        </el-row>
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
        size: 10,
        keywords: "",
      },
      tableHeight: null,
      tableLoading: false,
      tableData: [],
      total: 0,
      showDialog: false,
      handleType: "add",
      infoObj: {},
      configInfoList: [],
      saveLoading: false,
      envList: [],
    };
  },
  mounted() {
    this.tableHeight = this.$refs["table-box"].offsetHeight;
    window.onresize = () => {
      this.tableHeight = this.$refs["table-box"].offsetHeight;
    };
    this.getTableData();
    this.selectAllConfigEnv();
  },
  methods: {
    handleAdd() {
      this.handleType = "add";
      this.showDialog = true;
    },

    edit(row) {
      this.handleType = "edit";
      this.infoObj = row;
      this.showDialog = true;
      this.getSettingInfoList(row.id);
    },

    addSettingInfo() {
      this.configInfoList.push({});
    },

    delConfigInfo(index) {
      this.configInfoList.splice(index, 1);
    },

    save() {
      for (let index = 0; index < this.configInfoList.length; index++) {
        let item = this.configInfoList[index]
        if (!(item.fileName && item.taskName && item.envName.length > 0 && item.adminName && item.userNum)) {
          this.$message.error('请填全信息后再提交')
          return
        }
      }
      this.infoObj.infoList = this.configInfoList;
      if (this.handleType == "add") {
        this.$service
          .addTestngConfig(this.infoObj)
          .then(() => {
            this.$message.success("新增配置成功");
            this.getTableData();
          })
          .finally(() => {
            this.showDialog = false;
          });
      } else {
        this.$service
          .updateTestngConfigInfo(this.infoObj)
          .then(() => {
            this.$message.success("修改配置成功");
            this.getTableData();
          })
          .finally(() => {
            this.showDialog = false;
          });
      }
    },

    resetDialog() {
      this.infoObj = {};
      this.configInfoList = [];
    },

    getSettingInfoList(id) {
      this.$service
        .selectConfigInfoByConfig({ configId: id })
        .then((res) => {
          let data = res.data;
          data.forEach((item) => {
            item.envName = eval("(" + item.envName + ")");
          });
          this.configInfoList = data;
        })
        .finally(() => {});
    },

    selectAllConfigEnv() {
      this.$service
        .selectAllConfigEnv()
        .then((res) => {
          this.envList = res.data;
          this.envList.push({ envName: "gray-01", id: 7777 });
          this.envList.push({ envName: "gray-02", id: 8888 });
          this.envList.push({ envName: "online", id: 9999 });
        })
        .finally(() => {});
    },

    search() {
      this.searchData.page = 1;
      this.getTableData();
    },

    // 获取表格数据
    getTableData() {
      this.tableLoading = true;
      this.$service
        .testngConfigList(this.searchData)
        .then((res) => {
          this.tableData = res.data.data;
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