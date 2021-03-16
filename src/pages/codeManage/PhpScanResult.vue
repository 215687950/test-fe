<style lang="scss">
.page-phpScan {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
  .el-dialog__wrapper {
    height: 100%;
    .el-dialog {
      height: 80%;
      .el-dialog__body {
        display: flex;
        flex-direction: column;
        .table-box {
          flex: 1;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
<template>
  <div class="page page-phpScan">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入用户名/项目名"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"
      ></el-input>
      <label>选择状态</label>
      <el-select
        v-model="searchData.isSuccess"
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
          prop="name"
          label="用户名"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="projectName"
          label="项目名称"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="lastCommitId"
          label="合并Id"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="targetBranch"
          label="目标分支"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="sourceBranch"
          label="源分支"
          align="center"
        ></el-table-column>
        <el-table-column prop="mergeState" label="合并状态" align="center">
        </el-table-column>
        <el-table-column prop="statusName" label="是否成功" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isSuccess === 1" type="success" effect="plain" size="small">{{ scope.row.statusName }}</el-tag>
            <el-tag v-if="scope.row.isSuccess === 0" type="danger" effect="plain" size="small">{{ scope.row.statusName }}</el-tag>
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
              :disabled="scope.row.isSuccess === 1"
              icon="el-icon-s-order"
              @click="showFileList(scope.row)"
              >查看详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-drawer
      title="文件列表"
      :visible.sync="showDialog.detail"
      :direction="direction"
      :before-close="resetFileList"
      size="50%"
    >
      <div class="page-search-bar">
        <label></label>
        <el-input
          v-model="fileListSearchData.keywords"
          placeholder="请输入文件名"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="search"
        ></el-input>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="searchFileList"
          >搜索</el-button
        >
      </div>

      <div class="table-box" ref="file-table-box">
        <el-table
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#FFFAFA)"
          :data="fileData"
          :height="tableHeight"
          border
          style="width: 100%"
        >
          <el-table-column
            prop="fileName"
            label="文件路径"
            header-align="center"
            align="left"
          ></el-table-column>
          <el-table-column prop="" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-s-order"
                @click="showFileDetail(scope.row)"
                >查看文件</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-drawer>

    <el-dialog
      class="big-dialog"
      title="文件详情"
      :visible.sync="showDialog.fileDetail"
      @close="resetDetailDialog"
    >
      <div class="page-search-bar">
        <label>类型</label>
        <el-select v-model="fileDetailSearch.status" clearable>
          <el-option
            v-for="item in fileStatusArray"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="searchFileDetail"
          >搜索</el-button
        >
      </div>
      <div class="table-box" ref="file-detail-table-box">
        <el-table
          v-loading="tableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#FFFAFA)"
          :data="fileDetailData"
          border
          :height="dialogTableHeight"
          style="width: 100%"
        >
          <el-table-column
            prop="lineNum"
            label="行号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="lineStatusName"
            label="状态"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="lineDetail"
            label="详情"
            header-align="center"
            align="left"
          ></el-table-column>
        </el-table>
      </div>
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
        isSuccess: "",
      },

      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,

      statusArray: [
        { id: 0, name: "失败" },
        { id: 1, name: "成功" },
      ],
      fileStatusArray: [
        { id: 0, name: "ERROR" },
        { id: 1, name: "WARNING" },
      ],
      direction: "rtl",
      showDialog: {
        detail: false,
        fileDetail: false,
      },
      fileListSearchData: {
        reqId: null,
        keywords: null,
      },
      fileData: [],
      fileDetailSearch: {
        detailId: null,
        status: null,
      },
      fileDetailData: [],
      dialogTableHeight: null,
    };
  },
  methods: {
    resetDetailDialog() {
      this.showDialog.fileDetail = false;
    },
    showFileDetail(row) {
      this.showDialog.fileDetail = true;
      this.$nextTick(() => {
        this.dialogTableHeight = this.$refs[
          "file-detail-table-box"
        ].offsetHeight;
      });
      this.fileDetailSearch = {
        detailId: row.id,
      };
      this.searchFileDetail();
    },

    searchFileDetail() {
      this.$service
        .fileInfoList(this.fileDetailSearch)
        .then((res) => {
          let data = res.data;
          data.forEach((item) => {
            this.fileStatusArray.forEach((status) => {
              if (status.id === item.lineStatus) {
                item.lineStatusName = status.name;
              }
            });
          });
          this.fileDetailData = data;
        })
        .finally(() => {});
    },

    resetFileList() {
      this.showDialog.detail = false;
    },

    showFileList(row) {
      this.fileListSearchData = {
        reqId: row.id,
        keywords: null,
      };
      this.showDialog.detail = true;
      this.searchFileList();
    },

    searchFileList() {
      this.$service
        .phpMergeReqDetailList(this.fileListSearchData)
        .then((res) => {
          this.fileData = res.data;
        })
        .finally(() => {});
    },

    // 获取表格数据
    getTableData() {
      let params = JSON.parse(JSON.stringify(this.searchData));
      params.size = params.pageSize;
      delete params.pageSize;
      this.tableLoading = true;
      this.$service
        .phpMergeReqList(params)
        .then((res) => {
          let data = res.data.data;
          data.forEach((item) => {
            this.statusArray.forEach((status) => {
              if (status.id === item.isSuccess) {
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
    },
  },
};
</script>