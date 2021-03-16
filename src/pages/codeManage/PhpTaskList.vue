<style lang="scss">
.page-phpTaskList {
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
  <div class="page page-phpTaskList">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入项目名"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"
      ></el-input>
      <label>选择状态</label>
      <el-select
        v-model="searchData.isComplete"
        placeholder="请选择类型"
        clearable
      >
        <el-option
          v-for="item in statusArray"
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
        <el-table-column prop="statusName" label="状态" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isComplete === 1" type="success" effect="plain" size="small">{{ scope.row.statusName }}</el-tag>
            <el-tag v-if="scope.row.isComplete === 0" type="danger" effect="plain" size="small">{{ scope.row.statusName }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        ></el-table-column>
        <el-table-column prop="" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-s-order"
              @click="showDetail(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="任务详情"
      :visible.sync="showDialog"
      width="60%"
      @close="resetDialog"
    >
      <el-input
        type="textarea"
        v-model="infoContent"
        :rows="row"
        readonly
        resize="none"
      ></el-input>
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
import mixin from "@/mixins/mixin";

export default {
  components: { Pagination },
    mixins: [mixin],

  data() {
    return {
      searchData: {
        page: 1,
        pageSize: 10,
        keywords: "",
        isComplete: "",
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      statusArray: [
        { id: 0, name: "等待中" },
        { id: 1, name: "已完成" },
      ],
      showDialog: false,
      infoContent: null,
      row: 20,
    };
  },
  mounted() {
    this.row = (this.tableHeight * 0.6) / 21;
    window.onresize = () => {
      this.row = (this.tableHeight * 0.6) / 21;
    };
  },
  methods: {
    showDetail(row) {
      this.showDialog = true;
      this.infoContent = JSON.stringify(
        JSON.parse(row.taskInfoStr),
        null,
        "\t"
      );
    },
    
    resetDialog() {
      this.showDialog = false;
      this.infoContent = null;
    },

    // 获取表格数据
    getTableData() {
      let params = JSON.parse(JSON.stringify(this.searchData));
      params.size = params.pageSize;
      delete params.pageSize;
      this.tableLoading = true;
      this.$service
        .listPhpTask(params)
        .then((res) => {
          let data = res.data.dataList;
          data.forEach((item) => {
            this.statusArray.forEach((status) => {
              if (status.id === item.isComplete) {
                item.statusName = status.name;
              }
            });
          });
          this.tableData = data;
          this.total = res.data.count;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    }
  },
};
</script>