<style lang="scss">
.page-reimburseCheck {
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
  }
}
</style>
<template>
  <div class="page page-reimburseCheck">
    <div class="page-search-bar">
      <el-input
        v-model="searchData.condition"
        placeholder="申请人关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <download-excel
        style="display:inline-block;margin-left:10px"
        :data="tableData"
        :fields="json_fields"
        name="bb.xls">
        <el-button type="success" size="small" icon="el-icon-download" plain>导出excel</el-button>
      </download-excel>
      <el-button type="info" size="small" icon="el-icon-plus" style="margin-left: 10px" :disabled="remarkFormData.reimList.length === 0" @click="showDialog.remark = true">批量设置备注</el-button>
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
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column prop="commitName" label="申请人" align="center" width="90"></el-table-column>
        <el-table-column prop="reimDesc" label="申请描述" align="center" width="260"></el-table-column>
        <el-table-column label="金额统计" align="center" width="200">
          <template slot-scope="scope">
            <div>
              实际金额：
              <br>
              <el-input v-model="scope.row.actAmount" :disabled="scope.row.disAmount" style="width:80px;margin-right:5px" size="small"></el-input>
              <el-button type="primary" size="mini" @click="changeDisAmount(scope.row)">{{ scope.row.disAmount ? "修改" : "确认"}}</el-button>
            </div>
            <div>手续费：{{ scope.row.fee }}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单信息" align="center" width="300">
          <template slot-scope="scope">
            <div>
              报销单号：
              <div
                style="marginLeft:20px"
                v-for="item in scope.row.reimNums"
                :key="item">{{ item }}</div>
            </div>
            <div>
              订单描述：
              <div
                style="marginLeft:20px"
                v-for="item in scope.row.orderDescs"
                :key="item">{{ item }}</div>
            </div>
            <div>支付方式：{{ scope.row.payTypes }}</div>
            <div>支付环境：{{ scope.row.payEnvStr }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="150">
          <template slot-scope="scope">
            <div>
              <el-input
                type="textarea"
                :disabled="scope.row.disRemark"
                style="width:120px"
                v-model="scope.row.remark"
                size="mini"
              ></el-input>
            </div>
            <div style="marginTop:10px">
              <el-button
                size="mini"
                type="primary"
                @click="changeDisRemark(scope.row)"
              >{{ scope.row.disRemark ? "修改" : "确认"}}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="申请图片" align="center" width="150">
          <template slot-scope="scope">
            <VuePictureSwipe :items="scope.row.allImageBeans || []"></VuePictureSwipe>
          </template>
        </el-table-column>
        <el-table-column label="审核" align="center" width="150">
          <template slot-scope="scope">
            <div :style="{ display: scope.row.checkStatus == 1 ? 'none' : ''}">
              <el-button @click="checkPass(scope.row)" type="success" size="mini">通过</el-button>
            </div>
            <div style="marginTop:10px">
              <el-button @click="checkUnPass(scope.row)" type="danger" size="mini">不通过</el-button>
            </div>
            <div style="marginTop:10px">
              <el-button @click="commitCw(scope.row)" type="primary" size="mini">提交财务</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" width="180">
            <template slot-scope="scope">
              <div>{{ scope.row.checkStatusStr }}</div>
              <div>
                原因:
                <span style="color:red" >{{ scope.row.remarkCw == "" ? scope.row.remarkNk : scope.row.remarkCw }}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="auditorName" label="审核人" align="center" width="100"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center" width="170"></el-table-column>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"></Pagination>
    <el-dialog title="批量备注"
      :visible.sync="showDialog.remark"
      center
      width="340px"
      @close="resetRemarkForm">
      <el-form ref="remarkFormData" :model="remarkFormData" :rules="remarkRules" :inline="true" label-width="80px">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="remarkFormData.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="width: 100%" @click="remarkSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import VuePictureSwipe from 'vue-picture-swipe'
import Pagination from '@/components/Pagination'
import DownloadExcel from 'vue-json-excel'
import mixin from '@/mixins/mixin'
export default {
  components: { VuePictureSwipe, Pagination, DownloadExcel },
  mixins: [mixin],
  data () {
    return {
      searchData: {
        page: 1,
        pageSize: 10,
        condition: ''
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      json_fields: {
        申请人: "commitName",
        申请描述: "reimDesc",
        // 申请金额: "amount",
        实际金额: "actAmount",
        手续费: "fee",
        报销单号: {
          field: "reimNums",
          callback: value => {
            var str = "";
            for (var i = 0; i < value.length; i++) {
              str += value[i] + "\n";
            }
            console.log(
              "报销单号=======" + str.substring(str.length - 2, str.length)
            );
            return str.substring(0, str.length - 1);
          }
        },
        订单描述: {
          field: "orderDescs",
          callback: value => {
            var str = "";
            for (var i = 0; i < value.length; i++) {
              str += value[i] + "\n";
            }
            return str.substring(0, str.length - 1);
          }
        },
        支付方式: {
          field: "payTypes",
          callback: value => {
            var str = "";
            for (var i = 0; i < value.length; i++) {
              str += value[i] + "\n";
            }
            return str.substring(0, str.length - 1);
          }
        },
        支付环境: "payEnvStr",
        备注: "remark",
        申请图片: {
          field: "images",
          callback: value => {
            var str = "";
            for (var i = 0; i < value.length; i++) {
              str += value[i] + "\n";
            }
            return str.substring(0, str.length - 1);
          }
        },
        审核状态: "checkStatusStr",
        报销时间: "reimTime"
      },
      showDialog: {
        remark: false
      },
      remarkFormData: {
        reimList: [],
        remark: ''
      },
      remarkRules: {
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    // 批量设置备注
    handleSelectionChange (value) {
      if (value.length) {
        let list = []
        value.forEach(item => {
          list.push(item.id)
        })
        this.remarkFormData.reimList = list
      } else {
        this.remarkFormData.reimList = []
      }
    },
    remarkSubmit () {
      this.$refs['remarkFormData'].validate((valid) => {
        if (valid) {
          this.$service.batchUpdateRemark(this.remarkFormData).then(() => {
            this.$message.success('批量更新成功')
            this.showDialog.remark = false
            this.getTableData()
          })
        }
      })
    },
    resetRemarkForm () {
      this.$refs['remarkFormData'].resetFields()
    },
    //提交至财务
    commitCw(row) {
      if (row.checkStatus !== 1) {
        this.$message.error('当前不是通过状态，无法提交至财务')
        return
      }
      this.$msgbox.confirm('是否提交至财务部门?', '提交财务', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.commitCw({ reimId: row.id, verification: 1 }).then(() => {
          this.$message.success('请求成功')
          this.getTableData()
        })
      })
    },
    // 通过
    checkPass (row) {
      this.$msgbox.confirm('确定通过此报销申请?', '通过', {
        type: 'warning',
        center: true
      }).then(() => {
        this.checkPassReq(row, { reimId: row.id, pass: 1 })
      })
    },
    // 不通过
    checkUnPass (row) {
      this.$prompt('请输入不通过理由', '不通过').then(({ value }) => {
        this.checkPassReq(row, { reimId: row.id, pass: 2, reason: value })
      })
    },
    checkPassReq (row, data) {
      this.$service.checkpass(data).then(() => {
        this.$message.success('请求成功')
        if (1 == data.pass) {
          row.checkStatus = 1
          row.checkStatusStr = '审核已通过'
        } else if (2 == data.pass) {
          row.checkStatus = 2
          this.getTableData()
        }
      })
    },
    // 切换备注输入状态
    changeDisRemark(row) {
      if (!row.disRemark) {
        this.$service.updateReimRemark({ reimId: row.id, remark: row.remark }).then(() => {
          this.$message.success('修改成功')
        })
      }
      row.disRemark = !row.disRemark;
    },
    // 切换实际金额输入状态 以及修改内容
    changeDisAmount(row) {
      if (!row.disAmount) {
        this.$service.updateActAmount({ reimId: row.id, actAmount: row.actAmount }).then(() => {
          this.$message.success('请求成功')
        })
      }
      row.disAmount = !row.disAmount
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.tableData = []
      this.$service.reimCheckList(this.searchData).then(res => {
        this.tableData = res.data
        this.total = res.totalCount
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>