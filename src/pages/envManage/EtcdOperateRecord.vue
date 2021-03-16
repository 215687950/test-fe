<style lang="scss">
.page-etcdOperateRecord {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
  .info-dialog {
    .el-dialog__body {
      min-height: 600px;
      padding: 10px 25px;
      .title {
        display: flex;
        justify-content: space-around;
        margin-bottom: 10px;
      }
    }
  }
}
</style>
<template>
  <div class="page page-etcdOperateRecord">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="请输入服务名称"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"
      ></el-input>
      <label>环境</label>
      <el-select v-model="searchData.env" clearable placeholder="请选择环境">
        <el-option
          v-for="item in envList"
          :key="item.id"
          :label="item.completeName"
          :value="item.id"
        ></el-option>
      </el-select>
      <label>类型</label>
      <el-select v-model="searchData.type" clearable placeholder="请选择类型">
        <el-option
          v-for="item in typeList"
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
      >
        <el-table-column
          prop="id"
          label="id"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="user"
          label="操作人"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="demand"
          label="需求方"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="envName"
          label="环境"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="keyName"
          label="KEY"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="typeName"
          label="操作类型"
          width="100"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="备注"
          width="200"
          show-overflow-tooltip
          align="center"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
          align="center"
        ></el-table-column>
        <el-table-column prop="" label="操作" width="220" align="center">
          <template slot-scope="scope">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-s-order"
              @click="handleView(scope.row)"
              >查看详情</el-button
            >
            <el-button
              v-if="scope.row.type === 2 || scope.row.type === 5"
              type="info"
              size="mini"
              icon="el-icon-refresh-left"
              @click="handleRollBack(scope.row)"
              >回滚</el-button
            >
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
      title="查看详情"
      class="info-dialog"
      :visible.sync="showDialog"
      center
      width="80%"
    >
      <div class="title">
        <span>更新前</span>
        <span>更新后</span>
      </div>
      <code-diff
        v-loading="infoLoading"
        :old-string="recordInfo.oldSettingStr"
        :new-string="recordInfo.newSettingStr"
        :context="1000"
        outputFormat="side-by-side"
      />
    </el-dialog>

    <el-dialog
      title="回滚"
      class="info-dialog"
      :visible.sync="showRollbackDialog"
      center
      width="80%"
      @close="resetRoll"
    >
      <el-form v-model="recordInfo" label-width="100px">
        <el-row>
          <el-form-item label="环境" prop="targetEnv">
            <el-input v-model="recordInfo.envName" disabled></el-input>
          </el-form-item>
          <el-form-item label="key" prop="keyName">
            <el-input v-model="recordInfo.keyName" disabled></el-input>
          </el-form-item>
        </el-row>
        <el-form-item label="备注">
          <el-input v-model="remark" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="回滚后配置" prop="setting">
          <el-input
            v-model="recordInfo.oldSettingStr"
            type="textarea"
            :rows="20"
            placeholder="请输入配置内容"
            disabled
          ></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button
          :loading="rollLoading"
          type="primary"
          style="width: 100%"
          @click="confirmRollBack()"
          >确定回滚</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import CodeDiff from "vue-code-diff";
import mixin from "@/mixins/mixin";
export default {
  components: { Pagination, CodeDiff },
  mixins: [mixin],
  data() {
    return {
      searchData: {
        keywords: "",
        env: "",
        type: "",
        page: 1,
        pageSize: 10,
      },
      envList: [],
      typeList: [
        { id: "1", name: "新增" },
        { id: "2", name: "更新" },
        { id: "3", name: "缺失同步" },
        { id: "4", name: "路径同步" },
        { id: "5", name: "删除" },
      ],
      tableHeight: null,
      tableLoading: false,
      tableData: [],
      total: 0,
      showDialog: false,
      info: {
        oldSettingStr: "",
        newSettingStr: "",
      },
      infoLoading: false,
      showRollbackDialog: false,
      recordInfo: {},
      remark: "",
      rollLoading: false,
    };
  },
  methods: {
    getRecordInfo(id) {
      this.infoLoading = true
      this.$service
        .getRecordInfo({
          id: id,
        })
        .then((res) => {
          this.recordInfo = res.data;
          this.envList.forEach((env) => {
            if (env.id === this.recordInfo.env) {
              this.recordInfo.envName = env.completeName;
            }
          });
          console.log("recordInfo=====>",this.recordInfo);
        })
        .finally(() => {
          this.infoLoading = false
        })
    },

    handleView(row) {
      this.getRecordInfo(row.id);
      this.showDialog = true;
    },

    handleRollBack(row) {
      this.getRecordInfo(row.id);
      this.showRollbackDialog = true;
    },

    confirmRollBack() {
      this.rollLoading = true;
      this.$service
        .rollBackByRecord({
          recordId: this.recordInfo.id,
          remark: this.remark,
        })
        .then(() => {
          this.$message.success("回滚成功");
        })
        .finally(() => {
          this.getTableData();
          this.rollLoading = false;
          this.showRollbackDialog = false;
        });
    },
    resetRoll() {
      this.showRollbackDialog = false;
      this.recordInfo = {};
      this.remark = "";
    },
    // 获取表格数据
    getTableData() {
      this.$service.getEtcdEnv().then(res => {
        this.envList = res.data
        let params = JSON.parse(JSON.stringify(this.searchData));
        params.size = params.pageSize;
        delete params.pageSize;
        this.tableLoading = true;
        this.$service.listEtcdOperateRecord(params).then((res) => {
          res.data.list.forEach((item) => {
            this.envList.forEach((env) => {
              if (env.id === item.env) {
                item.envName = env.completeName;
              }
            });
            this.typeList.forEach((type) => {
              if (type.id === String(item.type)) {
                item.typeName = type.name;
              }
            });
          });
          this.tableData = res.data.list;
          this.total = res.data.count;
        })
        .finally(() => {
          this.tableLoading = false;
        });
      })
    }
  }
};
</script>