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
      color: red;
      .el-form-item__content {
        flex: 1;
        .el-input {
          width: 100%;
        }
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
      <label>选择状态</label>
      <el-select v-model="searchData.isUse" placeholder="请选择状态" clearable>
        <el-option
          v-for="item in useStatusArray"
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
          prop="objName"
          label="项目名称"
          align="center"
        ></el-table-column>
        <el-table-column prop="objPath" label="项目路径" align="center">
        </el-table-column>
        <el-table-column
          prop="useStatus"
          label="状态"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isUse === 1" type="success" effect="plain" size="small">{{ scope.row.useStatus }}</el-tag>
            <el-tag v-if="scope.row.isUse === 0" type="danger" effect="plain" size="small">{{ scope.row.useStatus }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="objGitUrl"
          label="git路径"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
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
              type="primary"
              size="mini"
              @click="handleDetail('view', scope.row)"
              >查看</el-button
            >

            <el-button
              type="success"
              size="mini"
              @click="handleDetail('edit', scope.row)"
              >编辑</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="
        handleType === 'add'
          ? '新增配置'
          : handleType === 'view'
          ? '查看配置'
          : '编辑配置'
      "
      :visible.sync="showDialog"
      width="910px"
      @close="resetDialog"
    >
      <el-form
        ref="ruleForm"
        :model="infoObj"
        :rules="rules"
        :inline="true"
        label-width="80px"
      >
        <el-form-item label="项目名称" prop="objName">
          <el-input
            v-model="infoObj.objName"
            placeholder="请输入项目名称"
            :readonly="handleType == 'view'"
          ></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="isUse">
          <el-select
            v-model="infoObj.isUse"
            placeholder="请选择状态"
            :disabled="handleType == 'view'"
          >
            <el-option
              v-for="item in useStatusArray"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="infoObj.remark"
            :readonly="handleType == 'view'"
          ></el-input>
        </el-form-item>

        <el-form-item label="git路径" prop="objGitUrl" class="form-item-block">
          <el-input
            v-model="infoObj.objGitUrl"
            :readonly="handleType == 'view'"
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="handleType !== 'view'"
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
import mixin from '@/mixins/mixin'

export default {
  components: { Pagination },
  mixins: [mixin],
  data() {
    return {
      searchData: {
        page: 1,
        pageSize: 10,
        keywords: "",
        isUse: "",
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      useStatusArray: [
        { id: 0, name: "停用" },
        { id: 1, name: "启用" },
      ],

      handleType: "",
      showDialog: false,
      infoObj: {
        objName: "",
        objGitUrl: "",
        isUse: 0,
        remark: "",
      },
      rules: {
        objName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
        objGitUrl: [
          { required: true, message: "请输入git路径", trigger: "blur" },
        ],
      },
      saveLoading: false,
    };
  },

  methods: {
    resetDialog() {
      this.$refs["ruleForm"].resetFields();
      this.infoObj = { objName: "", objGitUrl: "", isUse: 0, remark: "" };
    },

    handleAdd() {
      this.handleType = "add";
      this.showDialog = true;
    },

    handleDetail(type, row) {
      this.handleType = type;
      this.showDialog = true;
      Object.keys(row).forEach((key) => {
        this.infoObj[key] = row[key];
      });
      console.log(type);
      console.log(this.infoObj);
    },

    save() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          this.saveLoading = true;
          if (this.handleType === "add") {
            this.$service
              .insertPhpConf(this.infoObj)
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
              .updatePhpConf(this.infoObj)
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

    // 获取表格数据
    getTableData() {
      let params = JSON.parse(JSON.stringify(this.searchData))
      params.size = params.pageSize
      delete params.pageSize
      this.tableLoading = true;
      this.$service
        .listPhpScanConfList(params)
        .then((res) => {
          let data = res.data.dataList;
          data.forEach((item) => {
            this.useStatusArray.forEach((type) => {
              if (type.id === item.isUse) {
                item.useStatus = type.name;
              }
            });
          });
          this.tableData = data;
          this.total = res.data.totalCount;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },
  },
};
</script>