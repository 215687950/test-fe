<style lang="scss">
.page-monitorResult {
  .table-box {
    flex: 1;
    overflow: hidden;
    .status {
      width: max-content;
      padding: 0 10px;
      border: 1px solid;
      border-radius: 3px;
      font-size: 12px;
    }
    .status0 {
      color: #909399;
      border-color: #909399;
    }
    .status1 {
      color: #ff7575;
      border-color: #ff7575;
    }
    .status2 {
      color: #5dcfff;
      border-color: #5dcfff;
    }
    .status3 {
      color: #ffcd5d;
      border-color: #ffcd5d;
    }
    .status4 {
      color: #73d897;
      border-color: #73d897;
    }
    .status5 {
      color: #2e9e6b;
      border-color: #2e9e6b;
    }
  }
  .el-dialog__wrapper.view-dialog {
    height: 100%;
    .el-dialog {
      height: 80%;
      .el-dialog__body {
        display: flex;
        flex-direction: column;
        .view-table-box {
          flex: 1;
          overflow: hidden;
        }
        .el-table {
          tr:hover {
            background: none;
          }
          td {
            padding: 0;
            color: #fff;
            cursor: pointer;
            user-select: none;
            &:hover {
              box-shadow: 0px 0px 8px #fff;
              transform: scale(1.2);
              position: relative;
              z-index: 1;
            }
          }
          td.type_0 {
            background: #67c23a !important;
          }
          td.type_1 {
            background: #e6a23c !important;
          }
          td.type_2 {
            background: #e92828 !important;
          }
          td.type_3 {
            background: #909399 !important;
          }
          td.type_4 {
            background: #470202 !important;
          }
          .lightBorder_1 {
            border: 5px solid #c0ff3e !important;
          }
          .lightBorder_2 {
            border: 5px solid #00FFFF !important;
          }
        }
      }
    }
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
  <div class="page page-monitorResult">
    <div class="page-search-bar">
      <label>执行时间</label>
      <el-date-picker v-model="time" value-format="MMdd" @change="getTableData" :clearable="false"></el-date-picker>
      <el-button type="primary" size="small" icon="el-icon-search" @click="getTableData">查询</el-button>
    </div>
    <div class="table-box" ref="table-box">
      <el-table
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#FFFAFA)"
        :data="tableData"
        :height="tableHeight"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-table :data="scope.row.records">
              <el-table-column label="执行时间" prop="createTime" width="170"></el-table-column>
              <el-table-column label="执行时长（s）" prop="execTime"></el-table-column>
              <el-table-column label="TPS" prop="tps"></el-table-column>
              <el-table-column label="平均响应时间（ms）" prop="avg" min-width="120"></el-table-column>
              <el-table-column label="ERR数" prop="errCount"></el-table-column>
              <el-table-column label="ERR率" prop="errPer" show-overflow-tooltip=""></el-table-column>
              <el-table-column label="线程数" prop="threadNum"></el-table-column>
              <el-table-column label="连接数" prop="connectNum"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="info" size="mini" @click="handleView(scope.row)">查看监控图</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="标签">
          <template slot-scope="scope">
            <div class="status" :class="`status${scope.row.status}`">{{scope.row.statusName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="maxTps" label="最大TPS"></el-table-column>
        <el-table-column prop="scriptName" label="脚本名称"></el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="编辑脚本信息"
      :visible.sync="showEditDialog"
      center
      width="500px">
      <el-form v-model="editData">
        <el-form-item label="标签">
          <el-select v-model="editData.status" placeholder="请选择活动标签">
            <el-option label="无标签" :value="0"></el-option>
            <el-option label="标签一" :value="1"></el-option>
            <el-option label="标签二" :value="2"></el-option>
            <el-option label="标签三" :value="3"></el-option>
            <el-option label="标签四" :value="4"></el-option>
            <el-option label="标签五" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="editData.remark"
            rows="5"
            type="textarea"
            placeholder="请输入备注"
            style="width:91%"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="editLoading" type="primary" style="width: 100%" @click="submitEdit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="big-dialog view-dialog"
      title="监控图查看"
      :visible.sync="showViewDialog"
      center
      width="80%">
      <el-tabs v-model="activeName" @tab-click="tabChange">
        <el-tab-pane label="开始" name="start"></el-tab-pane>
        <el-tab-pane label="中程" name="mid"></el-tab-pane>
        <el-tab-pane label="结束" name="end"></el-tab-pane>
        <el-tab-pane label="结束后二十秒" name="after"></el-tab-pane>
      </el-tabs>
      <div class="view-table-box" ref="view-table-box">
        <el-table
          :data="currentViewData"
          border
          :height="viewTableHeight"
          style="width: 100%"
          :cell-class-name="cellClassName">
          <el-table-column prop="cpu" align="center" label="CPU">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="cpu" unit="%" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="io"
            align="center"
            label="IO">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="io" unit="%" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="mem"
            align="center"
            label="MEM">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="mem" unit="%" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="tcp"
            align="center"
            label="TCP">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="tcp" unit="" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="load"
            align="center"
            label="LOAD">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="load" unit="" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="in"
            align="center"
            label="IN">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="in" unit="MB" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="out"
            align="center"
            label="OUT">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="out" unit="MB" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="php"
            align="center"
            label="PHP">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="php" unit="" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="qps"
            align="center"
            label="QPS">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="qps" unit="" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="mysqlqps"
            align="center"
            label="MYSQL_QPS">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="mysqlQps" unit="" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="mysqlthread"
            align="center"
            label="MYSQL_THREAD">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="mysqlThread" unit="%" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="mysqlthreadrun"
            align="center"
            label="MYSQL_THREAD_RUN">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="mysqlThreadRun" unit="" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
          <el-table-column
            prop="codisproxy"
            align="center"
            label="CODIS_PROXY">
            <template slot-scope="scope">
              <ToolTip :data="scope.row" name="codisProxy" unit="%" :noRightClick="true"></ToolTip>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import mixin from '@/mixins/mixin'
import ToolTip from './components/ToolTip'
export default {
  components: { ToolTip },
  mixins: [mixin],
  data () {
    return {
      time: this.$utils.formatDate(new Date(), 'MMdd'),
      tableLoading: false,
      tableData: [],
      tableHeight: null,
      showEditDialog: false,
      editLoading: false,
      editData: {
        status: '',
        remark: '',
        scriptName: ''
      },
      showViewDialog: false,
      activeName: 'start',
      viewData: {},
      currentViewData: [],
      viewTableHeight: null
    }
  },
  methods: {
    tabChange (value) {
      switch (value.name) {
        case 'start':
          this.currentViewData = this.viewData.startData
          break
        case 'mid':
          this.currentViewData = this.viewData.midData
          break
        case 'end':
          this.currentViewData = this.viewData.endData
          break
        case 'after':
          this.currentViewData = this.viewData.afterData
          break
      }
    },
    handleView (row) {
      this.tableLoading = true
      this.$service.getMonitorImg({ time: row.execStartTime }).then(res => {
        this.viewData = res.data
        this.currentViewData = this.viewData.startData
        this.activeName= 'start'
        this.showViewDialog = true
        this.$nextTick(() => {
          this.viewTableHeight = this.$refs['view-table-box'].offsetHeight
        })
      }).finally(() => {
        this.tableLoading = false
      })
    },
    // 单元格样式
    cellClassName ({ row, columnIndex }) {
      if (columnIndex === 0) {
        return 'type_' + row.cpuColor + ' lightBorder_' + row.cpuBorder
      }
      if (columnIndex === 1) {
        return 'type_' + row.ioColor + ' lightBorder_' + row.ioBorder
      }
      if (columnIndex === 2) {
        return 'type_' + row.memColor + ' lightBorder_' + row.memBorder
      }
      if (columnIndex === 3) {
        return 'type_' + row.tcpColor + ' lightBorder_' + row.tcpBorder
      }
      if (columnIndex === 4) {
        return 'type_' + row.loadColor + ' lightBorder_' + row.loadBorder
      }
      if (columnIndex === 5) {
        return 'type_' + row.inColor + ' lightBorder_' + row.inBorder
      }
      if (columnIndex === 6) {
        return 'type_' + row.outColor + ' lightBorder_' + row.outBorder
      }
      if (columnIndex === 7) {
        return 'type_' + row.phpColor + ' lightBorder_' + row.phpBorder
      }
      if (columnIndex === 8) {
        return 'type_' + row.qpsColor + ' lightBorder_' + row.qpsBorder
      }
      if (columnIndex === 9) {
        return 'type_' + row.mysqlQpsColor + ' lightBorder_' + row.mysqlQpsBorder
      }
      if (columnIndex === 10) {
        return 'type_' + row.mysqlThreadColor + ' lightBorder_' + row.mysqlThreadBorder
      }
      if (columnIndex === 11) {
        return 'type_' + row.mysqlThreadRunColor + ' lightBorder_' + row.mysqlThreadRunBorder
      }
      if (columnIndex === 12) {
        return 'type_' + row.codisProxyColor + ' lightBorder_' + row.codisProxyBorder
      }
    },
    handleEdit (row) {
      this.editData = {
        status: '',
        remark: '',
        scriptName: `${row.scriptName}:${this.time}`
      }
      this.showEditDialog = true
    },
    submitEdit () {
      this.editLoading = true
      this.$service.updateScriptInfo(this.editData).then(() => {
        this.$message.success('编辑成功')
        this.showEditDialog = false
      }).finally(() => {
        this.editLoading = false
      })
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.getAllScript({ date: this.time }).then(res => {
        res.data.forEach(item => {
          item.status = item.records[0].status || 0
          switch (item.status) {
            case 0:
              item.statusName = '未设置'
              break
            case 1:
              item.statusName = '等级一'
              break
            case 2:
              item.statusName = '等级二'
              break
            case 3:
              item.statusName = '等级三'
              break
            case 4:
              item.statusName = '等级四'
              break
            case 5:
              item.statusName = '等级五'
              break
          }
          item.remark = item.records[0].remark
          let tpsArray = []
          item.records.forEach(record => {
            record.tps = record.tps ? parseFloat(record.tps) : 0.0
            tpsArray.push(record.tps)
          })
          item.maxTps = Math.max(...tpsArray) + '/s'
        })
        this.tableData = res.data
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>