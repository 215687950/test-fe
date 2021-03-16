/** 暂时废弃 */
<style lang="scss">
.page-reportSetting {
  overflow-y: auto;
  .setting-item-box {
    .title {
      color: #6ba9e8;
      font-size: 18px;
      position: relative;
      &::after {
        content: '';
        display: inline-block;
        height: 18px;
        width: 2px;
        position: absolute;
        top: 4px;
        right: -10px;
        background: #6ba9e8;
      }
    }
    .item {
      padding: 10px;
      .width480 .el-input {
        width: 480px;
      }
      .width400 .el-input {
        width: 400px;
      }
      .el-form-item {
        margin-bottom: 10px;
        margin-right: 0;
      }
      .el-icon-remove,
      .el-icon-circle-plus {
        font-size: 22px;
        cursor: pointer;
        vertical-align: sub;
      }
      .el-icon-remove {
        color: #F56C6C;
        margin-right: 5px;
      }
      .el-icon-circle-plus {
        color: #67C23A;
      }
      .point-config-card {
        width: 997px;
        .el-card__body {
          padding-left: 0;
        }
      }
    }
  }
}
</style>
<template>
  <div class="page page-reportSetting">
    <el-form label-width="96px" inline>
      <div class="setting-item-box">
        <span class="title">项目相关</span>
        <div class="item">
          <el-form-item label="选择迭代">
            <el-select
              class="width400"
              v-model="selectedIterate"
              remote
              filterable
              :remote-method="getIterationList"
              :loading="iterationLoading"
              size="small"
              placeholder="请输入迭代关键词"
              @change="iterateChanged">
              <el-option
                v-for="item in iterationList"
                :key="item.id"
                :label="item.name"
                :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="迭代URL">
            <el-input v-model="configData.projUrl" clearable placeholder="迭代URL" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="蓝湖URL">
            <el-input v-model="configData.uiUrl" clearable placeholder="蓝湖URL" style="width:400px"></el-input>
          </el-form-item>
          <el-collapse v-model="prdActiveName" style="width:990px">
            <el-collapse-item title="PRD配置" name="1">
              <div style="max-height: 270px;overflow-y: auto;">
                <el-row
                  v-for="(prd, index) in configData.prdList"
                  :key="index">
                  <el-form-item label="prd名称">
                    <el-input v-model="prd.name" clearable placeholder="请输入prd名称" style="width:300px"></el-input>
                  </el-form-item>
                  <el-form-item label="prdURL">
                    <el-input v-model="prd.url" clearable placeholder="请输入prdURL" style="width:300px"></el-input>
                  </el-form-item>
                  <el-form-item style="margin-left: 20px;">
                    <i v-if="configData.prdList.length > 1" class="el-icon-remove" @click="delPrdItem(prd, index)"></i>
                    <i v-if="configData.prdList.length - 1 === index" class="el-icon-circle-plus" @click="addPrdItem"></i>
                  </el-form-item>
                </el-row>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="setting-item-box">
        <span class="title">数据相关</span>
        <div class="item">
          <el-form-item label="数据需求URL">
            <el-input v-model="configData.dataUrl" clearable placeholder="请输入数据需求URL" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="是否涉及数仓" style="margin: 0 30px">
            <el-switch
              v-model="configData.isDatabase"
              active-color="#13ce66"
              inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item label="是否涉及报表">
            <el-switch
              v-model="configData.isReport"
              active-color="#13ce66"
              inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item label="需求方">
            <el-input v-model="configData.businessName" clearable placeholder="请输入需求方" style="width:170px"></el-input>
          </el-form-item>
          <el-form-item label="原始数据需求">
            <el-input type="textarea" v-model="configData.originInfo" clearable placeholder="请输入原始数据需求" style="width:900px"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="setting-item-box">
        <span class="title">埋点相关</span>
        <div class="item">
          <el-form-item label="测试问题">
            <el-input type="textarea" v-model="configData.questionTest" clearable placeholder="请输入测试问题记录" style="width:900px"></el-input>
          </el-form-item>
          <el-form-item label="取数问题">
            <el-input type="textarea" v-model="configData.questionNum" clearable placeholder="请输入取数问题记录" style="width:900px"></el-input>
          </el-form-item>
          <el-form-item label="待解决问题">
            <el-input type="textarea" v-model="configData.questionAbility" clearable placeholder="请输入待解决问题记录" style="width:900px"></el-input>
          </el-form-item>
          <el-form-item label="原始线上问题">
            <el-input type="textarea" v-model="configData.questionRelease" clearable placeholder="请输入原始线上问题记录" style="width:900px"></el-input>
          </el-form-item>
        </div>
      </div>
      <div class="setting-item-box">
        <span class="title">埋点配置</span>
        <div class="item">
          <el-card
            class="point-config-card"
            v-for="(item, index) in configData.dataTypeList"
            :key="index"
            shadow="never"
            style="position: relative;margin-bottom:10px">
            <span style="position: absolute; top: 10px; right: 20px;z-index: 2;">
              <i v-if="configData.dataTypeList.length > 1" class="el-icon-remove" @click="delPointItem(item, index)"></i>
              <i v-if="configData.dataTypeList.length - 1 === index" class="el-icon-circle-plus" @click="addPointItem"></i>
            </span>
            <el-row>
              <el-form-item label="埋点类型">
                <el-select v-model="item.type" @change="pointTypeChange(item)" clearable>
                  <el-option v-for="type in pointTypeList" :key="type.id" :label="type.name" :value="type.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="埋点端">
                <el-select
                v-model="item.clientList"
                clearable
                multiple
                class="width480"
                @change="pointClientChange(item, $event)">
                  <el-option
                    v-for="client in (item.type === 0 ? businessClientList : item.type === 1 ? dataPointClientList : [])"
                    :key="client.id"
                    :label="client.name"
                    :value="client.name"
                    :disabled="client.disabled"></el-option>
                </el-select>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="开发时间">
                <el-date-picker v-model="item.devTime" type="date" clearable placeholder="选择开发时间" style="width:193px"></el-date-picker>
              </el-form-item>
              <el-form-item label="验收时间">
                <el-date-picker v-model="item.checkTime" type="date" clearable placeholder="选择验收时间" style="width:193px"></el-date-picker>
              </el-form-item>
              <el-form-item label="上线时间">
                <el-date-picker v-model="item.releaseTime" type="date" clearable placeholder="选择上线时间" style="width:193px"></el-date-picker>
              </el-form-item>
            </el-row>
          </el-card>
        </div>
      </div>
      <div class="setting-item-box">
        <span class="title">埋点记录</span>
        <div class="item">
          <el-card
            class="point-config-card"
            v-for="(item, index) in configData.recordList"
            :key="index"
            shadow="never"
            style="position: relative;margin-bottom:10px">
            <span style="position: absolute; top: 10px; right: 20px;z-index: 2;">
              <i v-if="configData.recordList.length > 1" class="el-icon-remove" @click="delRecordItem(item, index)"></i>
              <i v-if="configData.recordList.length - 1 === index" class="el-icon-circle-plus" @click="addRecordItem"></i>
            </span>
            <el-row>
              <el-form-item label="选择埋点">
                <el-select
                  class="width400"
                  v-model="item.selectedPoint"
                  remote
                  filterable
                  :remote-method="query => getPointList(query, index)"
                  :loading="item.pointLoading"
                  size="small"
                  placeholder="请输入迭代关键词"
                  @change="pointChanged(index, $event)">
                  <el-option
                    v-for="point in item.pointList"
                    :key="point.id"
                    :label="point.name"
                    :value="point"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="是否涉及报表" style="margin-left: 25px">
                <el-switch
                  v-model="item.isReport"
                  active-color="#13ce66"
                  inactive-color="#ff4949"></el-switch>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="埋点URL">
                <el-input v-model="item.dpUrl" clearable placeholder="埋点URL" style="width:270px"></el-input>
              </el-form-item>
              <el-form-item label="图片URL">
                <el-input v-model="item.dpImages" clearable placeholder="图片URL" style="width:270px"></el-input>
              </el-form-item>
              <el-image
                style="width: 180px; height: 180px;position: absolute; top: -30px; right: 0;"
                :src="item.dpImages"
                fit="fill"></el-image>
            </el-row>
            <el-row>
              <el-form-item label="数据需求">
                <el-input v-model="item.name" clearable placeholder="数据需求" style="width:270px"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="item.remark" clearable placeholder="备注" style="width:270px"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="埋点样式">
                <el-input type="textarea" v-model="item.dpDescStr" clearable placeholder="埋点样式" style="width:636px"></el-input>
              </el-form-item>
            </el-row>
          </el-card>
        </div>
      </div>
      <div style="width: 1000px;text-align: center">
        <el-button :loading="submitLoading" type="primary" @click="submit" style="width:400px" plain>提 交</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
