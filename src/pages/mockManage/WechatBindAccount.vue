<style lang="scss">
.page-wechatBindAccount {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
}
</style>
<template>
  <div class="page page-wechatBindAccount">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="快递公司ID/客户编码"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <label>选择环境</label>
      <el-select v-model="searchData.env" clearable>
        <el-option v-for="item in envTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <label>是否打开mock</label>
      <el-select v-model="searchData.isMock" clearable>
        <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button :type="isMockResult === 1 ? 'success' : 'danger'" size="small" @click="changedMock">
        {{isMockResult === 1 ? 'mock创建订单已打开' : 'mock创建订单已关闭'}}
      </el-button>
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
        style="width: 100%">
        <el-table-column prop="bizId" label="快递公司客户编码" align="center"></el-table-column>
        <el-table-column prop="deliveryId" label="快递公司ID" align="center"></el-table-column>
        <el-table-column prop="isBind" label="是否绑定" :formatter="formatBindStatus" align="center"></el-table-column>
        <el-table-column prop="env" label="环境" :formatter="formatEnv" align="center"></el-table-column>
        <el-table-column prop="isMock" label="是否mock" :formatter="formatType" align="center">
          <template v-slot="{ row }">
            <el-switch
              v-model="row.isMock"
              active-color="#13ce66"
              @change="switchChanged(row)"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="light" content="mock" placement="top">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-magic-stick"
                  :disabled="!scope.row.isMock"
                  @click="openMockDialog(scope.row)"
                ></el-button>
              </el-tooltip>
                <el-tooltip class="item" effect="light" content="触发" placement="top">
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-thumb"
                  :disabled="!scope.row.isMock"
                  @click="mockBindCallBackClick(scope.row)"
                ></el-button>
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"></Pagination>
    <el-dialog title="mock绑定账号"
      :visible.sync="showDialog.createMockOrder"
      center
      width="80%">
      <div class="page-search-bar">
        <label>请选择mock模式</label>
        <el-select v-model="bindStatusSelect" clearable @change="changedMockBind">
          <el-option
            v-for="item in bindResultArray"
            :key="item.code"
            :label="item.msg"
            :value="item.code"
          ></el-option>
        </el-select>
      </div>
      <el-input v-model="wechatBindData" type="textarea" :rows="20" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.createMockOrder" type="primary" style="width: 100%" @click="mockBindAccountSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="mock物流回调"
      :visible.sync="showDialog.mock"
      center
      width="80%">
      <el-input v-model="mockData.mockData" type="textarea" :rows="20" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.mock" type="primary" style="width: 100%" @click="mockCallBackSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import mixin from '@/mixins/mixin'
export default {
  components: { Pagination },
  mixins: [mixin],
  data () {
    return {
      searchData: {
        page: 1,
        pageSize: 10,
        keywords: '',
        env: '',
        isMock: ''
      },
      envTypeList: [
        { id: 2, name: "env-02" },
        { id: 3, name: "env-03" },
        { id: 4, name: "env-04" },
        { id: 5, name: "env-05" },
        { id: 6, name: "env-06" },
        { id: 7, name: "env-07" }
      ],
      typeList: [
        { id: true, name: "MOCK" },
        { id: false, name: "NORMAL" }
      ],
      bindArray: [
        { id: "bind", name: "绑定" },
        { id: "unbind", name: "解除绑定" }
      ],
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      isMockResult: '',
      showDialog: {
        createMockOrder: false,
        mock: false
      },
      loading: {
        createMockOrder: false,
        mock: false
      },
      wechatBindData: '',
      bindStatusSelect: '',
      bindResultArray: [
        { code: "0", msg: "成功" },
        { code: "-1", msg: "系统失败" },
        { code: "9300529", msg: "账号已绑定过" },
        { code: "9300530", msg: "解绑的biz_id不存在" },
        { code: "9300531", msg: "账号或密码错误" },
        { code: "9300532", msg: "绑定已提交，审核中" }
      ],
      mockResultObj: {
        errcode: 0,
        errmsg: "ok"
      },
      mockData: {
        bizId: '',
        mockData: ''
      }
    }
  },
  methods: {
    openMockDialog (row) {
      this.$service.getBindMockData({ bizId: row.bizId }).then(res => {
        this.mockData.bizId = row.bizId
        this.mockData.mockData = res.data
        this.showDialog.mock = true
      })
    },
    mockCallBackSubmit () {
      this.loading.mock = true
      this.$service.saveBindMockData(this.mockData).then(() => {
        this.$message.success('保存mock成功!')
        this.showDialog.mock = false
      })
    },
    mockBindCallBackClick (row) {
      this.$service.mockBindCallBack({ bizId: row.bizId }).then(() => {
        this.$message.success('绑定账号回调触发成功!')
      })
    },
    // mock创建订单mock开/关
    changedMock () {
      if (this.isMockResult === 0) { // 关
        this.showDialog.createMockOrder = true
      } else { // 开
        this.changedWechatMock('0')
      }
    },
    changedMockBind(code) {
      if (code == 0) {
        this.wechatBindData = JSON.stringify(JSON.parse(JSON.stringify(this.mockResultObj)), null, '\t')
      } else {
        let item = this.bindResultArray.find(item => item.code === code)
        this.mockResultObj.errcode = code
        this.mockResultObj.errmsg = item.msg
        this.wechatBindData = JSON.stringify(JSON.parse(JSON.stringify(this.mockResultObj)), null, '\t')
      }
    },
    mockBindAccountSubmit () {
      if ("" == this.wechatBindData || undefined == this.wechatBindData) {
        this.$message.error('请选择mock数据后提交')
        return
      }
      this.changedWechatMock('1')
    },
    changedWechatMock (type) {
      this.$service.mockResult({
        isMockResult: type,
        mockResultValue: this.wechatBindData
      }).then(() => {
        if (type === '1') {
          this.$message.success('微信平台创建订单mock已打开!')
          this.isMockResult = 1
          this.showDialog.createMockOrder = false
        } else {
          this.$message.warning('微信平台创建订单mock已关闭!')
          this.isMockResult = 0
        }
        this.getTableData()
      })
    },
    // mock开关
    switchChanged(row) {
      this.$service.changeBindMockStatus({
        isMock: row.isMock,
        id: row.id
      }).then(() => {
        this.$message.success('绑定账号mock状态更改成功!')
        this.getTableData()
      })
    },
    formatType(row) {
      let item = this.typeList.find(item => item.id === row.isMock);
      return item == undefined ? "" : item.name;
    },
    formatBindStatus(row) {
      let item = this.bindArray.find(item => item.id === row.isBind);
      return item == undefined ? "" : item.name;
    },
    formatEnv(row) {
      let item = this.envTypeList.find(item => item.id === row.env);
      return item == undefined ? "" : item.name;
    },
    // 获取表格数据
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      params.isMock = params.isMock ? '1' : '0'
      this.tableLoading = true
      this.$service.listWechatBind(params).then(res => {
        this.tableData = res.data.data
        this.total = res.data.totalCount
        if (res.data.isMockResult == 1) {
          this.isMockResult = 1
        } else {
          this.isMockResult = 0
        }
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>