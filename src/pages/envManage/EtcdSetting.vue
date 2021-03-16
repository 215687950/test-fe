<style lang="scss">
.page-etcdSetting {
  .info-box {
    position: relative;
    font-size: 16px;
    color: #aaa;
    .btns {
      position: absolute;
      right: 0;
      z-index: 1;
    }
    .el-row {
      margin-bottom: 10px;
      display: flex;
      .span1 {
        width: 220px;
        padding-right: 20px;
      }
      .span2 {
        width: 250px;
      }
      span {
        color: #333;
      }
    }
  }
  .el-tabs {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .el-tabs__content {
      flex: 1;
      overflow: hidden;
      .el-tab-pane {
        height: 100%;
        display: flex;
        flex-direction: column;
        .table-box {
          flex: 1;
          overflow: hidden;
        }
      }
    }
  }
  .check-dialog {
    .el-row {
      display: flex;
      margin-bottom: 16px;
      .label {
        margin-right: 10px;
      }
      .content {
        flex: 1;
        overflow: hidden;
        .el-tag {
          margin-right: 8px;
          margin-bottom: 8px;
        }
      }
    }
  }
  .whiteList-dialog {
    height: 100%;
    .el-dialog {
      height: 80%;
      .el-dialog__body {
        display: flex;
        flex-direction: column;
        .whiteList-table-box {
          flex: 1;
          overflow: hidden;
        }
      }
    }
  }
  .el-drawer__wrapper {
    .el-drawer__body {
      overflow: hidden;
      display: flex;
      .drawer-content {
        flex: 1;
        overflow: hidden;
        padding: 0 20px 20px;
        display: flex;
        flex-direction: column;
        .code-diff-box {
          flex: 1;
          overflow: auto;
          position: relative;
        }
      }
    }
  }
}
</style>
<template>
  <div class="page page-etcdSetting">
    <div class="info-box">
      <div class="btns">
        <el-button
          :loading="checkLoading"
          type="primary"
          size="small"
          icon="el-icon-search"
          @click="checkHandle"
          style="margin-right:10px">{{checkLoading ? '还未检查完毕' : '进行新的检查'}}</el-button>
        <el-button :loading="loading.whiteList" type="info" size="small" @click="viewWhiteList">查看白名单</el-button>
      </div>
      <el-row>
        <div class="span1">
          最新一次检测情况<span style="margin-left: 20px;">{{checkResult.userName}}</span>
        </div>
        <div class="span2">
          更新于<span style="margin: 0 20px;">{{checkResult.createTime}}</span>
        </div>
      </el-row>
      <el-row>
        <div class="span1">
          <label style="word-spacing: 6px;font-weight:normal">检查 key 的个数</label><span style="margin-left: 20px">{{checkResult.allCount}}</span>
        </div>
        <div class="span2">
          忽略路径数<span style="margin-left: 20px;">{{checkResult.ignorePath ? JSON.parse(checkResult.ignorePath).length : 0}}</span>
        </div>
      </el-row>
      <el-row style="display: flex;align-items: center;">
        <label style="margin-right: 20px">检查路径</label>
        <template v-if="checkResult.prefixName">
          <el-tag
            type="warning"
            size="small"
            v-for="item in JSON.parse(checkResult.prefixName)"
            :key="item"
            style="margin-right:10px">{{item}}</el-tag>
        </template>
      </el-row>
      <el-row style="display: flex;align-items: center;">
        <label style="margin-right: 20px">检查环境</label>
        <template v-if="checkResult.envType">
          <el-tag
            size="small"
            v-for="item in checkResult.envTypeName"
            :key="item"
            style="margin-right:10px">{{item}}</el-tag>
        </template>
      </el-row>
    </div>
    <el-tabs v-model="activeName" @tab-click="tabChange">
      <el-tab-pane label="缺失的key" name="1">
        <div class="table-box" ref="table-box1">
          <el-table
            v-loading="tableLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="#FFFAFA)"
            :data="tableData1"
            :height="tableHeight1"
            border
            style="width: 100%">
            <el-table-column prop="keyName" label="key值" min-width="3">
              <template slot-scope="scope">
                <span @click="openDrawer(scope.row)">{{ scope.row.keyName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="envName" label="缺少该key的环境" align="center" min-width="1"></el-table-column>
            <el-table-column prop="" label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  :loading="loading.showSync && syncIndex === scope.$index"
                  @click="syncSetting(scope.row, scope.$index)">同步</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <Pagination
          :total="total1"
          :currentPage="page1"
          @on-size-change="handleSizeChange"
          @on-current-change="handleCurrentChange"></Pagination>
      </el-tab-pane>
      <el-tab-pane label="内容不同的key" name="2">
        <div class="table-box" ref="table-box2">
          <el-table
            v-loading="tableLoading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="#FFFAFA)"
            :data="tableData2"
            :height="tableHeight2"
            border
            style="width: 100%">
            <el-table-column prop="keyName" label="key值" min-width="3">
              <template slot-scope="scope">
                <span @click="openDrawer(scope.row)">{{ scope.row.keyName }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="envName" label="已存在该key的环境" align="center" min-width="1"></el-table-column>
            <el-table-column prop="" label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  :loading="loading.addWhiteList && addWhiteListIndex === scope.$index"
                  @click="addWhiteList(scope.row, scope.$index)">添至白名单</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <Pagination
          :total="total2"
          :currentPage="page2"
          @on-size-change="handleSizeChange"
          @on-current-change="handleCurrentChange"></Pagination>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="配置同步"
      :visible.sync="showDialog.sync"
      center
      width="400px">
      <div>{{syncData.keyName}}</div>
      <div style="margin: 16px 0">
        <span style="margin-right: 10px;letter-spacing: 6px">源环境</span>
        <el-select
          v-model="syncData.sourceEnv"
          placeholder="请选择环境"
          clearable>
          <el-option
            v-for="item in sourceList"
            :key="item.id"
            :label="item.completeName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div>
        <label style="margin-right: 10px">目标环境</label>
        {{String(syncData.targetEnv)}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.submitSync" type="primary" style="width: 100%" @click="syncSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="配置检查"
      class="big-dialog check-dialog"
      :visible.sync="showDialog.check"
      center
      width="800px">
      <el-row>
        <div class="label">检查路径</div>
        <div class="content">
          <el-tag type="warning" size="small">/</el-tag>
        </div>
      </el-row>
      <el-row>
        <div class="label">检查环境</div>
        <div class="content">
          <el-tag
            v-for="(item, index) in checkEnvTagList"
            :key="item.id"
            effect="plain"
            size="small"
            closable
            @close="delCheckEnvTag(index)">{{ item.completeName}}</el-tag>
        </div>
      </el-row>
      <el-row>
        <div class="label">
          <div>默认忽略</div>
          <div style="font-size:12px;color:#acacac">
            ({{defaultIgnoreTag.length}}个)
            <el-tooltip effect="dark" placement="right-start">
              <div slot="content">
                忽略检查的路径。
                <br>/config/test/ 将会忽略 /config/test/ 路径下所有key
                <br>/config/test 将会忽略 /config/ 路径下前缀为 test的所有key
                <br>
              </div>
              <i class="el-icon-question" style="color:#FFA500; font-size:16px"></i>
            </el-tooltip>
          </div>
        </div>
        <div class="content">
          <el-tag
            type="info"
            v-for="item in defaultIgnoreTag"
            :key="item"
            size="small">{{ item }}</el-tag>
        </div>
      </el-row>
      <el-row>
        <div class="label">
          <div>忽略路径</div>
          <div style="font-size:12px;color:#acacac">({{checkIgnorePathTag.length}}个)</div>
        </div>
        <div class="content">
          <el-tag
            type="info"
            v-for="(ignorePath, index) in checkIgnorePathTag"
            :key="ignorePath"
            effect="plain"
            size="small"
            closable
            @close="delIgnoreTag(index)"
          >{{ignorePath}}</el-tag>
        </div>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.check" type="primary" style="width: 100%" @click="checkSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="白名单"
      class="big-dialog whiteList-dialog"
      :visible.sync="showDialog.whiteList"
      center
      width="800px">
      <div class="whiteList-table-box" ref="whiteList-table-box">
        <el-table
          v-loading="whiteListTableLoading"
          :data="whiteListTableData"
          :height="whiteListTableHeight"
          border
          style="width: 100%">
          <el-table-column prop="keyName" label="key"></el-table-column>
          <el-table-column prop="" label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="removeWhiteList(scope.row)"
              >移除白名单</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination
        :total="whiteListTotal"
        :currentPage="whiteListPage"
        @on-size-change="whiteListSizeChange"
        @on-current-change="whiteListCurrentChange"></Pagination>
    </el-dialog>
    <el-drawer
      :title="drawerTitle"
      :visible.sync="showDrawer"
      size="80%"
      @close="drawerClose">
      <div class="drawer-content">
        <div>{{activeName === '1' ? '缺失key的环境：' : '拥有key的环境：'}}{{drawerEnv}}</div>
        <div style="margin: 10px 0">
          <el-select
            v-model="leftEnv"
            placeholder="请选择环境"
            size="small"
            @change="leftEnvChange">
            <el-option
              v-for="item in leftEnvList"
              :key="item.id"
              :label="item.completeName"
              :value="item.id"
              :disabled="item.disabled"></el-option>
          </el-select>
          <el-select
            v-model="rightEnv"
            placeholder="请选择环境"
            size="small"
            style="margin: 0 20px 0 10px"
            @change="rightEnvChange">
            <el-option
              v-for="item in rightEnvList"
              :key="item.id"
              :label="item.completeName"
              :value="item.id"
              :disabled="item.disabled"></el-option>
          </el-select>
          <el-button
            type="primary"
            size="small"
            :loading="diffLoading"
            :disabled="leftEnv === '' || rightEnv === ''"
            @click="handleContrast">对比</el-button>
        </div>
        <div class="code-diff-box" v-loading="diffLoading">
          <code-diff
            :old-string="oldSetting"
            :new-string="newSetting"
            :context="1000"
            outputFormat="side-by-side"/>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import CodeDiff from 'vue-code-diff'
export default {
  components: { Pagination, CodeDiff },
  data () {
    return {
      timer: null,
      envList: [],
      // 检查
      checkLoading: false,
      checkEnvTagList: [],
      defaultIgnoreTag: [
        '/hades', // 服务已停用
        '/gateway/', // 服务已停用
        '/dbproxy/', // 9 个
        '/wpt-codis3/', //只有3环境有 1环境没有
        '/micro-registry/', // 注册中心 12
        '/pan/register/', // 注册中心 1个
        '/professorx/lease/ms-server/', // 注册中心 4个
        '/massage/watch/wpt_message/', // 项目自动生成
        '/config/gateway/service', // 各个项目的网关配置
      ],
      checkIgnorePathTag: [
        '/qa-test',
        '/config/pan/hcl/storage/es',
        '/config/pan/hcl/storage/mysql',
        '/config/pan/hcl/storage/redis',
        '/config/ms-service/niffler', // 配置中心
        '/config/friend-go/friend-api',
        '/config/niffler/abtest',
        '/config/niffler/activity.wpt',
        '/config/niffler/ammut-go',
        '/config/niffler/api-order-logistics',
        '/config/niffler/api.weipaitang.com',
        '/config/niffler/api//config',
        '/config/niffler/api',
        '/config/niffler/business-data-center',
        '/config/niffler/da-recommend',
        '/config/niffler/diamond',
        '/config/niffler/express',
        '/config/niffler/framework-go',
        '/config/niffler/friend',
        '/config/niffler/gateway-go',
        '/config/niffler/group3-test',
        '/config/niffler/hades',
        '/config/niffler/helloworld',
        '/config/niffler/im-consult-active',
        '/config/niffler/kun',
        '/config/niffler/mercury-go',
        '/config/niffler/message-go',
        '/config/niffler',
        '/config/niffler/mo-go',
        '/config/niffler/mo-go/order',
        '/config/niffler/mo-go/order/wpt_baidu_miniprogram',
        '/config/niffler/niffler-agent',
        '/config/niffler/niffler-test',
        '/config/niffler/niffler',
        '/config/niffler/pan-admin',
        '/config/niffler/pan-test//config/pan/hcl/api/apicfg/books_forbid_log',
        '/config/niffler/pay-pmc.weipaitang.com',
        '/config/niffler/picture-go',
        '/config/niffler/professorx-web-api',
        '/config/niffler/rainbow-niffler',
        '/config/niffler/sale',
        '/config/niffler/shazam-agent',
        '/config/niffler/shazam',
        '/config/niffler/shield',
        '/config/niffler/test-express',
        '/config/niffler/wmapi.weipaitang.com',
        '/config/niffler/wpt_community',
        '/config/niffler/wpt_im',
        '/config/niffler/wukong-go',
        '/config/niffler/www.weipaitang.com',
        '/config/niffler/xid-sale-go',
        '/config/niffler/xid-user-go',
        '/config/niffler/xid-wushu-go',
      ],
      // 白名单
      whiteListTableLoading: false,
      whiteListTableData: [],
      whiteListTableHeight: null,
      whiteListTotal: 0,
      whiteListPage: 1,
      whiteListPageSize: 10,
      // 结果信息
      checkResult: {},
      // 下方表格
      activeName: '1',
      tableLoading: false,
      tableHeight1: null,
      tableHeight2: null,
      tableData1: [],
      tableData2: [],
      total1: 0,
      total2: 0,
      page1: 1,
      page2: 1,
      pageSize1: 10,
      pageSize2: 10,
      showDialog: {
        check: false,
        whiteList: false,
        sync: false
      },
      loading: {
        check: false,
        whiteList: false,
        showSync: false,
        submitSync: false,
        addWhiteList: false
      },
      syncIndex: null,
      syncData: {
        keyName: '',
        sourceEnv: '',
        targetEnv: []
      },
      sourceList: [],
      addWhiteListIndex: null,
      showDrawer: false,
      drawerTitle: '',
      drawerEnv: '',
      leftEnvList: [],
      rightEnvList: [],
      leftEnv: '',
      rightEnv: '',
      diffLoading: false,
      oldSetting: '',
      newSetting: ''
    }
  },
  created () {
    this.getcheckResult()
  },
  destroyed () {
    clearInterval(this.timer)
  },
  mounted () {
    window.onresize = () => {
      this['tableHeight' + this.activeName] = this.$refs['table-box' + this.activeName].offsetHeight
      this.whiteListTableHeight = this.$refs['whiteList-table-box'].offsetHeight
    }
  },
  methods: {
    // 抽屉
    openDrawer (row) {
      this.drawerTitle = row.keyName
      this.drawerEnv = row.envName
      this.leftEnvList = JSON.parse(JSON.stringify(this.envList))
      this.rightEnvList = JSON.parse(JSON.stringify(this.envList))
      let envArr = row.env.split(',')
      if (envArr.length === 1) {
        this.leftEnv = Number(envArr[0])
        this.leftEnvChange(this.leftEnv)
      } else if (envArr.length > 1) {
        this.leftEnv = Number(envArr[0])
        this.leftEnvChange(this.leftEnv)
        this.rightEnv = Number(envArr[1])
        this.rightEnvChange(this.rightEnv)
      }
      this.showDrawer = true
    },
    leftEnvChange (id) {
      this.rightEnvList.forEach(item => {
        if (item.id === id) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
    },
    rightEnvChange (id) {
      this.leftEnvList.forEach(item => {
        if (item.id === id) {
          item.disabled = true
        } else {
          item.disabled = false
        }
      })
    },
    handleContrast () {
      this.diffLoading = true
      this.oldSetting = ''
      this.newSetting = ''
      this.$service.getByKeyAndEnv({
        checkId: this.checkResult.id,
        key: this.drawerTitle,
        env: this.leftEnv,
        anotherEnv: this.rightEnv,
      }).then(res => {
        this.oldSetting = res.data.oldInfo.setting
        this.newSetting = res.data.newInfo.setting
      }).finally(() => {
        this.diffLoading = false
      })
    },
    drawerClose () {
      this.leftEnv = '',
      this.rightEnv = '',
      this.oldSetting = '',
      this.newSetting = ''
    },
    // 白名单
    viewWhiteList () {
      this.loading.whiteList = true
      this.whiteListTableData = []
      this.$service.getAllIgnore({
        page: this.whiteListPage,
        pageSize: this.whiteListPageSize,
      }).then(res => {
        res.data.list.forEach(item => {
          this.whiteListTableData.push({ keyName: item })
        })
        this.whiteListTotal = res.data.count
        this.showDialog.whiteList = true
        this.$nextTick(() => {
          this.whiteListTableHeight = this.$refs['whiteList-table-box'].offsetHeight
        })
      }).finally(() => {
        this.loading.whiteList = false
      })
    },
    getAllIgnore () {
      this.whiteListTableData = []
      this.whiteListTableLoading = true
      this.$service.getAllIgnore({
        page: this.whiteListPage,
        pageSize: this.whiteListPageSize,
      }).then(res => {
        res.data.list.forEach(item => {
          this.whiteListTableData.push({ keyName: item })
        })
        this.whiteListTotal = res.data.count
      }).finally(() => {
        this.whiteListTableLoading = false
      })
    },
    whiteListSizeChange (value) {
      this.whiteListPageSize = value
      this.whiteListPage = 1
      this.getAllIgnore()
    },
    whiteListCurrentChange (value) {
      this.whiteListPage = value
      this.getAllIgnore()
    },
    removeWhiteList (row) {
      this.$service.changeKey({
        checkId: this.checkResult.id,
        keyNameList: [row.keyName],
        type: 0
      }).then(() => {
        this.$message.success('移除成功，下次将会对该key进行检查')
        this.getAllIgnore()
      })
    },
    // 进行新的检查
    checkHandle () {
      this.$service.getEtcdEnv().then(res => {
        this.checkEnvTagList = res.data.filter(item => item.id !== 1)
        this.showDialog.check = true
      })
    },
    delCheckEnvTag (index) {
      this.checkEnvTagList.splice(index, 1)
    },
    delIgnoreTag (index) {
      this.checkIgnorePathTag.splice(index, 1)
    },
    checkSubmit () {
      let envTypeList = this.checkEnvTagList.map(item => item.id)
      this.loading.check = true
      this.$service.check({
        prefixList: ['/'],
        envTypeList,
        ignorePathList: [...this.defaultIgnoreTag, ...this.checkIgnorePathTag],
      }).finally(() => {
        this.loading.check = false
        this.showDialog.check = false
        this.getcheckResult()
      })
    },
    // 添至白名单
    addWhiteList (row, index) {
      this.addWhiteListIndex = index
      this.loading.addWhiteList = true
      this.$service.changeKey({
        checkId: this.checkResult.id,
        keyNameList: [row.keyName],
        type: 1
      }).then(() => {
        this.$message.success('添至白名单成功')
        this.getKeyList()
      }).finally(() => {
        this.loading.addWhiteList = false
      })
    },
    // 同步
    syncSetting (row, index) {
      let targetEnv = row.env.split(',')
      this.sourceList = []
      this.syncIndex = index
      this.loading.showSync = true
      this.$service.getEtcdEnv().then(res => {
        res.data.forEach(item => {
          if (!targetEnv.includes(String(item.id))) {
            this.sourceList.push(item)
          }
        })
      }).finally(() => {
        this.loading.showSync = false
      })
      this.syncData = {
        keyName: row.keyName,
        sourceEnv: '',
        targetEnv
      }
      this.showDialog.sync = true
    },
    syncSubmit () {
      this.loading.submitSync = true
      this.$service.syncKey({
        checkId: this.checkResult.id,
        ...this.syncData
      }).then(() => {
        this.$message.success('同步成功')
        this.showDialog.sync = false
        this.getKeyList()
      }).finally(() => {
        this.loading.submitSync = false
      })
    },
    tabChange (value) {
      if (value.name === '1') {
        this.tableHeight2 = null
      } else if (value.name === '2') {
        this.tableHeight1 = null
      }
      this.getKeyList()
    },
    // 获取结果信息
    getcheckResult () {
      this.$service.getEtcdEnv().then(res => {
        this.envList = res.data
        this.$service.getResultByCheckId({ checkId: -1 }).then(res => {
          let envTypeName = []
          let envType = JSON.parse(res.data.checkResult.envType)
          if (envType.length) {
            envType.forEach(item => {
              this.envList.forEach(env => {
                if (Number(item) === env.id) {
                  envTypeName.push(env.completeName)
                }
              })
            })
          }
          res.data.checkResult.envTypeName = envTypeName
          this.checkResult = res.data.checkResult
          this.checkLoading = this.checkResult.status === 0
          if (this.checkResult.status === 0) {
            clearInterval(this.timer)
            this.timer = setInterval(() => {
              this.getcheckResult()
            }, 1000 * 10)
          } else {
            clearInterval(this.timer)
            this.getKeyList()
          }
        })
      })
    },
    // 获取table数据
    getKeyList () {
      this.tableLoading = true
      this.$service.getKeyList({
        type: Number(this.activeName),
        checkId: this.checkResult.id,
        page: this['page' + this.activeName],
        pageSize: this['pageSize' + this.activeName]
      }).then(res => {
        res.data.forEach(row => {
          let drawerEnv = []
          row.env.split(',').forEach(item => {
            this.envList.forEach(env => {
              if (Number(item) === env.id) {
                drawerEnv.push(env.completeName)
              }
            })
          })
          row.envName = drawerEnv.join(', ')
        })
        this['tableData' + this.activeName] = res.data
        this.getKeyListTotal()
      }).finally(() => {
        this.$nextTick(() => {
          this['tableHeight' + this.activeName] = this.$refs['table-box' + this.activeName].offsetHeight
        })
        this.tableLoading = false
      })
    },
    getKeyListTotal () {
      this.$service.getCheckCount({ checkId: this.checkResult.id }).then(res => {
        this.total1 = res.data.lostCount
        this.total2 = res.data.diffCount
      })
    },
    // 切换每页条数
    handleSizeChange (value) {
      this['pageSize' + this.activeName] = value
      this['page' + this.activeName] = 1
      this.getKeyList()
    },
    // 切换页码
    handleCurrentChange (value) {
      this['page' + this.activeName] = value
      this.getKeyList()
    }
  }
}
</script>