export default {
  data () {
    return {
      id: this.$route.params.id,
      type: this.$route.params.id === undefined ? 'add' : 'edit',
      submitLoading: false,
      configData: {
        createUserAccount: this.$store.state.userInfo.account,
        // 项目相关
        projId: '',
        projName: '',
        projUrl: '',
        projPo: '',
        projPm: '',
        uiUrl: '',
        prdList: [{ name: '', url: '' }],
        // 数据相关
        dataUrl: '',
        isDatabase: false,
        isReport: false,
        businessName: '',
        // 埋点相关
        questionTest: '',
        questionNum: '',
        questionAbility: '',
        questionRelease: '',
        // 埋点配置
        dataTypeList: [
          { type: '', clientList: [], devTime: '', checkTime: '', releaseTime: '' }
        ],
        recordList: [
          { 
            // dpList: '', // pointList
            // dpDesc: '',
            dpId: '',
            name: '',
            dpUrl: '',
            isReport: false,
            dpImages: '',
            remark: '',
            dpDescStr: '',
            dataPointType: '',
            // 不传
            pointLoading: false,
            pointList: [],
            selectedPoint: {}
          }
        ]
      },
      iterationLoading: false,
      iterationList: [],
      selectedIterate: {},
      prdActiveName: '',
      pointTypeList: [
        { id: 0, name: '业务埋点端' },
        { id: 1, name: '开发埋点端' }
      ],
      businessClientList: [ //业务埋点端
        { id: 0, name: 'pc', disabled: false },
        { id: 1, name: 'wap', disabled: false },
        { id: 2, name: 'wechatApp', disabled: false },
        { id: 3, name: 'wechat', disabled: false },
        { id: 4, name: 'android', disabled: false },
        { id: 5, name: 'ios', disabled: false },
        { id: 6, name: 'douyin', disabled: false },
        { id: 7, name: 'toutiao', disabled: false },
        { id: 8, name: 'news_article_lite', disabled: false },
        { id: 9, name: 'wjbApp_android', disabled: false },
        { id: 10, name: 'wjbApp_ios', disabled: false },
        { id: 11, name: 'yingtanWechatApp', disabled: false }
      ],
      dataPointClientList: [ //开发埋点端
        { id: 0, name: 'h5', disabled: false },
        { id: 1, name: '小程序', disabled: false },
        { id: 2, name: 'Android', disabled: false },
        { id: 3, name: 'iOS', disabled: false },
        { id: 4, name: '后端', disabled: false }
      ]
    }
  },
  created () {
    if (this.type === 'edit') {
      this.editInitData()
    }
  },
  methods: {
    submit () {
      let params = JSON.parse(JSON.stringify(this.configData))
      params.recordList.forEach(item => {
        delete item.pointLoading
        delete item.pointList
        delete item.selectedPoint
      })
      this.submitLoading = true
      if (this.type === 'add') {
        this.$service.addIterationPointConf(params).then(() => {
          this.$message.success('新增配置成功')
          this.reset()
        }).finally(() => {
          this.submitLoading = false
        })
      } else {
        this.$service.editIterationPointConf({ ...params, id: this.id }).then(() => {
          this.$message.success('修改配置成功')
        }).finally(() => {
          this.submitLoading = false
        })
      }
    },
    reset () {
      this.configData = {
        createUserAccount: this.$store.state.userInfo.account,
        // 项目相关
        projId: '',
        projName: '',
        projUrl: '',
        projPo: '',
        projPm: '',
        uiUrl: '',
        prdList: [{ name: '', url: '' }],
        // 数据相关
        dataUrl: '',
        isDatabase: false,
        isReport: false,
        businessName: '',
        // 埋点相关
        questionTest: '',
        questionNum: '',
        questionAbility: '',
        questionRelease: '',
        // 埋点配置
        dataTypeList: [
          { type: '', clientList: [], devTime: '', checkTime: '', releaseTime: '' }
        ],
        recordList: [
          {
            dpId: '',
            name: '',
            dpUrl: '',
            isReport: false,
            dpImages: '',
            remark: '',
            dpDescStr: '',
            // 不传
            pointLoading: false,
            pointList: [],
            selectedPoint: {}
          }
        ]
      }
      this.iterationList = []
      this.selectedIterate = {}
      this.businessClientList.forEach(item => {
        item.disabled = false
      })
      this.dataPointClientList.forEach(item => {
        item.disabled = false
      })
    },
    editInitData () {
      this.$service.selectInfoById({ id: this.id}).then(res => {
        let result = res.data
        Object.keys(this.configData).forEach(key => {
          this.configData[key] = result[key]
          if (!result.prdList.length) {
            this.configData.prdList = [{ name: '', url: '' }]
          }
          if (key === 'dataTypeList') {
            this.configData.dataTypeList.forEach(dataType => {
              dataType.clientList.forEach(name => {
                if (dataType.type === 0) {
                  this.businessClientList.forEach(i => {
                    if (name === i.name) {
                      i.disabled = true
                    }
                  })
                } else if (dataType.type === 1) {
                  this.dataPointClientList.forEach(i => {
                    if (name === i.name) {
                      i.disabled = true
                    }
                  })
                }
              })
            })
          }
          if (key === 'recordList') {
            this.configData.recordList.forEach((record, index) => {
              record.selectedPoint = {
                dpId: result.recordList[index].dpId,
                dataPointType: result.recordList[index].dataPointType,
                name: result.recordList[index].name,
                dpUrl: result.recordList[index].dpUrl,
                dpImages: result.recordList[index].dpImages
              }
              record.pointList = [record.selectedPoint]
            })
          }
        })
        this.selectedIterate = {
          name: result.projName,
          id: result.projId,
          po: result.projPo,
          pm: result.projPm
        }
        this.iterationList = [this.selectedIterate]
      })
    },
    // 埋点记录
    pointChanged (index, value) {
      if (JSON.stringify(value) !== '{}') {
         this.configData.recordList[index].dpId = value.dpId
         this.configData.recordList[index].dataPointType = value.dataPointType
         this.configData.recordList[index].name = value.name
         this.configData.recordList[index].dpUrl = `http://md.dc.wpt.la/?id=${value.dpId}`
         this.configData.recordList[index].dpImages = value.imageUrl
      }
    },
    getPointList (query, index) {
      if (query !== '') {
        this.configData.recordList[index].pointLoading = true
        this.$service.selectDataPoint({ keywords: query }).then((res) => {
          this.configData.recordList[index].pointList = res.data
        }).finally(() => {
          this.configData.recordList[index].pointLoading = false
        })
      } else {
        this.configData.recordList[index].pointList = []
      }
    },
    delRecordItem (item, index) {
      if (this.type === 'add') {
        this.configData.recordList.splice(index, 1)
      } else {
        this.$service.delRecordById({ id: item.id }).then(() => {
          this.$message.success('埋点记录删除成功')
          this.configData.recordList.splice(index, 1)
        })
      }
    },
    addRecordItem () {
      this.configData.recordList.push({
        dpId: '',
        dataPointType: '',
        name: '',
        dpUrl: '',
        isReport: false,
        dpImages: '',
        remark: '',
        dpDescStr: '',
        pointLoading: false,
        pointList: [],
        selectedPoint: {}
      })
    },
    // 埋点配置 - 埋点类型改变
    pointTypeChange (item) {
      if (item.clientList.length) {
        item.clientList.forEach(name => {
          this.businessClientList.forEach(i => {
            if (name === i.name) {
              i.disabled = false
            }
          })
          this.dataPointClientList.forEach(i => {
            if (name === i.name) {
              i.disabled = false
            }
          })
        })
        item.clientList = []
      }
    },
    // 埋点配置 - 埋点端改变
    pointClientChange (item, names) {
      names.forEach(name => {
        if (item.type === 0) {
          this.businessClientList.forEach(i => {
            if (name === i.name) {
              i.disabled = true
            }
          })
        } else if (item.type === 1) {
          this.dataPointClientList.forEach(i => {
            if (name === i.name) {
              i.disabled = true
            }
          })
        }
      })
    },
    delPointItem (item, index) {
      if (this.type === 'add') {
        this.del(item, index)
      } else {
        this.$service.delDataTypeById({ id: item.id }).then(() => {
          this.$message.success('埋点配置删除成功')
          this.del(item, index)
        })
      }
    },
    del (item, index) {
      if (item.clientList.length) {
        item.clientList.forEach(name => {
          this.businessClientList.forEach(i => {
            if (name === i.name) {
              i.disabled = false
            }
          })
          this.dataPointClientList.forEach(i => {
            if (name === i.name) {
              i.disabled = false
            }
          })
        })
      }
      this.configData.dataTypeList.splice(index, 1)
    },
    addPointItem () {
      this.configData.dataTypeList.push({ type: '', clientList: [], devTime: '', checkTime: '', releaseTime: '' })
    },
    // PRD
    delPrdItem (prd, index) {
      if (this.type === 'add') {
        this.configData.prdList.splice(index, 1)
      } else {
        this.$service.delPrdById({ id: prd.id }).then(() => {
          this.$message.success('PRD删除成功')
          this.configData.prdList.splice(index, 1)
        })
      }
    },
    addPrdItem () {
      this.configData.prdList.push({ name: '', url: '' })
    },
    // 迭代
    iterateChanged (data) {
      this.configData.projId = data.id
      this.configData.projName = data.name
      this.configData.projUrl = `http://zentao.weipaitang.com/zentao/project-task-${data.id}-unclosed.html`
      this.configData.projPo = data.po
      this.configData.projPm = data.pm
    },
    getIterationList (query) {
      if (query !== '') {
        this.iterationLoading = true
        this.$service.getConfIterationList({ keywords: query }).then(res => {
          this.iterationList = res.data
        }).finally(() => {
          this.iterationLoading = false
        })
      } else {
        this.iterationList = []
      }
    }
  }
}
</script>