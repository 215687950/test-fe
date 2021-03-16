<template>
  <div
    :style="{position: 'relative',height: tableHeight + 'px'}"
    v-loading="initLoadding"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="#FFFAFA)"
  >
    <el-row
      :style="{height: tableHeight + 'px',overflowY:'auto',paddingLeft:'0px',overflowX:'hidden',}"
    >
      <!-- <el-divider content-position="left"><font color="#6ba9e8">项目相关</font></el-divider> -->
      <el-row :style="{fontWeight:'bold'}">
        <span>
          <font color="#6ba9e8" size="1">项目相关</font>
        </span>
        <el-divider direction="vertical"></el-divider>
      </el-row>
      <el-row :style="{marginTop:'20px'}">
        <font size="2" class="common_title">选择迭代:</font>
        <el-select
          v-model="iterateObj"
          remote
          filterable
          value-key="name"
          @change="iterateChanged"
          :remote-method="loadIterate"
          :loading="loaddingSelect"
          size="small"
          class="select_detail"
        >
          <el-option v-for="item in iterateList" :key="item.id" :label="item.name" :value="item"></el-option>
        </el-select>
        <font size="2" class="common_title">迭代URL:</font>
        <el-input
          type="text"
          placeholder="迭代URL"
          v-model="baseObj.projUrl"
          class="input_keyword"
          size="small"
          :style="{width:'316px'}"
          clearable
        />
        <font size="2" class="common_title">蓝湖URL:</font>
        <el-input
          type="text"
          placeholder="蓝湖URL"
          v-model="baseObj.uiUrl"
          class="input_keyword"
          size="small"
          :style="{width:'310px'}"
          clearable
        />
      </el-row>
      <el-row :style="{marginTop:'20px'}">
        <el-collapse v-model="prdCollName" @change="prdCollChange">
          <el-collapse-item title="PRD配置" name="1">
            <el-row>
              <el-button type="info" size="small" @click="addPrdView" plain>新增PRD</el-button>
            </el-row>
            <div :style="{overflowY:'auto',paddingLeft:'0px',overflowX:'hidden', height:'400px'}">
              <div class="infinite-list" v-for="(item,index) in prdViewList" :key="index">
                <!-- <div
                  :style="{background:'#F5F5F5', padding: '10px', marginTop:'10px', marginRight:'20px', borderRadius: '1%'}"
                >-->
                <el-card
                  class="box-card"
                  :body-style="{ padding: '20px' }"
                  shadow="hover"
                  :style="{marginTop:'10px',marginBottom:'10px', width:tableWidth-190+'px'}"
                >
                  <el-row>
                    <font size="2" class="common_title">prd名称:</font>
                    <el-input
                      type="text"
                      placeholder="请输入PRD名称"
                      v-model="item.name"
                      class="input_keyword"
                      :style="{width:'250px'}"
                      size="small"
                      clearable
                    />

                    <font size="2" class="common_title">prdURL:</font>
                    <el-input
                      type="text"
                      placeholder="请输入PRD URL"
                      v-model="item.url"
                      class="input_keyword"
                      :style="{width:'350px'}"
                      size="small"
                      clearable
                    />
                    <el-button
                      type="danger"
                      size="small"
                      @click="delPrdView(index,item)"
                      :style="{marginLeft:'20px'}"
                      plain
                    >删除</el-button>
                  </el-row>
                  <!-- </div> -->
                </el-card>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>
      <!-- <el-divider content-position="left"><font color="#6ba9e8">数据相关</font></el-divider> -->
      <!-- <el-divider content-position="left"><font color="#6ba9e8">埋点相关</font></el-divider> -->
      <el-row :style="{fontWeight:'bold', marginTop:'20px'}">
        <span>
          <font color="#6ba9e8" size="1">数据相关</font>
        </span>
        <el-divider direction="vertical"></el-divider>
      </el-row>
      <el-row :style="{marginTop:'20px'}">
        <font size="2" class="common_title">数据需求URL:</font>
        <el-input
          type="text"
          placeholder="迭代URL"
          v-model="baseObj.dataUrl"
          class="input_keyword"
          size="small"
          :style="{width:'316px'}"
          clearable
        />
        <font size="2" class="common_title" :style="{marginLeft:'30px'}">是否涉及数仓:</font>
        <el-switch
          v-model="isDatabase"
          active-color="#13ce66"
          inactive-color="#ff4949"
          class="common_title"
        ></el-switch>

        <font size="2" class="common_title" :style="{marginLeft:'30px'}">是否涉及报表:</font>
        <el-switch
          v-model="isReport"
          active-color="#13ce66"
          inactive-color="#ff4949"
          class="common_title"
        ></el-switch>

        <font size="2" class="common_title" :style="{marginLeft:'30px'}">需求方名称:</font>
        <el-input
          type="text"
          placeholder="需求方名称"
          v-model="baseObj.businessName"
          class="input_keyword"
          size="small"
          :style="{width:'206px'}"
          clearable
        />
      </el-row>
      <el-row :style="{marginTop:'20px'}">
        <font size="2" class="common_title" :style="{marginTop:'10px'}">原始数据需求:</font>
        <el-input
          type="textarea"
          placeholder="原始数据需求"
          v-model="baseObj.originInfo"
          class="input_keyword"
          size="small"
          :style="{width:'950px'}"
          clearable
        />
      </el-row>

      <el-row :style="{fontWeight:'bold', marginTop:'20px'}">
        <span>
          <font color="#6ba9e8" size="1">埋点相关</font>
        </span>
        <el-divider direction="vertical"></el-divider>
      </el-row>
      <el-row :style="{marginTop:'20px'}">
        <font size="2" class="common_title" :style="{marginTop:'10px'}">测试问题记录:</font>
        <el-input
          type="textarea"
          placeholder="测试问题记录"
          v-model="baseObj.questionTest"
          class="input_keyword"
          size="small"
          :style="{width:'922px', marginLeft:'37px'}"
          clearable
        />
      </el-row>
      <el-row :style="{marginTop:'20px'}">
        <font size="2" class="common_title" :style="{marginTop:'10px'}">取数问题记录:</font>
        <el-input
          type="textarea"
          placeholder="取数问题记录"
          v-model="baseObj.questionNum"
          class="input_keyword"
          size="small"
          :style="{width:'922px', marginLeft:'37px'}"
          clearable
        />
      </el-row>
      <el-row :style="{marginTop:'20px'}">
        <font size="2" class="common_title" :style="{marginTop:'10px'}">待解决问题记录:</font>
        <el-input
          type="textarea"
          placeholder="待解决问题记录"
          v-model="baseObj.questionAbility"
          class="input_keyword"
          size="small"
          :style="{width:'924px', marginLeft:'24px'}"
          clearable
        />
      </el-row>
      <el-row :style="{marginTop:'20px'}">
        <font size="2" class="common_title" :style="{marginTop:'10px'}">原始线上问题记录:</font>
        <el-input
          type="textarea"
          placeholder="原始线上问题记录"
          v-model="baseObj.questionRelease"
          class="input_keyword"
          size="small"
          :style="{width:'923px'}"
          clearable
        />
      </el-row>
      <el-row :style="{marginTop:'20px'}">
        <el-collapse v-model="dataPointCollName" @change="dataPointCollChanged">
          <el-collapse-item title="埋点配置" name="1">
            <el-row>
              <el-button type="info" size="small" @click="addDataPointView" plain>新增埋点配置</el-button>
            </el-row>
            <div :style="{overflowY:'auto',paddingLeft:'0px',overflowX:'hidden', height:'550px'}">
              <div
                class="infinite-list"
                v-for="(cardItem,cardIndex) in dataPointViewList"
                :key="cardIndex"
              >
                <el-card
                  shadow="hover"
                  class="box-card"
                  :body-style="{ padding: '20px' }"
                  :style="{marginTop:'10px',marginBottom:'10px', width:tableWidth-190+'px'}"
                >
                  <el-row>
                    <font size="2" class="common_title">埋点类型:</font>
                    <el-select
                      v-model="cardItem.type"
                      size="small"
                      class="select_detail"
                      :style="{width:'250px'}"
                      @change="changedClientArray(cardItem)"
                      clearable
                    >
                      <el-option
                        v-for="item in dataPointTypeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>

                    <font size="2" class="common_title">埋点端:</font>
                    <el-select
                      v-model="cardItem.clientList"
                      size="small"
                      class="select_detail"
                      value-key="name"
                      :style="{width:'250px'}"
                      @change="changePoint(cardItem, cardIndex)"
                      multiple
                    >
                      <el-option
                        v-for="clientItem in cardItem.clientDataBeanList.filter((item,index)=>{if(item.selected === 0) return item})"
                        :key="clientItem.id"
                        :label="clientItem.name"
                        :value="clientItem.name"
                      ></el-option>
                    </el-select>

                    <font size="2" class="common_title">开发时间:</font>
                    <el-date-picker
                      v-model="cardItem.devTime"
                      class="input_keyword"
                      type="date"
                      size="small"
                      :style="{width:'280px'}"
                      placeholder="选择开发时间"
                    ></el-date-picker>
                  </el-row>
                  <el-row :style="{marginTop:'20px'}">
                    <font size="2" class="common_title">验收时间:</font>
                    <el-date-picker
                      v-model="cardItem.checkTime"
                      class="input_keyword"
                      type="date"
                      size="small"
                      :style="{width:'300px'}"
                      placeholder="选择验收时间"
                    ></el-date-picker>
                    <font size="2" class="common_title">上线时间:</font>
                    <el-date-picker
                      v-model="cardItem.releaseTime"
                      class="input_keyword"
                      type="date"
                      size="small"
                      :style="{width:'300px'}"
                      placeholder="选择上线时间"
                    ></el-date-picker>
                    <el-button
                      type="danger"
                      size="small"
                      @click="delDataPointView(cardIndex,cardItem)"
                      :style="{marginLeft:'20px'}"
                      plain
                    >删除</el-button>
                  </el-row>
                </el-card>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>

      <el-row :style="{marginTop:'20px', height:tableHeight/2}">
        <el-collapse v-model="dataPointRecordName" @change="dataPointRecordChanged">
          <el-collapse-item title="埋点记录" name="1">
            <el-row>
              <el-button type="info" size="small" @click="addDataPointRecordView" plain>新增埋点记录</el-button>
            </el-row>
            <div :style="{overflowY:'auto',paddingLeft:'0px',overflowX:'hidden', height:'600px'}">
              <div
                class="infinite-list"
                v-for="(item,index) in dataPointRecordViewList"
                :key="index"
              >
                <el-card
                  class="box-card"
                  shadow="hover"
                  :style="{marginTop:'10px',marginBottom:'10px', width:tableWidth-190+'px'}"
                >
                  <div>
                    <div :style="{float:'left',width:tableWidth/3*2-80+'px'}">
                      <el-row :style="{marginTop:'10px'}">
                        <font size="2" class="common_title">选择埋点:</font>
                        <el-select
                          v-model="item.dpObj"
                          remote
                          filterable
                          value-key="name"
                          @visible-change="$forceUpdate()"
                          @change="dpChanged(item)"
                          :remote-method="(keyword)=>selectDataPointReq(keyword,item,index)"
                          :loading="loaddingSelect"
                          size="small"
                          :style="{width:'300px'}"
                          class="select_detail"
                        >
                          <el-option
                            v-for="item in item.dpList"
                            :key="item.id"
                            :label="item.name"
                            :value="item"
                          ></el-option>
                        </el-select>

                        <font size="2" class="common_title">数据需求:</font>
                        <el-input
                          type="text"
                          placeholder="数据需求"
                          v-model="item.name"
                          class="input_keyword"
                          size="small"
                          :style="{width:'250px'}"
                          clearable
                        />
                      </el-row>
                      <el-row :style="{marginTop:'20px'}">
                        <font size="2" class="common_title">埋点URL:</font>
                        <el-input
                          type="text"
                          placeholder="埋点URL"
                          v-model="item.dpUrl"
                          class="input_keyword"
                          size="small"
                          :style="{width:'480px'}"
                          clearable
                        />
                        <font size="2" class="common_title">是否涉及报表:</font>
                        <el-switch
                          v-model="item.isReport"
                          active-color="#13ce66"
                          inactive-color="#ff4949"
                          class="common_title"
                        ></el-switch>
                      </el-row>
                      <el-row :style="{marginTop:'20px'}">
                        <font size="2" class="common_title">图片URL:</font>
                        <el-input
                          type="text"
                          placeholder="埋点位置图片URL"
                          v-model="item.dpImages"
                          class="input_keyword"
                          size="small"
                          :style="{width:'360px'}"
                          clearable
                        />
                        <font size="2" class="common_title">备注:</font>
                        <el-input
                          type="text"
                          placeholder="备注"
                          v-model="item.remark"
                          class="input_keyword"
                          size="small"
                          :style="{width:'220px'}"
                          clearable
                        />
                      </el-row>
                      <!-- <el-row :style="{marginTop:'20px'}">
                        <font size="2" class="common_title">定义规则:</font>
                        <el-input
                          type="text"
                          placeholder="请选择规则(如没有可不填)"
                          v-model="item.rule"
                          class="input_keyword"
                          size="small"
                          :style="{width:'200px'}"
                          clearable
                        />
                        <font size="2" class="common_title">key&value:</font>
                        <el-input
                          type="text"
                          placeholder="格式:key=value"
                          v-model="item.ruleValue"
                          class="input_keyword"
                          size="small"
                          :style="{width:'344px'}"
                          clearable
                        />
                      </el-row>-->
                      <el-row :style="{marginTop:'20px', marginBottom:'20px'}">
                        <font size="2" class="common_title">埋点样式:</font>
                        <el-input
                          type="textarea"
                          placeholder="埋点样式"
                          v-model="item.dpDescStr"
                          class="input_keyword"
                          size="small"
                          :style="{width:'480px'}"
                          clearable
                        />
                        <!-- <el-button
                          type="info"
                          size="small"
                          @click="showAddRoleDialog(item)"
                          :style="{marginLeft:'10px', marginTop:'10px'}"
                          plain
                        >新增规则</el-button> -->
                        <el-button
                          type="danger"
                          size="small"
                          @click="delDataPointRecordView(index,item)"
                          :style="{marginLeft:'10px', marginTop:'10px'}"
                          plain
                        >删除</el-button>
                      </el-row>
                    </div>
                    <div
                      :style="{float:'left', height:'230px', width:tableWidth/3-180+'px',marginBottom:'10px'}"
                    >
                      <el-image
                        :style="{height: '230px',width:tableWidth/3-180+'px'}"
                        :src="item.dpImages"
                        :preview-src-list="item.srcList"
                      ></el-image>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-row>

      <el-row :style="{marginTop:'20px'}">
        <el-col :span="2" :offset="6">
          <el-button
            type="primary"
            size="small"
            @click="submitInfo()"
            :style="{width:'400px'}"
            plain
          >提交</el-button>
        </el-col>
      </el-row>
    </el-row>

    <div>
      <el-dialog
        :visible.sync="showAddRow"
        width="70%"
        title="新增规则"
        top="40px"
        :style="{overflowY:'hidden',overflowX:'hidden'}"
      >
        <el-row>
          <font color="#FF0000" size="2">新增规则默认是在requestData对象中,新增后会在上报系统中提现,请知悉!!!</font>
        </el-row>
        <el-row :style="{marginTop:'10px'}">
          <el-button type="info" size="small" @click="addDpRule" plain>新增规则</el-button>
        </el-row>
        <el-row :style="{marginTop:'10px'}">
          <div :style="{overflowY:'auto',paddingLeft:'0px',overflowX:'hidden', height:'370px'}">
            <div class="infinite-list" v-for="(item,index) in ruleList" :key="index">
              <el-card class="box-card" shadow="hover" :style="{marginBottom:'10px'}">
                <div>
                  <el-row>
                    <font size="2" class="common_title">规则字段:</font>
                    <el-input
                      type="text"
                      placeholder="规则字段"
                      v-model="item.ruleFiled"
                      class="input_keyword"
                      size="small"
                      :style="{width:'160px'}"
                      clearable
                    />
                    <font size="2" class="common_title">校验值:</font>
                    <el-input
                      type="text"
                      placeholder="校验值"
                      v-model="item.ruleFiledValue"
                      class="input_keyword"
                      size="small"
                      :style="{width:'170px'}"
                      clearable
                    />
                    <font size="2" class="common_title">key&value:</font>
                    <el-input
                      type="text"
                      placeholder="格式:key=value"
                      v-model="item.ruleKeyValue"
                      class="input_keyword"
                      size="small"
                      :style="{width:'170px'}"
                      clearable
                    />
                    <el-button
                      type="danger"
                      size="small"
                      @click="delDpRule(index,item)"
                      :style="{marginLeft:'10px'}"
                      plain
                    >删除</el-button>
                  </el-row>
                </div>
              </el-card>
            </div>
          </div>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" size="small" @click="saveRule()" plain>保存</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleList: [],
      ruleBaseItem: {},
      showAddRow: false,
      paramDataId: "",
      iterateObj: {},
      dataPointRecordName: "2",
      dataPointCollName: "2",
      isDatabase: false,
      isReport: false,
      prdCollName: "2",
      dataClientDataList: [],
      dataPointTypeList: [
        { id: 0, name: "业务埋点端" },
        { id: 1, name: "开发埋点端" }
      ],
      dataPointClientList: [
        { id: 0, name: "h5", selected: 0 },
        { id: 1, name: "小程序", selected: 0 },
        { id: 2, name: "Android", selected: 0 },
        { id: 3, name: "iOS", selected: 0 },
        { id: 4, name: "后端", selected: 0 }
      ],
      businessClientList: [
        { id: 0, name: "pc", selected: 0 },
        { id: 1, name: "wap", selected: 0 },
        { id: 2, name: "wechatApp", selected: 0 },
        { id: 3, name: "wechat", selected: 0 },
        { id: 4, name: "android", selected: 0 },
        { id: 5, name: "ios", selected: 0 },
        { id: 6, name: "douyin", selected: 0 },
        { id: 7, name: "toutiao", selected: 0 },
        { id: 8, name: "news_article_lite", selected: 0 },
        { id: 9, name: "wjbApp_android", selected: 0 },
        { id: 10, name: "wjbApp_ios", selected: 0 },
        { id: 11, name: "yingtanWechatApp", selected: 0 },
        { id: 11, name: "weipaiUnionWechatApp", selected: 0 },
        { id: 11, name: "weipaikeWechatApp", selected: 0 }
      ],
      dataPointRecordViewList: [],
      dataPointViewList: [
        {
          checkTime: "",
          client: "",
          dataClientDataList: [],
          clientList: [],
          clientDataBeanList: [],
          createTime: "",
          devTime: "",
          id: "",
          isDel: 0,
          projDataId: "",
          releaseTime: "",
          type: "",
          updateTime: ""
        }
      ],
      prdViewList: [],
      iterateList: [],
      loaddingSelect: false,
      initLoadding: false,
      baseObj: {},
      tableHeight: "",
      tableWidth: "",
      curKeyword: "",
      lastKeyWord: "",
      allClientMap: {}
    };
  },
  created() {
    this.hh();
    this.initData();
  },
  mounted() {
    let _this = this;
    window.onresize = function temp() {
      _this.hh();
    };
  },
  methods: {
    saveRule() {
      if (this.ruleList.length == 0) {
        this.$message.success("未设置自定义规则");
        this.showAddRow = false;
        return;
      }
      let temp = 0;
      this.ruleList.forEach(item => {
        if (
          null == item.ruleFiled ||
          null == item.ruleFiledValue ||
          null == item.ruleKeyValue
        ) {
          temp = -1;
        }
      });
      if (-1 == temp) {
        this.$message.error("请填充必要字段");
        return;
      }
      this.ruleBaseItem.ruleList = this.ruleList;
      this.showAddRow = false;
      this.$message.success("新增规则成功");
    },
    delDpRule(index) {
      this.ruleList.splice(index, 1);
    },
    addDpRule() {
      this.ruleList.push({});
    },
    showAddRoleDialog(item) {
      this.ruleBaseItem = item;
      console.log(this.ruleBaseItem);
      this.ruleList =
        undefined == this.ruleBaseItem.ruleList ||
        "" == this.ruleBaseItem.ruleList
          ? []
          : this.ruleBaseItem.ruleList;
      this.showAddRow = true;
    },
    dpChanged(item) {
      item.dpImages = item.dpObj.imageUrl;
      item.dpUrl = "http://md.dc.wpt.la/?id=" + item.dpObj.dpId;
      item.name = item.dpObj.name;
      item.dpId = item.dpObj.dpId;
      item.pageName = item.dpObj.pageName;
      item.dataPointType = item.dpObj.dataPointType;
      item.srcList = [];
      item.srcList.push(item.dpObj.imageUrl);
    },
    async selectDataPointReq(keyword, item, index) {
      let result = await this.$service.selectDataPoint({ keywords: keyword });
      const { dataPointRecordViewList } = this;
      const target = dataPointRecordViewList.filter(
        (d, curIndex) => curIndex === index
      )[0];
      if (target) {
        target.dpList = result.data;
        this.dataPointRecordViewList = [...dataPointRecordViewList];
      }
    },
    iterateChanged() {
      this.baseObj.projUrl =
        "http://zentao.weipaitang.com/zentao/project-task-" +
        this.iterateObj.id +
        "-unclosed.html";
      this.baseObj.projPo = this.iterateObj.po;
      this.baseObj.projPm = this.iterateObj.pm;
    },
    initBaseObj() {
      this.baseObj = {};
      this.iterateObj = {};
      this.isReport = false;
      this.isDatabase = false;
      this.prdViewList = [];
      this.dataPointViewList = [];
      this.dataPointRecordViewList = [];
    },
    addConfReq() {
      this.$service.addIterationPointConf(this.baseObj).then(() => {
        this.initBaseObj();
        this.$message.success("新增配置成功");
      })
    },
    submitInfo() {
      for (let i = 0; i < this.dataPointViewList.length; i++) {
        if (this.dataPointViewList[i].type === '') {
          this.$message.error('埋点类型不能为空')
          return
        }
        if (this.dataPointViewList[i].clientList.length === 0) {
          this.$message.error('埋点端不能为空')
          return
        }
      }
      if (this.dataPointRecordViewList.length === 0) {
        this.$message.error('埋点记录不能为空')
        return
      }
      for (let i = 0; i < this.dataPointRecordViewList.length; i++) {
        if (!('dpObj' in this.dataPointRecordViewList[i]) || !this.dataPointRecordViewList[i].dpObj) {
          this.$message.error('埋点不能为空')
          return
        }
      }
      this.baseObj.createUserAccount = this.$store.state.userInfo.account;
      this.baseObj.projId = this.iterateObj.id;
      this.baseObj.projUrl =
        "http://zentao.weipaitang.com/zentao/project-task-" +
        this.iterateObj.id +
        "-unclosed.html";
      this.baseObj.projName = this.iterateObj.name;
      this.baseObj.isReport = this.isReport;
      this.baseObj.isDataBase = this.isDatabase;
      this.baseObj.prdList = this.prdViewList;
      this.baseObj.dataTypeList = this.dataPointViewList;
      this.baseObj.recordList = this.dataPointRecordViewList;
      console.log(this.dataPointViewList);
      if (undefined == this.paramDataId || "" == this.paramDataId) {
        //新增
        this.addConfReq();
      } else {
        //修改
        this.editConfReq();
      }
    },
    editConfReq() {
      this.$service.editIterationPointConf(this.baseObj).then(() => {
        this.selectInfoByIdReq(this.paramDataId);
        this.$message.success("修改信息成功");
      })
    },

    changePoint(cardItem, cardIndex) {
      this.allClientMap[cardIndex] = cardItem.clientList;
      let names = [];
      for (var key in this.allClientMap) {
        this.allClientMap[key].forEach(nameItem => names.push(nameItem));
      }
      console.log(cardItem.clientDataBeanList);
      console.log(names);
      cardItem.clientDataBeanList.forEach(dataItem => {
        if (names.indexOf(dataItem.name) > -1) {
          //包含该id
          dataItem.selected = 1;
        } else {
          dataItem.selected = 0;
        }
      });
    },

    //开发埋点端  业务埋点端切换
    changedClientArray(cardItem) {
      // 切换时，需清空
      cardItem.clientList = [];
      // 切换开发埋点端与业务埋点端的数据源
      cardItem.clientDataBeanList =
        0 === cardItem.type
          ? this.businessClientList
          : this.dataPointClientList;
    },

    dataPointCollChanged() {
      if (this.dataPointViewList.length == 0) {
        this.dataPointViewList.push({
          client: "",
          dataClientDataList: [],
          type: "",
          dev_time: "",
          check_time: "",
          release_time: ""
        });
      }
    },

    addDataPointView() {
      let allSeled = true;
      this.dataPointClientList.forEach(item => {
        if (item.selected === 0) {
          allSeled = false;
        }
      });
      if (allSeled) {
        this.businessClientList.forEach(item => {
          if (item.selected === 0) {
            allSeled = false;
          }
        });
      }
      if (allSeled) {
        alert("全都被选完啦!");
      } else {
        this.dataPointViewList.push({
          client: "",
          clientList: [],
          clientDataBeanList: [],
          type: [],
          dev_time: "",
          check_time: "",
          release_time: ""
        });
      }
    },

    dataPointRecordChanged() {
      if (this.dataPointRecordViewList.length == 0) {
        this.dataPointRecordViewList.push({
          name: "",
          dpUrl: "",
          dpDesc: "",
          dpImages: "",
          isReport: false,
          remark: ""
        });
      }
    },

    async selectRecordByDpIdReq(item) {
      let result = await this.$service.selectRecordByDpId({ id: item.projDataId });
      this.dataPointRecordViewList = result.data;
      this.dataPointRecordViewList.forEach(item => {
        item.dpObj = {
          dpId: item.dpId,
          imageUrl: item.dpImages,
          name: item.name,
          pageName: item.pageName,
          dataPointType: item.dataPointType
        };
        item.srcList = [];
        item.srcList.push(item.dpImages);
        item.dpList = [];
        item.dpList.push(item.dpObj);
      });
    },

    delDataPointRecordView(index, item) {
      if (this.dataPointRecordViewList.length == 1) {
        this.$message.info("请保留至少一条信息.");
        return;
      }
      if (
        undefined == item.id ||
        "" == item.id ||
        undefined == this.paramDataId ||
        "" == this.paramDataId
      ) {
        this.dataPointRecordViewList.splice(index, 1);
        return;
      }
      this.$service.delRecordById({ id: item.id }).then(() => {
        this.$message.success("埋点记录删除成功");
        this.selectRecordByDpIdReq(item);
      })
    },

    addDataPointRecordView() {
      this.dataPointRecordViewList.push({
        name: "",
        dpUrl: "",
        dpDesc: "",
        dpImages: "",
        isReport: false,
        remark: ""
      });
    },

    prdCollChange() {
      if (this.prdViewList.length == 0) {
        this.prdViewList.push({ name: "", url: "" });
      }
    },

    async selectDataTypeByDpIdReq(item) {
      let result = await this.$service.selectDataTypeByDpId({ id: item.projDataId });
      this.dataPointViewList = result.data;
    },
    delDataPointView(index, item) {
      console.log("index:" + index);
      if (this.dataPointViewList.length == 1) {
        this.$message.info("请保留至少一条信息.");
        return;
      }
      if (
        undefined == item.id ||
        "" == item.id ||
        undefined == this.paramDataId ||
        "" == this.paramDataId
      ) {
        this.dataPointViewList.splice(index, 1);
        return;
      }
      this.$service.delDataTypeById({ id: item.id }).then(() => {
        this.$message.success("埋点配置删除成功");
        this.selectDataTypeByDpIdReq(item);
      })
    },
    async selectPrdByDpIdReq(item) {
      let result = await this.$service.selectPrdByDpId({ id: item.projDataId });
      this.prdViewList = result.data;
    },

    delPrdView(index, item) {
      if (this.prdViewList.length == 1) {
        this.$message.info("请保留至少一条信息.");
        return;
      }
      //如果不是编辑,直接本地删除
      if (
        undefined == item.id ||
        "" == item.id ||
        undefined == this.paramDataId ||
        "" == this.paramDataId
      ) {
        this.prdViewList.splice(index, 1);
        return;
      }
      this.$service.delPrdById({ id: item.id }).then(() => {
        this.$message.success("PRD删除成功");
        this.selectPrdByDpIdReq(item);
      })
    },

    addPrdView() {
      this.prdViewList.push({ name: "", url: "" });
    },

    async fuzzyProject(keyword) {
      let result = await this.$service.getConfIterationList({ keywords: String(keyword) });
      this.iterateList = result.data;
    },

    loadIterate(keywords) {
      this.fuzzyProject(keywords);
    },

    async selectInfoByIdReq(projId) {
      this.initLoadding = true;
      let result = await this.$service.selectInfoById({ id: projId });
      this.baseObj = result.data;
      this.isReport = this.baseObj.isReport;
      this.isDatabase = this.baseObj.isDataBase;
      this.dataPointViewList = this.baseObj.dataTypeList;
      let tempMap = [];
      this.dataPointViewList.forEach(item => {
        tempMap.push(item.clientList);
        if (item.type === 0) {
          this.businessClientList.forEach(businessClient => {
            let boole = item.clientDataBeanList.find(clientDataBean => clientDataBean.id === businessClient.id)
            if (!boole) {
              item.clientDataBeanList.push(businessClient)
            }
          })
        } else if (item.type === 1) {
          this.dataPointClientList.forEach(dataPointClient => {
            let boole = item.clientDataBeanList.find(clientDataBean => clientDataBean.id === dataPointClient.id)
            if (!boole) {
              item.clientDataBeanList.push(dataPointClient)
            }
          })
        }
      });
      this.allClientMap = tempMap;
      this.dataPointRecordViewList = this.baseObj.recordList;
      this.prdViewList = this.baseObj.prdList;
      this.iterateObj = {
        name: this.baseObj.projName,
        id: this.baseObj.projId,
        po: this.baseObj.projPo,
        pm: this.baseObj.projPm
      };
      this.iterateList.push(this.iterateObj);
      this.initLoadding = false;
      this.dataPointRecordViewList.forEach(item => {
        item.dpObj = {
          dpId: item.dpId,
          imageUrl: item.dpImages,
          name: item.name,
          pageName: item.pageName,
          dataPointType: item.dataPointType,
          ruleList: (""==item.ruleList||undefined==item.ruleList)?[]:item.ruleList
        };
        item.srcList = [];
        item.srcList.push(item.dpImages);
        item.dpList = [];
        item.dpList.push(item.dpObj);
        item.ruleList=(""==item.ruleList||undefined==item.ruleList)?[]:item.ruleList;
      });
    },
    initData() {
      this.paramDataId = this.$route.params.projDataId;
      //todo delete
      if (undefined == this.paramDataId) {
        return;
      }
      this.selectInfoByIdReq(this.paramDataId);
    },
    hh() {
      this.tableHeight = window.innerHeight - 75;
      this.tableWidth = window.innerWidth - 40;
    }
  }
};
</script>
<style scoped>
#custom::-webkit-scrollbar {
  display: none;
}
.bottom_page {
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.common_title {
  height: 32px;
  line-height: 32px;
  float: left;
  margin-left: 10px;
}
.select_detail {
  width: 200px;
  float: left;
  margin-left: 10px;
}
.input_keyword {
  width: 200px;
  float: left;
  margin-left: 10px;
}
.drawer_style {
  margin: 0;
  padding: 0;
}
</style>>
