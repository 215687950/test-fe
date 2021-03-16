<style lang="scss">
.page-mockConf {
  .table-box {
    flex: 1;
    overflow: hidden;
  }

  .el-dialog__wrapper.bind-list-dialog {
    height: 100%;
    overflow: hidden;

    .el-dialog {
      height: 80%;
      overflow: hidden;
      display: flex;
      flex-direction: column;

      .el-dialog__body {
        flex: 1;
        overflow: hidden;
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
  <div class="page page-mockConf">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input v-model="searchData.keywords" placeholder="支持账号所有人/虚拟号/部门体系/真实号" prefix-icon="el-icon-search"
                :style="{ width: '313px' }" clearable @keyup.enter.native="search"></el-input>
      <label>状态</label>
      <el-select v-model="searchData.isEnable" clearable class="width80">
        <el-option label="停用" :value="0"></el-option>
        <el-option label="启用" :value="1"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="handleAdd" v-if="isShowEdit">新增虚拟账号</el-button>
      <el-button type="info" size="small" icon="el-icon-more" @click="handleBindList" v-if="isShowEdit">绑定号码列表
      </el-button>
      <el-button type="danger" size="small" icon="el-icon-refresh" @click="syncData" v-if="isShowEdit">同步</el-button>
      <download-excel
          style="display:inline-block;margin-left:10px"
          :data="tableData"
          :fields="json_fields"
          name="white-list.xls"
          v-if="isShowEdit">
        <el-button type="warning" size="small" icon="el-icon-download" >导出Excel</el-button>
      </download-excel>
    </div>
    <div class="table-box" ref="table-box">
      <el-table v-loading="tableLoading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading"
                element-loading-background="#FFFAFA)" :data="tableData" :height="tableHeight" border
                style="width: 100%">
        <el-table-column prop="virtualMobile" label="虚拟号码" align="center"></el-table-column>
        <el-table-column prop="realMobile" label="真实号码" align="center"></el-table-column>
        <el-table-column prop="deptSystem" label="部门" align="center"></el-table-column>
        <el-table-column prop="ownerName" label="所属人" align="center"></el-table-column>
<!--        <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>-->
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="状态" align="center">
          <template v-slot="{ row }">
            <el-switch v-model="row.isEnable" active-color="#13ce66" @change="switchChanged(row)" :active-value="1"
                       inactive-color="#ff4949" :inactive-value="0" :disabled="!isShowEdit"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230" align="center">
          <template slot-scope="scope">
<!--            <el-button type="warning" size="mini" plain @click="handleEdit(scope.row)" v-if="isShowEdit">修改</el-button>-->
            <el-button type="info" size="mini" plain @click="handleVcode(scope.row)">验证码</el-button>
            <el-button :type="scope.row.bindId === ''?'success':'danger'" size="mini" plain
                       @click="handleBind(scope.row)" v-if="isShowEdit">{{ scope.row.bindId === '' ? "绑定" : "解绑" }}
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination :total="total" :currentPage="searchData.page" @on-size-change="handleSizeChange"
                @on-current-change="handleCurrentChange"></Pagination>

    <el-dialog :title="handleType" :visible.sync="showDialog" center width="360px" @close="resetAddForm">
      <el-form ref="dataForm" :model="formData" :inline="true" label-width="80px">
        <el-form-item label="虚拟账号:">
          <el-input v-model="formData.virtualMobile" placeholder="请输入虚拟手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号状态">
          <el-select v-model="formData.isEnable" placeholder="请选择账号状态" clearable>
            <el-option :value="0" label="停用"></el-option>
            <el-option :value="1" label="启用"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span v-if="handleType !== '查看'" slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" style="width: 100%" @click="submit">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog class="bind-list-dialog" :title="handleType" :visible.sync="showBindList" center width="750px"
               @close="resetBindInfo">
      <div class="page-search-bar">
        <el-input
            v-model="bindListKeywords"
            placeholder="请输入关键字"
            prefix-icon="el-icon-search"
            clearable
            @keyup.enter.native="searchBind"></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchBind">搜索</el-button>
      </div>
      <div class="table-box" ref="bind-table-box">
        <el-table
            v-loading="searchBindLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="#FFFAFA)"
            :data="bindList"
            :height="bindListTableHeight"
            border
            style="width: 100%">
          <el-table-column prop="id" label="ID" align="center" width="60"></el-table-column>
          <el-table-column prop="realMobile" label="真实号码" align="center"></el-table-column>
          <el-table-column prop="ownerName" label="所属人" align="center"></el-table-column>
          <el-table-column prop="deptSystem" label="部门" align="center"></el-table-column>
          <el-table-column prop="createUserName" label="创建人" align="center"></el-table-column>
          <el-table-column v-if="isShowEdit" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button type="warning" size="mini" plain @click="handleEditBind(scope.row)" v-if="isShowEdit">修改
              </el-button>
              <el-button type="danger" size="mini" plain @click="handleDelBind(scope.row)" v-if="isShowEdit">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog title="编辑绑定信息" :visible.sync="showEditBind" center width="380px" @close="resetBindInfo">
      <el-form ref="dataForm" :model="bindData" :inline="true" label-width="120px">
        <el-form-item label="归 属 人:">
          <el-autocomplete v-model="bindData.ownerName" :fetch-suggestions="queryOwnerList" :trigger-on-focus="false"
                           placeholder="请输入选择归属人" @select="ownerSelect">
            <template slot-scope="{ item }">
              <div class="ownerName">{{ item.ownerName }}</div>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="真实号码:">
          <el-input v-model="bindData.realMobile" placeholder="请输入真实号码" clearable :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="部门体系:">
          <el-input v-model="bindData.deptSystem" placeholder="请输入部门体系" clearable :disabled="isDisabled"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" style="width: 100%" @click="submitEditBind">提交</el-button>
      </span>
    </el-dialog>

    <el-dialog :title="handleType" :visible.sync="showBind" center width="380px" @close="resetBindInfo">
      <el-form ref="dataForm" :model="bindData" :inline="true" label-width="120px">
        <el-form-item label="归 属 人:">
          <el-autocomplete v-model="bindData.ownerName" :fetch-suggestions="queryOwnerList" :trigger-on-focus="false"
                           placeholder="请输入选择归属人" @select="ownerSelect">
            <template slot-scope="{ item }">
              <span class="ownerName">{{ item.ownerName }}</span>
              <span class="addr" style="color:#999999;font-size: 12px;margin-left: 10px">{{ item.realMobile }}</span>
            </template>
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="真实号码:">
          <el-input v-model="bindData.realMobile" placeholder="请输入真实号码" clearable :disabled="isDisabled"></el-input>
        </el-form-item>
        <el-form-item label="部门体系:">
          <el-input v-model="bindData.deptSystem" placeholder="请输入部门体系" clearable :disabled="isDisabled"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="saveLoading" type="primary" style="width: 100%" @click="submit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
import DownloadExcel from 'vue-json-excel';
import mixin from "@/mixins/mixin";

export default {
  components: {Pagination, DownloadExcel},
  mixins: [mixin],
  data() {
    return {
      json_fields: {
        虚拟号码: 'virtualMobile',
        真实号码: 'realMobile',
        所属人: 'ownerName',
        部门: 'deptSystem',
        状态: {
          filed: 'problemType',
          callback: (value) => {
            return value.problemType === 0
                ? '停用'
                : '启用'
          }
        }
      },
      searchData: {
        page: 1,
        pageSize: 10,
        keywords: "",
        isEnable: "",
      },
      isShowEdit: false,
      bindListTableHeight: null,
      bindListKeywords: "",
      ownerList: [],
      searchBindLoading: false,
      tableLoading: false,
      tableData: [],
      bindList: [],
      total: 0,
      tableHeight: null,
      handleType: "",
      showEditBind: false,
      showBindList: false,
      showDialog: false,
      showBind: false,
      saveLoading: false,
      bindData: {
        vriId: "",
        realMobile: "",
        deptSystem: "",
        ownerName: "",
        ownerAccount: "",
      },
      formData: {
        isEnable: "",
        virtualMobile: "",
      },
      editId: "",
    };
  },
  computed: {
    isDisabled() {
      return this.handleType === "查看";
    },
  },
  mounted() {
    window.onresize = () => {
      this.$nextTick(() => {
        if (this.showBindList) {
          this.bindListTableHeight = this.$refs['bind-table-box'].offsetHeight
        }
      })
    }
  },
  methods: {
    submitEditBind() {
      this.$service
          .editBindInfo(this.bindData)
          .then(() => {
            this.showEditBind = false;
            this.searchBind();
            this.getTableData();
          });
    },
    syncData() {
      this.$service
          .syncAccount()
          .then(() => {
            this.$message.success("同步数据成功");
            this.getTableData();
          });
    },
    switchChanged(row) {
      this.$service
          .editAccountStatus({
            isEnable: row.isEnable,
            vriId: row.id,
          })
          .then(() => {
            this.$message.success("修改状态成功!");
            this.getTableData();
          });
    },
    ownerSelect(obj) {
      this.bindData.ownerName = obj.ownerName;
      this.bindData.ownerAccount = obj.ownerAccount;
      this.bindData.realMobile = obj.realMobile;
      this.bindData.deptSystem = obj.deptSystem;
    },
    queryOwnerList(kw, cb) {
      this.$service.quertOwner({keywords: kw}).then((res) => {
        this.ownerList = res.data;
        cb(res.data);
      });
    },
    searchBind() {
      this.searchBindLoading = true;
      this.$service
          .getBindList({keywords: this.bindListKeywords})
          .then((res) => {
            // this.bindList = res.data;
            this.bindList = [...res.data, ...res.data, ...res.data, ...res.data];
            this.searchBindLoading = false;
          });
    },
    handleDelBind(item) {
      this.$confirm("确认要删除当前绑定信息?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.searchBindLoading = true;
        this.$service
            .delBindInfo({bindId: item.id})
            .then(() => {
              this.$message.success("删除绑定成功");
              this.searchBind();
              this.getTableData();
            })
            .finally(() => {
              this.searchBindLoading = false;
            });
      });

    },
    handleEditBind(item) {
      this.showEditBind = true;
      this.bindData = item;
    },
    handleVcode(item) {
      this.$service
          .getVcode({vriId: item.id})
          .then((res) => {
            if (null == res.data || '' === res.data) {
              this.$message.warning("未找到当前手机号的验证码");
              return;
            }
            this.$alert(res.data, '验证码', {
              confirmButtonText: '关闭',
            });
          });
    },
    handleBindList() {
      this.handleType = "绑定列表";
      this.showBindList = true;
      this.$nextTick(() => {
        this.bindListTableHeight = this.$refs['bind-table-box'].offsetHeight
      })
      this.searchBind();
    },
    handleAdd() {
      this.handleType = "新增";
      this.showDialog = true;
    },
    handleBind(row) {
      if (row.bindId === '') {
        this.handleType = "绑定";
        this.showBind = true;
        this.editId = row.id;
      } else {
        this.$confirm("确认要解绑当前账号?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          let params = {vriId: row.id};
          this.tableLoading = true;
          this.$service
              .unbindMobile(params)
              .then(() => {
                this.$message.success("取消绑定成功");
                this.getTableData();
              })
              .finally(() => {
                this.tableLoading = false;
              });
        });
      }
    },
    handleEdit(row) {
      this.handleType = "修改";
      this.formData = row;
      this.showDialog = true;
    },
    submit() {
      let url = "";
      let msg = "";
      let params = {};
      if (this.handleType === "新增") {
        url = "addVriAccount";
        msg = "新增成功";
        params = this.formData;
      } else if (this.handleType === "绑定") {
        url = "bindAccount";
        msg = "绑定成功";
        this.bindData.vriId = this.editId;
        params = {...this.bindData};
      } else if (this.handleType === "修改") {
        url = "updateAccount";
        msg = "绑定成功";
        params = {...this.formData};
      }
      this.saveLoading = true;
      this.$service[url](params)
          .then(() => {
            this.$message.success(msg);
            this.showDialog = false;
            this.showBind = false;
            this.getTableData();
          })
          .finally(() => {
            this.saveLoading = false;
          });
    },
    resetBindInfo() {
      this.bindData = {
        vriId: "",
        realMobile: "",
        deptSystem: "",
        ownerName: "",
        ownerAccount: "",
      };
    },
    resetAddForm() {
      this.formData = {
        isUse: "",
        isEnable: "",
      };
    },
    // 获取表格数据
    getTableData() {
      let params = JSON.parse(JSON.stringify(this.searchData));
      params.size = params.pageSize;
      delete params.pageSize;
      this.tableLoading = true;
      this.$service
          .listVriAccount(params)
          .then((res) => {
            this.tableData = res.data.data;
            this.total = res.data.count;
            this.isShowEdit = res.data.isShowEdit;
          })
          .finally(() => {
            this.tableLoading = false;
          });
    },
  },
};
</script>
