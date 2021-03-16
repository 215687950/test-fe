<style lang="scss">
.page-wechatExpress {
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
    .el-collapse-item__content {
      .data-item-box {
        height: 90px;
        overflow-y: auto;
      }
    }
  }
}
</style>
<template>
  <div class="page page-wechatExpress">
    <div class="page-search-bar">
      <label>关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="订单号/物流单号"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <label>选择环境</label>
      <el-select v-model="searchData.env" clearable>
        <el-option v-for="item in envTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <label>是否打开mock</label>
      <el-select v-model="searchData.type" clearable>
        <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button :type="wechatMock === 1 ? 'success' : 'danger'" size="small" @click="changedMock">
        {{wechatMock === 1 ? 'mock创建订单已打开' : 'mock创建订单已关闭'}}
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
        <el-table-column prop="expressNum" label="物流单号" align="center"></el-table-column>
        <el-table-column prop="orderNum" label="订单号" align="center"></el-table-column>
        <el-table-column prop="expressPlatform" label="物流平台" :formatter="formatPlatform" align="center"></el-table-column>
        <el-table-column prop="env" label="环境" :formatter="formatEnv" align="center"></el-table-column>
        <el-table-column prop="type" label="是否mock" :formatter="formatType" align="center">
          <template v-slot="{ row }">
            <el-switch
              v-model="row.type"
              active-color="#13ce66"
              @change="switchChanged(row)"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="160px" align="center">
          <template slot-scope="scope">
            <el-button-group>
              <el-tooltip class="item" effect="light" content="mock" placement="top">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-magic-stick"
                  :disabled="!scope.row.type"
                  @click="openMockDialog(scope.row)"
                ></el-button>
              </el-tooltip>
                <el-tooltip class="item" effect="light" content="触发" placement="top">
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-thumb"
                  :disabled="!scope.row.type"
                  @click="mockPathCallBackClick(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="light" content="查看" placement="top">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-s-order"
                  @click="showExpressDetail(scope.row)"
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
    <el-dialog title="mock创建订单"
      :visible.sync="showDialog.createMockOrder"
      center
      width="80%">
      <div class="page-search-bar">
        <label>请选择mock模式</label>
        <el-select v-model="createMockOrderType" clearable @change="changedCreateType">
          <el-option
            v-for="item in wechatCreateType"
            :key="item.code"
            :label="item.msg"
            :value="item.code"
          ></el-option>
        </el-select>
      </div>
      <el-input v-model="wechatCreateData" type="textarea" :rows="20" placeholder="请输入内容"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.createMockOrder" type="primary" style="width: 100%" @click="createMockOrderSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流单详情"
      :visible.sync="showDialog.expressDetail"
      center
      width="80%">
      <el-tabs v-model="expressDetailActive">
        <el-tab-pane label="Normal数据" name="normal">
          <el-input v-model="expressDetail.detailNormalData" type="textarea" :rows="20" disabled></el-input>
        </el-tab-pane>
        <el-tab-pane label="Mock数据" name="mock">
          <el-input v-model="expressDetail.detailMockData" type="textarea" :rows="20" disabled></el-input>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog title="Mock物流轨迹回调"
      :visible.sync="showDialog.mock"
      center
      width="970px">
      <el-form :model="pathFormData" :inline="true" label-width="70px">
        <el-form-item label="物流平台">
          <el-input placeholder="微信物流助手" disabled></el-input>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="pathFormData.expressNum" disabled></el-input>
        </el-form-item>
        <el-form-item label="平台单号">
          <el-input v-model="pathFormData.orderNum" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择环境">
          <el-select v-model="pathFormData.env" disabled>
            <el-option v-for="item in envTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流备注">
          <el-input v-model="pathFormData.mockRemark" clearable placeholder="请输入物流备注"></el-input>
        </el-form-item>
        <el-collapse>
          <el-collapse-item title="设置轨迹回调推送" name="1">
            <el-button type="success" size="small" plain @click="addPathDataItem" style="margin-bottom:10px">新增详情</el-button>
            <div class="data-item-box">
              <el-row v-for="(item, index) in pathFormData.actions" :key="index">
                <el-form-item label="节点时间">
                  <el-date-picker v-model="item.ActionTime" clearable placeholder="选择节点时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="节点类型">
                  <el-select v-model="item.ActionType" placeholder="选择节点类型">
                    <el-option v-for="item in actionTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="节点详情">
                  <el-input v-model="item.ActionMsg" clearable placeholder="请输入节点详情"></el-input>
                  <el-button type="danger" size="small" plain style="margin-left:20px" @click="delPathDataItem(index)">删除</el-button>
                </el-form-item>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.mock" type="primary" style="width: 100%" @click="pathSubmit">提交</el-button>
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
        type: '',
        platform: 4,
        searchType: 'wechat'
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
      platformList: [
        { id: 1, name: "菜鸟" },
        { id: 2, name: "丰桥" },
        { id: 3, name: "万维易源" },
        { id: 4, name: "微信物流助手" }
      ],
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      wechatMock: '',
      showDialog: {
        createMockOrder: false,
        expressDetail: false,
        mock: false
      },
      loading: {
        createMockOrder: false,
        mock: false
      },
      wechatCreateData: '',
      createMockOrderType: '',
      wechatCreateType: [
        { code: "200", msg: "下单成功" },
        { code: "-1", msg: "系统失败" },
        { code: "47001", msg: "格式错误" },
        { code: "40003", msg: "openid无效" },
        { code: "9300502", msg: "快递公司系统错误" },
        { code: "9300501", msg: "快递侧逻辑错误，详细原因需要看 delivery_resultcode"},
        { code: "9300503", msg: "delivery_id 不存在" },
        { code: "9300510", msg: "service_type 不存在" },
        { code: "9300526", msg: "字段长度不正确" },
        { code: "930561", msg: "参数错误" },
        { code: "9300525", msg: "bizid未绑定" },
        { code: "9300534", msg: "add_source=2时，wx_appid和当前小程序不同主体"},
        { code: "9300535", msg: "shop字段商品缩略图 url、商品名称为空或者非法，或者商品数量为0"},
        { code: "9300536", msg: "add_source=2时，wx_appid无效" },
        { code: "9300531", msg: "bizid" },
        { code: "930564", msg: "沙盒环境调用无配额" },
        { code: "930559", msg: "沙盒环境openid无效" }
      ],
      wechatCreateSuccessData: {
        orderId: "01234567890123456789",
        waybillId: "123456789",
        waybillData: [{}],
        errMsg: "openapi.logistics.addOrder:ok"
      },
      wechatCreateErrorData: {
        errCode: 9300501,
        errMsg: "openapi.logistics.addOrder:fail delivery logic fail",
        deliveryResultcode: 10002,
        deliveryResultmsg: ""
      },
      expressDetail: {
        detailNormalData: '',
        detailMockData: ''
      },
      expressDetailActive: 'normal',
      pathFormData: {
        actions: []
      },
      actionTypeList: [
        { id: 100001, name: "揽件阶段-揽件成功"},
        { id: 100002, name: "揽件阶段-揽件失败"},
        { id: 100003, name: "揽件阶段-分配业务员"},
        { id: 200001, name: "运输阶段-更新运输轨迹"},
        { id: 300002, name: "派送阶段-开始派送"},
        { id: 300003, name: "派送阶段-签收成功"},
        { id: 300004, name: "派送阶段-签收失败"},
        { id: 400001, name: "异常阶段-订单取消"},
        { id: 400002, name: "异常阶段-订单滞留"}
      ],
    }
  },
  methods: {
    // Mock物流轨迹回调
    openMockDialog (row) {
      this.pathFormData = Object.assign({}, row, this.pathFormData)
      this.showDialog.mock = true
    },
    pathSubmit () {
      if (this.pathFormData.actions.length === 0) {
        this.$message.error('请填写mock必要信息!')
        return
      }
      this.loading.mock = true
      this.$service.mockWechatUpdatePath({ expressOrderId: this.pathFormData.id, ...this.pathFormData}).then(() => {
        this.$message.success('mock微信物流轨迹回调成功')
        this.showDialog.mock = false
      }).finally(() => {
        this.loading.mock = false
      })
    },
    addPathDataItem () {
      this.pathFormData.actions.push({ ActionTime: '', ActionType: '', ActionMsg: '' })
    },
    delPathDataItem (index) {
      this.pathFormData.actions.splice(index, 1)
    },
    // 触发
    mockPathCallBackClick (row) {
      this.$service.mockUpdatePathStart({ id: row.id }).then(() => {
        this.$message.success('轨迹回调触发成功!')
      })
    },
    // 查看详情
    showExpressDetail (row) {
      this.$service.selectExpressDetail({ expressId: row.id }).then(res => {
        let detailNormalData = res.data.normal == 'null' || res.data.normal == undefined ? '{"msg":"暂无Normal数据"}' : res.data.normal
        let detailMockData = res.data.mock == 'null' || res.data.mock == undefined ? '{"msg":"暂无Normal数据"}' : res.data.mock
        this.expressDetail.detailNormalData = JSON.stringify(JSON.parse(detailNormalData), null, '\t')
        this.expressDetail.detailMockData = JSON.stringify(JSON.parse(detailMockData), null, '\t')
        this.showDialog.expressDetail = true
      })
    },
    // 微信平台创建订单mock开/关
    changedMock () {
      if (this.wechatMock === 0) { // 关
        this.showDialog.createMockOrder = true
      } else { // 开
        this.changedWechatMock('0')
      }
    },
    createMockOrderSubmit () {
      this.changedWechatMock('1')
    },
    changedWechatMock (type) {
      this.$service.changedWechatMock({
        type: type,
        value: this.wechatCreateData
      }).then(() => {
        if (type === '1') {
          this.$message.success('微信平台创建订单mock已打开!')
          this.wechatMock = 1
          this.showDialog.createMockOrder = false
        } else {
          this.$message.warning('微信平台创建订单mock已关闭!')
          this.wechatMock = 0
        }
        this.getTableData()
      })
    },
    changedCreateType (code) {
      if (code === '200') {
        this.wechatCreateData = JSON.stringify(JSON.parse(JSON.stringify(this.wechatCreateSuccessData)), null, '\t')
      } else {
        let item = this.wechatCreateType.find(item => item.code === code)
        this.wechatCreateErrorData.errCode = code
        this.wechatCreateErrorData.errMsg = item.msg
        this.wechatCreateData = JSON.stringify(JSON.parse(JSON.stringify(this.wechatCreateErrorData)), null, '\t')
      }
    },
    // mock开关
    switchChanged(row) {
      this.$service.changedMockStatus({
        isMock: row.type,
        id: row.id,
        expressNum: row.expressNum
      }).then(() => {
        this.$message.success('Mock状态修改成功')
        this.getTableData()
      })
    },
    formatPlatform(row) {
      let item = this.platformList.find(item => item.id === row.expressPlatform)
      return item == undefined ? '' : item.name
    },
    formatEnv(row) {
      let item = this.envTypeList.find(item => item.id === row.env)
      return item == undefined ? '' : item.name
    },
    formatType(row) {
      let item = this.typeList.find(item => item.id === row.type)
      return item == undefined ? '' : item.name
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.$service.selectExpressInfoList(this.searchData).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
        if (res.data.wechatMock == 1) {
          this.wechatMock = 1
        } else {
          this.wechatMock = 0
        }
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>