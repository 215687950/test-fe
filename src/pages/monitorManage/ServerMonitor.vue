<style lang="scss">
.page-serverMonitor {
  .page-search-bar {
    display: flex;
    justify-content: space-between;
  }
  .table-box {
    flex: 1;
    overflow: hidden;
    tr:hover {
      background: none;
    }
    th {
      color: green;
      .red {
        color: red;
      }
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
  }
}
</style>
<template>
  <div class="page page-serverMonitor">
    <div class="page-search-bar">
      <el-button type="success" size="small" icon="el-icon-plus" @click="addShellHandle">新增脚本</el-button>
      <div>
        <label>开关</label>
        <el-switch
          v-model="switchValue"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="switchChange">
        </el-switch>
      </div>
    </div>
    <div class="table-box" ref="table-box">
      <el-table
        v-loading="tableLoading"
        element-loading-text="初始化中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#FFFAFA)"
        :data="tableData"
        :height="tableHeight"
        border
        style="width: 100%"
        :cell-class-name="cellClassName">
        <el-table-column
          prop="cpu"
          align="center"
          label="CPU"
          :label-class-name="'cpuLive' in isLiveData && !isLiveData.cpuLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'cpuLive' in isLiveData && !isLiveData.cpuLive" :data="scope.row" name="cpu" unit="%" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="io"
          align="center"
          label="IO"
          :label-class-name="'ioLive' in isLiveData && !isLiveData.ioLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'ioLive' in isLiveData && !isLiveData.ioLive" :data="scope.row" name="io" unit="%" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="mem"
          align="center"
          label="MEM"
          :label-class-name="'memLive' in isLiveData && !isLiveData.memLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'memLive' in isLiveData && !isLiveData.memLive" :data="scope.row" name="mem" unit="%" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="tcp"
          align="center"
          label="TCP"
          :label-class-name="'tcpLive' in isLiveData && !isLiveData.tcpLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'tcpLive' in isLiveData && !isLiveData.tcpLive" :data="scope.row" name="tcp" unit="" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="load"
          align="center"
          label="LOAD"
          :label-class-name="'loadLive' in isLiveData && !isLiveData.loadLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'loadLive' in isLiveData && !isLiveData.loadLive" :data="scope.row" name="load" unit="" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="in"
          align="center"
          label="IN"
          :label-class-name="'inLive' in isLiveData && !isLiveData.inLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'inLive' in isLiveData && !isLiveData.inLive" :data="scope.row" name="in" unit="MB" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="out"
          align="center"
          label="OUT"
          :label-class-name="'outLive' in isLiveData && !isLiveData.outLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'outLive' in isLiveData && !isLiveData.outLive" :data="scope.row" name="out" unit="MB" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="php"
          align="center"
          label="PHP"
          :label-class-name="'phpLive' in isLiveData && !isLiveData.phpLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'phpLive' in isLiveData && !isLiveData.phpLive" :data="scope.row" name="php" unit="" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="qps"
          align="center"
          label="QPS"
          :label-class-name="'qpsLive' in isLiveData && !isLiveData.qpsLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'qpsLive' in isLiveData && !isLiveData.qpsLive" :data="scope.row" name="qps" unit="" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="mysqlqps"
          align="center"
          label="MYSQL_QPS"
          :label-class-name="'mysqlLive' in isLiveData && !isLiveData.mysqlLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'mysqlLive' in isLiveData && !isLiveData.mysqlLive" :data="scope.row" name="mysqlQps" unit="" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="mysqlthread"
          align="center"
          label="MYSQL_THREAD"
          :label-class-name="'mysqlThreadLive' in isLiveData && !isLiveData.mysqlThreadLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'mysqlThreadLive' in isLiveData && !isLiveData.mysqlThreadLive" :data="scope.row" name="mysqlThread" unit="%" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="mysqlthreadrun"
          align="center"
          label="MYSQL_THREAD_RUN"
          :label-class-name="'mysqlThreadRunLive' in isLiveData && !isLiveData.mysqlThreadRunLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'mysqlThreadRunLive' in isLiveData && !isLiveData.mysqlThreadRunLive" :data="scope.row" name="mysqlThreadRun" unit="" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
        <el-table-column
          prop="codisproxy"
          align="center"
          label="CODIS_PROXY"
          :label-class-name="'codisProxyLive' in isLiveData && !isLiveData.codisProxyLive ? 'red' : ''">
          <template slot-scope="scope">
            <ToolTip :err="'codisProxyLive' in isLiveData && !isLiveData.codisProxyLive" :data="scope.row" name="codisProxy" unit="%" @on-right-click="rightClick"></ToolTip>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddShell ref="addShell" :projTaskList="projTaskList" :addShellInitData="addShellInitData"></AddShell>
  </div>
</template>
<script>
import ToolTip from './components/ToolTip'
import AddShell from './components/AddShell'
export default {
  components: { ToolTip, AddShell },
  data () {
    return {
      socket: null,
      bindKey: 'server_monitor',
      switchValue: false,
      tableHeight: null,
      tableLoading: false,
      tableData: [],
      isLiveData: {},
      projTaskList: [],
      addShellInitData: {}
    }
  },
  created () {
    this.tableLoading = true
    this.initWebSocket()
  },
  mounted () {
    this.tableHeight = this.$refs['table-box'].offsetHeight
    window.onresize = () => {
      this.tableHeight = this.$refs['table-box'].offsetHeight
    }
  },
  destroyed () {
    console.log('关闭webSocket。')
    this.socket.close()
  },
  methods: {
    addShellHandle () {
      this.$refs['addShell'].visible = true
      this.socketSend({
        bindPage: this.bindKey,
        type: 'REQ_BACKEND',
        msgType: 'getStressProjTaskList',
        msg: JSON.stringify({
          sendAccount: this.$store.state.userInfo.account
        })
      })
    },
    switchChange (value) {
      this.socketSend({
        bindPage: this.bindKey,
        type: 'REQ_BACKEND',
        msgType: 'stopRecord',
        msg: value ? 'ON' : 'OFF'
      })
    },
    // 初始化socket
    initWebSocket () {
      const wsUri = process.env.VUE_APP_WSURL
      this.socket = new WebSocket(wsUri)
      this.socket.onmessage = this.socketGetMessage
      this.socket.onerror = this.socketError
      this.socketSend({ bindPage: this.bindKey })
    },
    // 接收socket数据
    socketGetMessage (e) {
      let resData = JSON.parse(e.data)
      console.log('***resData***', resData);
      switch (resData.type) {
        case 'MONTIOR_DATA': // 实时监控数据
          this.tableData = JSON.parse(resData.msg)
          console.log('--实时监控数据--', this.tableData);
          this.tableLoading = false
          break
        case 'MONTIOR_IS_ALIVE': // 线程是否存活
          this.isLiveData = JSON.parse(resData.msg)
          this.switchValue = JSON.parse(resData.msg).SWITCH_STATUS
          console.log('--线程是否存活--', this.isLiveData);
          break
        case 'MONITOR_REQ_RETURN': // 开关
          this.$message.success(resData.msg)
          break
        case 'MONITOR_GET_PROJ_TASK_LIST': // 获取历史脚本列表
          if (resData.recAccount === this.$store.state.userInfo.account) {
            var projTaskList = []
            if (resData.msg !== '{}') {
              for (let key in JSON.parse(resData.msg)) {
                let projTask = {
                  label: key,
                  value: key,
                  children: []
                }
                JSON.parse(resData.msg)[key].forEach(item => {
                  projTask.children.push({
                    label: item,
                    value: item
                  })
                })
                projTaskList.push(projTask)
              }
            }
            this.projTaskList = projTaskList
            console.log('--历史脚本--', this.projTaskList);
          }
          break
        case 'MONITOR_GET_STRESS_DETAIL':
          if (resData.recAccount === this.$store.state.userInfo.account) {
            this.addShellInitData = JSON.parse(resData.msg)
          }
          break
        case 'MONITOR_REQ_ERR_RETURN':
          if (resData.msg) {
            if (resData.msg !== '{}') {
              this.$message.error(resData.msg)
            } else {
              this.$message.error('请求返回失败')
            }
          } else {
            this.$message.error('请求返回失败')
          }
          break
      }
    },
    // 发送socket参数
    socketSend (params) {
      switch (this.socket.readyState) {
        case WebSocket.CONNECTING:
          console.log('webSocket 连接中。。。')
          setTimeout(() => {
            this.socketSend(params)
          }, 500)
          break
        case WebSocket.OPEN:
          console.log('webSocket 已连接。')
          console.log('--send params--', params)
          this.socket.send(JSON.stringify(params))
          break
      }
    },
    socketError () {},
    // 单元格右击
    rightClick (hostName) { // 暂时不开放
      console.log(hostName);
      // this.socketSend({
      //   bindPage: this.bindKey,
      //   type: 'REQ_BACKEND',
      //   msgType: 'filterPod',
      //   msg: hostName
      // })
    },
    // 单元格样式
    cellClassName ({ row, columnIndex }) {
      if (columnIndex === 0) {
        if ('cpuLive' in this.isLiveData && !this.isLiveData.cpuLive) {
          return 'type_2'
        }
        return 'type_' + row.cpuColor
      }
      if (columnIndex === 1) {
        if ('ioLive' in this.isLiveData && !this.isLiveData.ioLive) {
          return 'type_2'
        }
        return 'type_' + row.ioColor
      }
      if (columnIndex === 2) {
        if ('memLive' in this.isLiveData && !this.isLiveData.memLive) {
          return 'type_2'
        }
        return 'type_' + row.memColor
      }
      if (columnIndex === 3) {
        if ('tcpLive' in this.isLiveData && !this.isLiveData.tcpLive) {
          return 'type_2'
        }
        return 'type_' + row.tcpColor
      }
      if (columnIndex === 4) {
        if ('loadLive' in this.isLiveData && !this.isLiveData.loadLive) {
          return 'type_2'
        }
        return 'type_' + row.loadColor
      }
      if (columnIndex === 5) {
        if ('inLive' in this.isLiveData && !this.isLiveData.inLive) {
          return 'type_2'
        }
        return 'type_' + row.inColor
      }
      if (columnIndex === 6) {
        if ('outLive' in this.isLiveData && !this.isLiveData.outLive) {
          return 'type_2'
        }
        return 'type_' + row.outColor
      }
      if (columnIndex === 7) {
        if ('phpLive' in this.isLiveData && !this.isLiveData.phpLive) {
          return 'type_2'
        }
        return 'type_' + row.phpColor
      }
      if (columnIndex === 8) {
        if ('qpsLive' in this.isLiveData && !this.isLiveData.qpsLive) {
          return 'type_2'
        }
        return 'type_' + row.qpsColor
      }
      if (columnIndex === 9) {
        if ('mysqlLive' in this.isLiveData && !this.isLiveData.mysqlLive) {
          return 'type_2'
        }
        return 'type_' + row.mysqlQpsColor
      }
      if (columnIndex === 10) {
        if ('mysqlThreadLive' in this.isLiveData && !this.isLiveData.mysqlThreadLive) {
          return 'type_2'
        }
        return 'type_' + row.mysqlThreadColor
      }
      if (columnIndex === 11) {
        if ('mysqlThreadRunLive' in this.isLiveData && !this.isLiveData.mysqlThreadRunLive) {
          return 'type_2'
        }
        return 'type_' + row.mysqlThreadRunColor
      }
      if (columnIndex === 12) {
        if ('codisProxyLive' in this.isLiveData && !this.isLiveData.codisProxyLive) {
          return 'type_2'
        }
        return 'type_' + row.codisProxyColor
      }
    }
  }
}
</script>