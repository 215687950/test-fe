<style lang="scss">
.page-infoArchiving {
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
  <div class="page page-infoArchiving">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"
      ></el-input>
      <label>选择类型</label>
      <el-select v-model="searchData.type" placeholder="请选择类型" clearable>
        <el-option
          v-for="item in infoArchiveType"
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
          prop="archiveName"
          label="文档名称"
          align="center"
        ></el-table-column>
        <el-table-column label="文档类型" align="center">
          <template slot-scope="scope">
            {{ scope.row.typeName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="archiveContent"
          label="文档内容"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createUserName"
          label="创建人"
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
              type="info"
              @click="handleEdit('edit', scope.row)"
              size="mini"
              plain
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="handleType === 'add' ? '新增' : '编辑'"
      :visible.sync="showDialog"
      width="620px"
      @close="resetDialog"
    >
      <el-form
        ref="ruleForm"
        :model="infoObj"
        :rules="rules"
        :inline="true"
        label-width="80px"
      >
        <el-form-item label="名称" prop="archiveName">
          <el-input
            v-model="infoObj.archiveName"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="归档类型" prop="archiveType">
          <el-select
            v-model="infoObj.archiveType"
            placeholder="请选择归档类型"
            clearable
          >
            <el-option
              v-for="item in infoArchiveType"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item
          label="归档内容"
          prop="archiveContent"
          class="form-item-block"
        >
          <el-input
            type="textarea"
            v-model="infoObj.archiveContent"
            :rows="10"
          ></el-input>
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
        size: 10,
        keywords: "",
        type: "",
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      infoArchiveType: [
        { id: 0, name: "环境相关" },
        { id: 1, name: "ETCD配置相关" },
        { id: 2, name: "Java相关" },
        { id: 3, name: "React相关" },
        { id: 4, name: "Vue相关" },
        { id: 5, name: "环境相关BUG" },
      ],
      handleType: "",
      showDialog: false,
      infoObj: { archiveName: "", archiveContent: "", archiveType: "" },
      rules: {
        archiveName: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        archiveType: [
          { required: true, message: "请选择类型", trigger: "change" },
        ],
      },
      saveLoading: false,
    };
  },
  mounted() {
    this.tableHeight = this.$refs["table-box"].offsetHeight;
    window.onresize = () => {
      this.tableHeight = this.$refs["table-box"].offsetHeight;
    };
    this.getTableData();
  },
  methods: {
    resetDialog() {
      this.$refs["ruleForm"].resetFields();
      this.infoObj = { archiveName: "", archiveContent: "", archiveType: "" };
    },

    handleEdit(type, row) {
      this.handleType = "edit";
      this.showDialog = true;
      Object.keys(row).forEach((key) => {
        this.infoObj[key] = row[key];
      });
      console.log(this.infoObj);
    },

    handleAdd() {
      this.handleType = "add";
      this.showDialog = true;
    },

    save() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          if (this.handleType === "add") {
            this.$service
              .addInfoArchive(this.infoObj)
              .then(() => {
                this.$message.success("新增成功");
                this.showDialog = false;
                this.getTableData();
              })
              .finally(() => {
                this.saveLoading = false;
              });
          } else if (this.handleType === "edit") {
            this.$service
              .editInfoArchive(this.infoObj)
              .then(() => {
                this.$message.success("编辑成功");
                this.showDialog = false;
                this.getTableData();
              })
              .finally(() => {
                this.saveLoading = false;
              });
          }
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
      this.$service
        .listInfoArchive(this.searchData)
        .then((res) => {
          let data = res.data.dataList;
          data.forEach((item) => {
            this.infoArchiveType.forEach((type) => {
              if (type.id === item.archiveType) {
                item.typeName = type.name;
              }
            });
          });
          this.tableData = data;
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