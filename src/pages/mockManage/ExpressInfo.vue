<style lang="scss">
.page-expressInfo {
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
  <div class="page page-expressInfo">
    <div class="page-search-bar">
      <label>物流平台</label>
      <el-select v-model="searchData.platform" clearable>
        <el-option v-for="item in platformList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <label>环境</label>
      <el-select v-model="searchData.env" clearable>
        <el-option v-for="item in envTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <label>是否打开mock</label>
      <el-select v-model="searchData.type" clearable>
        <el-option v-for="item in typeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
    </div>
    <div class="page-search-bar">
      <label style="margin-left: 14px;">关键字</label>
      <el-input
        v-model="searchData.keywords"
        placeholder="订单号/物流单号"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" @click="fengqiaoMockClick">丰桥下单</el-button>
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
              @change="switchChanged(row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
        <el-table-column label="操作" width="130px" align="center">
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
    <el-dialog title="丰桥下单"
      :visible.sync="showDialog.fengqiao"
      center
      width="80%">
      <el-form :model="fengqiaoFormData" :inline="true" label-width="80px">
        <el-form-item label="业务单号">
          <el-autocomplete
            v-model="fengqiaoFormData.orderSn"
            :fetch-suggestions="fengqiaoOrderListReq"
            placeholder="请输入业务单号"></el-autocomplete>
        </el-form-item>
        <el-form-item label="mock模式">
          <el-select
            v-model="fengqiaoFormData.fengqiaoType"
            @change="changedFengqiao"
            clearable>
            <el-option
              v-for="item in fengqiaoMockType"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开启mock">
          <el-switch
            v-model="fengqiaoFormData.type"
            active-color="#13ce66"
            inactive-color="#ff4949"></el-switch>
        </el-form-item>
        <el-input v-model="fengqiaoFormData.fengqiaoData" type="textarea" :rows="20" placeholder="请输入内容"></el-input>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.fengqiao" type="primary" style="width: 100%" @click="fengqiaoSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="物流单详情"
      :visible.sync="showDialog.detail"
      center
      width="80%">
      <el-tabs v-model="detailActive">
        <el-tab-pane label="Normal数据" name="normal">
          <el-input v-model="detailData.normal" type="textarea" :rows="20" disabled></el-input>
        </el-tab-pane>
        <el-tab-pane label="Mock数据" name="mock">
          <el-input v-model="detailData.mock" type="textarea" :rows="20" disabled></el-input>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <el-dialog title="Mock菜鸟"
      :visible.sync="showDialog.cainiao"
      center
      width="1070px">
      <el-tabs v-model="cainiaoActive">
        <el-tab-pane label="Mock推送" name="push">
          <el-form :model="cainiaoPushData" :inline="true" label-width="130px">
            <el-form-item label="物流平台">
              <el-select v-model="cainiaoPushData.expressPlatform" disabled>
                <el-option v-for="item in platformList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流单号">
              <el-input v-model="cainiaoPushData.expressNum" disabled></el-input>
            </el-form-item>
            <el-form-item label="平台单号">
              <el-input v-model="cainiaoPushData.orderNum" disabled></el-input>
            </el-form-item>
            <el-form-item label="选择环境">
              <el-select v-model="cainiaoPushData.env" disabled>
                <el-option v-for="item in envTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="快递公司Code">
              <el-input v-model="cainiaoPushData.cpCode" clearable placeholder="请输入快递公司code"></el-input>
            </el-form-item>
            <el-form-item label="包裹状态">
              <el-select v-model="cainiaoPushData.logisticsStatus" clearable>
                <el-option v-for="item in cainiaoStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="包裹状态更新时间">
              <el-date-picker v-model="cainiaoPushData.logisticsGmtModified" size="small" placeholder="选择日期" clearable></el-date-picker>
            </el-form-item>
            <el-form-item label="最新包裹详情信息">
              <el-input v-model="cainiaoPushData.lastLogisticDetail" clearable placeholder="请输入最后一次包裹详情信息" style="width:540px"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="Mock拉取" name="pull">
          <el-form :model="cainiaoPullData" :inline="true" label-width="104px">
            <el-form-item label="物流平台">
              <el-select v-model="cainiaoPullData.expressPlatform" disabled>
                <el-option v-for="item in platformList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物流单号">
              <el-input v-model="cainiaoPullData.expressNum" disabled></el-input>
            </el-form-item>
            <el-form-item label="平台单号">
              <el-input v-model="cainiaoPullData.orderNum" disabled></el-input>
            </el-form-item>
            <el-form-item label="选择环境">
              <el-select v-model="cainiaoPullData.env" disabled>
                <el-option v-for="item in envTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="快递公司Code">
              <el-input v-model="cainiaoPullData.cpCode" :disabled="cainiaoDisabled" clearable placeholder="请输入快递公司code"></el-input>
            </el-form-item>
            <el-form-item label="包裹状态">
              <el-select v-model="cainiaoPullData.logisticsStatus" :disabled="cainiaoDisabled" clearable>
                <el-option v-for="item in cainiaoStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否成功">
              <el-select v-model="cainiaoPullData.success" clearable>
                <el-option v-for="item in caiNiaoresultStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="错误Code">
              <el-input v-model="cainiaoPullData.errorCode"  :disabled="!cainiaoDisabled" clearable placeholder="请输入错误Code"></el-input>
            </el-form-item>
            <el-form-item label="错误信息">
              <el-input v-model="cainiaoPullData.errorMsg"  :disabled="!cainiaoDisabled" clearable placeholder="请输入错误信息"></el-input>
            </el-form-item>
            <el-collapse>
              <el-collapse-item title="设置物流详情信息" name="1" :disabled="cainiaoDisabled">
                <el-button type="success" size="small" plain @click="addInfoItem" style="margin-bottom:10px">新增详情</el-button>
                <div class="data-item-box">
                  <el-row v-for="(item, index) in cainiaoPullData.fullTraceDetail" :key="index">
                    <el-form-item label="物流签收状态">
                      <el-select v-model="item.action" clearable>
                        <el-option v-for="item in cainiaoStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="物流详情时间">
                      <el-date-picker v-model="item.time" clearable placeholder="选择日期"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="当前城市">
                      <el-input v-model="item.city" clearable placeholder="请输入当前城市"></el-input>
                      <el-button type="danger" size="small" plain style="margin-left:20px" @click="delInfoItem(index)">删除</el-button>
                    </el-form-item>
                  </el-row>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.cainiao" type="primary" style="width: 100%" @click="cainiaoSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="Mock万维易源"
      :visible.sync="showDialog.wanwei"
      center
      width="1240px">
      <el-form :model="wanweiFormData" :inline="true" label-width="86px">
        <el-form-item label="物流平台">
          <el-select v-model="wanweiFormData.expressPlatform" disabled>
            <el-option v-for="item in platformList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="wanweiFormData.expressNum" disabled></el-input>
        </el-form-item>
        <el-form-item label="平台单号">
          <el-input v-model="wanweiFormData.orderNum" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择环境">
          <el-select v-model="wanweiFormData.env" disabled>
            <el-option v-for="item in envTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="快递公司Eg">
          <el-input v-model="wanweiFormData.showapiResBody.expSpellName" :disabled="wanweiDisabled" clearable placeholder="请输入快递公司英文"></el-input>
        </el-form-item>
        <el-form-item label="快递Cn">
          <el-input v-model="wanweiFormData.showapiResBody.expTextName" :disabled="wanweiDisabled" clearable placeholder="请输入快递公司名"></el-input>
        </el-form-item>
        <el-form-item label="更新时间">
          <el-date-picker v-model="wanweiFormData.showapiResBody.updateStr" :disabled="wanweiDisabled" placeholder="选择更新日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="wanweiFormData.showapiResBody.tel" :disabled="wanweiDisabled" clearable placeholder="请输入电话"></el-input>
        </el-form-item>
        <el-form-item label="包裹状态">
          <el-select v-model="wanweiFormData.showapiResBody.status" :disabled="wanweiDisabled">
            <el-option v-for="item in showApiStatusList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否成功">
          <el-select v-model="wanweiFormData.showapi_res_code">
            <el-option
              v-for="item in showApiResultStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="错误信息">
          <el-input v-model="wanweiFormData.showapi_res_error" :disabled="!wanweiDisabled" clearable placeholder="请输入错误信息"></el-input>
        </el-form-item>
        <el-collapse>
          <el-collapse-item title="设置快递配送信息" name="1" :disabled="wanweiDisabled">
            <el-button type="success" size="small" plain @click="addApiResBodyDataItem" style="margin-bottom:10px">新增配送信息</el-button>
            <div class="data-item-box">
              <el-row v-for="(item, index) in wanweiFormData.showapiResBody.data" :key="index">
                <el-form-item label="节点时间">
                  <el-date-picker v-model="item.time" clearable placeholder="选择快递节点时间"></el-date-picker>
                </el-form-item>
                <el-form-item label="节点描述">
                  <el-input v-model="item.context" clearable placeholder="请输入快递节点描述"></el-input>
                  <el-button type="danger" size="small" plain style="margin-left:20px" @click="delApiResBodyDataItem(index)">删除</el-button>
                </el-form-item>
              </el-row>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.wanwei" type="primary" style="width: 100%" @click="wanweiSubmit">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import mixin from '@/mixins/mixin'
import vkbeautify from "vkbeautify";
export default {
  components: { Pagination },
  mixins: [mixin],
  data () {
    return {
      searchData: {
        page: 1,
        pageSize: 10,
        keywords: '',
        platform: '',
        env: '',
        type: ''
      },
      platformList: [
        { id: 1, name: "菜鸟" },
        { id: 2, name: "丰桥" },
        { id: 3, name: "万维易源" }
      ],
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
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      detailActive: 'normal',
      detailData: {
        normal: '',
        mock: ''
      },
      showDialog: {
        fengqiao: false,
        detail: false,
        cainiao: false,
        wanwei: false
      },
      loading: {
        fengqiao: false,
        detail: false,
        cainiao: false,
        wanwei: false
      },
      // 丰桥
      fengqiaoSuccessData:
        "<Responseservice='OrderService'><Head>OK</Head><Body><OrderResponse \n \t \t filter_result='2' \n \t \t destcode='755' \n \t \t mailno='619428034014' \n \t \t origincode='755' \n \t \t orderid='TEST20180410001'><rls_info \n \t \t rls_errormsg='619428034014:' \n \t \t invoke_result='OK' \n \t \t rls_code='1000'><rls_detail \n \t \t waybillNo='619428034014' \n \t \t sourceTransferCode='755WF' \n \t \t sourceCityCode='755' \n \t \t sourceDeptCode='755AQ' \n \t \t sourceTeamCode='036' \n \t \t destCityCode='755' \n \t \t destDeptCode='755AQ' \n \t \t destDeptCodeMapping='755WF-S3' \n \t \t destTeamCode='036' \n \t \t destTransferCode='755WF' \n \t \t destRouteLabel='755WF-S3' \n \t \t proName='顺丰标快' \n \t \t argoTypeCode='C201' \n \t \t limitTypeCode='T4' \n \t \t expressTypeCode='B1' \n \t \t codingMapping='S3'xbFlag='0' \n \t \t printFlag='000000000' \n \t \t twoDimensionCode=' \n \t \t MMM={'k1':'755WF','k2':'755AQ','k3':'036','k4':'T4','k5':'619428034014','k6':'','k7':'dce4e1c6','k7':'3fc52389'}' \n \t \t proCode='T4' \n \t \t printIcon='00000000'/></rls_info></OrderResponse></Body></Response>",
      fengqiaoErrorSystemData:
        "<Response service='OrderService'><Head>ERR</Head><ERROR code='4001'>系统发生数据错误或运行时异常</ERROR></Response>",
      fengqiaoRepeatErrorData:
        "<Response service='OrderService><Head>ERR</Head><ERROR code='8016>重复下单</ERROR></Response>",
      fengqiaoMockType: [
        { id: "success", name: "成功" },
        { id: "errorSystem", name: "系统错误" },
        { id: "repeatOrderError", name: "重复下单" }
      ],
      fengqiaoOrderList: [],
      fengqiaoFormData: {
        orderSn: '',
        fengqiaoType: '',
        type: false,
        fengqiaoData: ''
      },
      // 万维易源
      wanweiFormData: {
        showapiResBody: {
          data: []
        }
      },
      showApiResultStatusList: [
        { id: "0", name: "成功" },
        { id: "-1", name: "失败(系统错误)" },
        { id: "-2", name: "失败(调用次数或金额为0)" }
      ],
      showApiStatusList: [
        { id: "-1", name: "待查询" },
        { id: "0", name: "查询异常" },
        { id: "1", name: "暂无记录" },
        { id: "2", name: "在途中" },
        { id: "3", name: "派送中" },
        { id: "4", name: "已签收" },
        { id: "5", name: "用户拒签" },
        { id: "6", name: "疑难件" },
        { id: "7", name: "无效单" },
        { id: "8", name: "超时单" },
        { id: "9", name: "签收失败" },
        { id: "10", name: "退回" }
      ],
      // 菜鸟
      cainiaoActive: 'push',
      cainiaoPushData: {},
      cainiaoPullData: {},
      cainiaoStatusList: [
        { id: "PACK", name: "卖家发货,待揽件" },
        { id: "ACCEPT", name: "已揽件" },
        { id: "DELIVERING", name: "派件中" },
        { id: "SIGN", name: "已签收" },
        { id: "REJECT", name: "退回" }
      ],
      caiNiaoresultStatusList: [
        { id: true, name: "成功" },
        { id: false, name: "失败" }
      ]
    }
  },
  computed: {
    wanweiDisabled () {
      return this.wanweiFormData.showapi_res_code !== '0'
    },
    cainiaoDisabled () {
      return !this.cainiaoPullData.success
    }
  },
  methods: {
    // 下单请求
    mockReq (params, type, mockType) {
      this.loading[type] = true
      this.$service.mockExpress({ ...params, mockType}).then(() => {
        this.$message.success('mock物流信息成功')
        this.showDialog[type] = false
      }).finally(() => {
        this.loading[type] = false
      })
    },
    // 丰桥下单
    fengqiaoMockClick () {
      this.fengqiaoSuccessData = vkbeautify.xml(this.fengqiaoSuccessData)
      this.fengqiaoErrorSystemData = vkbeautify.xml(this.fengqiaoErrorSystemData)
      this.fengqiaoRepeatErrorData = vkbeautify.xml(this.fengqiaoRepeatErrorData)
      this.fengqiaoOrderList = []
      this.showDialog.fengqiao = true
    },
    fengqiaoOrderListReq (kw, cb) {
      this.$service.getShowApiOrderList({ keywords: kw }).then(res => {
        this.fengqiaoOrderList = res.data
        cb(res.data)
      })
    },
    changedFengqiao(id) {
      this.fengqiaoFormData.fengqiaoData =
      id == "success"
        ? this.fengqiaoSuccessData
        : id == "errorSystem"
        ? this.fengqiaoErrorSystemData
        : id == "repeatOrderError"
        ? this.fengqiaoRepeatErrorData
        : ""
    },
    fengqiaoSubmit () {
      if (!this.fengqiaoFormData.orderSn || !this.fengqiaoFormData.fengqiaoData) {
        this.$message.warning('请填写完全部信息后提交!')
        return
      }
      this.mockReq(this.fengqiaoFormData, 'fengqiao', 2)
    },
    // mockDialog
    openMockDialog (row) {
      let rowCopy = JSON.parse(JSON.stringify(row))
      if (row.expressPlatform === 1) {
        this.cainiaoPushData = JSON.parse(JSON.stringify(row))
        this.cainiaoPullData = JSON.parse(JSON.stringify(row))
        this.$set(this.cainiaoPullData, 'fullTraceDetail', [])
        this.showDialog.cainiao = true
      } else if (row.expressPlatform === 2) {
        this.$message.info('丰桥平台暂不支持Mock哦!')
      } else if (row.expressPlatform === 3) {
        rowCopy.showapiResBody = { data: [] }
        this.wanweiFormData = rowCopy
        this.showDialog.wanwei = true
      }
    },
    // mockDialog - 菜鸟
    cainiaoSubmit () {
      if (this.cainiaoActive === 'push') {
        if (
          !this.cainiaoPushData.cpCode ||
          !this.cainiaoPushData.logisticsStatus ||
          !this.cainiaoPushData.logisticsGmtModified ||
          !this.cainiaoPushData.lastLogisticDetail
        ) {
          this.$message.warning('请填写必要信息后再提交!')
          return
        }
        this.mockReq(this.cainiaoPushData, 'cainiao', 1)
      } else if (this.cainiaoActive === 'pull') {
        let params = JSON.parse(JSON.stringify(this.cainiaoPullData))
        if (!('success' in params) || params.success === '') {
          this.$message.warning('请选择成功或者失败!')
          return
        }
        if (params.success) {
          if (!params.cpCode || !params.logisticsStatus) {
            this.$message.warning('请填写必要信息后再提交!')
            return
          }
        } else {
          if (!params.errorCode || !params.errorMsg) {
            this.$message.warning('请填写必要信息后再提交!')
            return
          }
          //错误情况不填写其他信息
          params.fullTraceDetail = null
          params.logisticsStatus = null
          params.cpCode = null
        }
        this.mockReq(params, 'wanwei', 0)
      }
    },
    addInfoItem () {
      this.cainiaoPullData.fullTraceDetail.push({})
    },
    delInfoItem (index) {
      this.cainiaoPullData.fullTraceDetail.splice(index, 1)
    },
    // mockDialog - 万维易源
    wanweiSubmit () {
      let params = JSON.parse(JSON.stringify(this.wanweiFormData))
      if (!params.showapi_res_code) {
        this.$message.warning('请先选择mock成功或者失败!')
        return
      }
      if (params.showapi_res_code == 0) {
        if (
          !params.showapiResBody.expTextName ||
          !params.showapiResBody.expSpellName ||
          !params.showapiResBody.updateStr ||
          !params.showapiResBody.status ||
          !params.showapiResBody.tel
        ) {
          this.$message.warning('请填写必要信息后再提交!')
          return
        }
      } else {
        if (!params.showapi_res_error) {
          this.$message.warning('请填写必要信息后再提交!')
          return
        }
        delete params.showapiResBody
      }
      this.mockReq(params, 'wanwei', 3)
    },
    addApiResBodyDataItem () {
      this.wanweiFormData.showapiResBody.data.push({ time: '', context: '' })
    },
    delApiResBodyDataItem (index) {
      this.wanweiFormData.showapiResBody.data.splice(index, 1)
    },
    // 查看
    showExpressDetail (row) {
      this.detailActive = 'normal'
      this.$service.selectExpressDetail({ expressId: row.id }).then(res => {
        let normal = ("null" == res.data.normal || undefined == res.data.normal) ? "{\"msg\":\"暂无Normal数据\"}" : res.data.normal
        let mock = ("null" == res.data.mock || undefined == res.data.mock) ? "{\"msg\":\"暂无Mock数据\"}" : res.data.mock
        this.detailData.normal = JSON.stringify(JSON.parse(normal), null, "\t")
        this.detailData.mock = JSON.stringify(JSON.parse(mock), null, "\t")
        this.showDialog.detail = true
      })
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
      this.$service.listExpressOrder(this.searchData).then(res => {
        this.tableData = res.data.data
        this.total = res.data.total
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>