<style lang="scss">
.add-shell-dialog {
  .el-dialog__header {
    text-align: center;
  }
  .el-dialog__body {
    .dialog-body {
      position: relative;
      .history-list {
        position: absolute;
        right: 25px;
        line-height: 40px;
        z-index: 1;
      }
    }
    .el-form-item {
      margin: 0 10px;
      margin-bottom: 0 !important;
    }
    .el-form-item.no-margin-left >.el-form-item__content {
      margin-left: 0 !important;
    }
    .el-row {
      display: flex;
      .el-icon-delete {
        color: red;
        line-height: inherit;
        cursor: pointer;
      }
      .el-icon-remove-outline {
        line-height: 40px;
        font-size: 18px;
        color: red;
        cursor: pointer;
      }
    }
    .el-input {
      width: 180px;
      .el-input__inner {
        height: 30px;
        line-height: 30px;
        border: none;
        border-radius: 0;
        border-bottom: 1px solid #e6e6e6;
        &:focus {
          border-color: #409eff;
        }
      }
    }
    .el-button--text {
      padding: 8px 0;
    }
  }
  .el-dialog__footer {
    padding: 10px 20px;
    border-top: 1px solid #eee;
  }
}
</style>
<template>
  <el-dialog
    class="add-shell-dialog big-dialog"
    title="新增脚本"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="850px"
    @close="close">
    <div class="dialog-body">
      <div class="history-list">
        <label>修改脚本</label>
        <el-cascader v-model="selectedTaskName" :options="projTaskList" @change="projTaskChange" clearable></el-cascader>
      </div>
      <el-tabs v-model="activeName">
        <el-tab-pane label="填写方式" name="1">
          <el-form class="add-shell-dialog-form" :model="addShellForm" label-width="68px">
            <el-row>
              <el-form-item label="压测类型">
                <el-select v-model="shellType" placeholder="请选择压测类型">
                  <el-option
                    v-for="item in shellTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="项目名称" prop="stressProjName">
                <el-input v-model="addShellForm.stressProjName" placeholder="请输入项目名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="别名" prop="stressTaskName">
                <el-input v-model="addShellForm.stressTaskName" placeholder="请输入别名" clearable></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="执行时间" prop="execTime">
                <el-input-number v-model="addShellForm.execTime" step-strictly :min="0" :controls="false" placeholder="请输入整数"></el-input-number>
              </el-form-item>
              <el-form-item label="线程数" prop="threadNum">
                <el-input-number v-model="addShellForm.threadNum" step-strictly :min="1" :controls="false" placeholder="请输入整数"></el-input-number>
              </el-form-item>
              <el-form-item label="连接数" prop="connectNum">
                <el-input-number v-model="addShellForm.connectNum" step-strictly :min="1" :controls="false" placeholder="请输入整数"></el-input-number>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="是https">
                <el-radio-group v-model="addShellForm.isHttps">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-form-item prop="reqList" class="no-margin-left" style="margin-top: 16px;">
              <el-collapse v-model="activeCollapseNames">
                <el-collapse-item
                  v-for="(item, reqIndex) in addShellForm.reqList"
                  :key="reqIndex"
                  :name="reqIndex">
                  <template slot="title">
                    <el-row style="color: #67c23a">
                      请求{{reqIndex + 1}}参数：
                      <i v-if="addShellForm.reqList.length > 1"
                        class="el-icon-delete"
                        @click="delRequestParam(reqIndex)">
                      </i>
                    </el-row>
                  </template>
                  <el-row>
                    <el-form-item label="host" prop="host">
                      <el-input v-model="item.host" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="method" prop="method">
                      <el-select v-model="item.method" @change="methodChange(reqIndex, $event)">
                        <el-option value="get" label="get"></el-option>
                        <el-option value="post" label="post"></el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="port" prop="port">
                      <el-input v-model="item.port"></el-input>
                    </el-form-item>
                  </el-row>
                  <el-row>
                    <el-form-item label="uri" prop="uri">
                      <el-input v-model="item.uri" clearable></el-input>
                    </el-form-item>
                    <el-form-item label="占比" prop="percent">
                      <el-input v-model="item.percent"></el-input>
                    </el-form-item>
                    <el-form-item label="是对象" prop="isObj">
                      <el-radio-group v-model="item.isObj">
                        <el-radio :label="true">是</el-radio>
                        <el-radio :label="false">否</el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-row>
                  <div v-for="(paramHeaderMap, paramHeaderMapIndex) in item.paramHeaderMapList" :key="paramHeaderMapIndex">
                    <div style="padding-left: 45px;color: #ff7575;line-height:40px;font-size: 16px;">
                      paramHeaderMap :
                      <i v-if="item.paramHeaderMapList.length > 1"
                        class="el-icon-delete"
                        @click="delParamHeaderMap(reqIndex, paramHeaderMapIndex)">
                      </i>
                    </div>
                    <div>
                      <div style="padding-left: 45px;color: #aaa;font-size: 16px;">
                        repeat :<el-input v-model="paramHeaderMap.repeat" style="margin-left:10px"></el-input>
                      </div>
                    </div>
                    <div>
                      <div style="padding-left: 45px;color: #aaa;font-size: 16px;">headers :</div>
                      <el-row v-for="(header, headerIndex) in paramHeaderMap.headers" :key="headerIndex">
                        <el-form-item label="key">
                          <el-input v-model="header.key"></el-input>
                        </el-form-item>
                        <el-form-item label="value">
                          <el-input v-model="header.value"></el-input>
                        </el-form-item>
                        <i v-if="paramHeaderMap.headers.length > 1" class="el-icon-remove-outline" @click="delHeader(reqIndex, paramHeaderMapIndex, headerIndex)"></i>
                      </el-row>
                      <div style="padding-left: 45px;"><el-button type="text" @click="addHeader(reqIndex, paramHeaderMapIndex)">+ 增加一行</el-button></div>
                    </div>
                    <div>
                      <div style="padding-left: 45px;color: #aaa;font-size: 16px;">params :</div>
                      <el-row v-for="(param, paramIndex) in paramHeaderMap.params" :key="paramIndex">
                        <el-form-item label="key">
                          <el-input v-model="param.key"></el-input>
                        </el-form-item>
                        <el-form-item label="value">
                          <el-input v-model="param.value"></el-input>
                        </el-form-item>
                        <i v-if="paramHeaderMap.params.length > 1" class="el-icon-remove-outline" @click="delParam(reqIndex, paramHeaderMapIndex, paramIndex)"></i>
                      </el-row>
                      <div style="padding-left: 45px;"><el-button type="text" @click="addParam(reqIndex, paramHeaderMapIndex)">+ 增加一行</el-button></div>
                    </div>
                    <div v-if="'reqBody' in paramHeaderMap">
                      <div style="padding-left: 45px;color: #aaa;font-size: 16px;">reqBody :</div>
                      <el-row>
                        <el-form-item style="width: 90%;margin-left: 45px;">
                          <el-input type="textarea" autosize v-model="paramHeaderMap.reqBody" style="width: 100%;"></el-input>
                        </el-form-item>
                      </el-row>
                    </div>
                    <div style="padding-left: 45px;"><el-button type="text" @click="addParamHeaderMap(reqIndex)" style="color: #ff7575;">+ 增加paramHeaderMap</el-button></div>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <el-button type="text" @click="addRequestParam">+ 增加请求</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="JSON方式" name="2">
          <div style="margin-bottom:20px">
            <label style="margin-right:12px">压测类型</label>
            <el-select v-model="shellType" placeholder="请选择压测类型">
              <el-option
                v-for="item in shellTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <label style="margin: 0 12px">项目名称</label>
            <el-input v-model="addShellJSON.stressProjName" placeholder="请输入项目名称" clearable></el-input>
            <label style="margin: 0 12px">别名</label>
            <el-input v-model="addShellJSON.stressTaskName" placeholder="请输入别名" clearable></el-input>
          </div>
          <div style="margin-bottom:20px">
            <label style="margin: 0 12px">是https</label>
            <el-radio-group v-model="addShellJSON.isHttps">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </div>
          <div>
            <el-input type="textarea" :rows="20" placeholder="请输入脚本内容, 格式JSON格式" v-model="addShellJSON.shellContent"></el-input>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button :loading="addShellLoading" type="primary" style="width: 100%" @click="submit">提交</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: ['projTaskList', 'addShellInitData'],
  data () {
    return {
      visible: false,
      activeName: '1',
      selectedTaskName: [],
      shellTypeList: [
        { id: 1, name: 'Java' },
        { id: 2, name: 'wrk' },
        { id: 3, name: 'nettyStress' }
      ],
      shellType: '',
      addShellForm: {
        stressProjName: '', // 项目名称
        stressTaskName: '', // 别名
        execTime: null, // 执行时间
        threadNum: null, // 线程数
        connectNum: null, // 连接数
        isHttps: false,
        reqList: [ // 请求集合
          {
            host: 'api.weipaitang.com',
            method: 'get',
            paramHeaderMapList: [
              {
                repeat: '',
                headers: [{ key: '', value: '' }],
                params: [{ key: '', value: '' }]
              }
            ],
            percent: null, // 占比
            isObj: false,
            port: null,
            uri: ''
          }
        ]
      },
      activeCollapseNames: [],
      addShellLoading: false,
      addShellJSON: {
        shellContent: '',
        stressProjName: '',
        stressTaskName: '',
        isHttps: false
      }
    }
  },
  watch: {
    'addShellInitData' (value) {
      this.shellType = value.type
      let shellContent = JSON.parse(value.shellContent)
      shellContent.reqList.forEach(req => {
        req.paramHeaderMapList.forEach(param => {
          let headers = []
          let params = []
          for (let key in param.headers) {
            headers.push({
              key,
              value: param.headers[key]
            })
          }
          param.headers = headers
          for (let key in param.params) {
            params.push({
              key,
              value: param.params[key]
            })
          }
          param.params = params
        })
      })
      this.addShellForm = shellContent
      Object.keys(this.addShellJSON).forEach(key => {
        this.addShellJSON[key] = value[key]
      })
    },
    'addShellForm.reqList': {
      handler (value) {
        let names = []
        for (let i = 0; i < value.length; i++) {
          names.push(i)
        }
        this.activeCollapseNames = names
      },
      immediate: true
    }
  },
  methods: {
    projTaskChange (value) {
      if (value.length) {
        this.$parent.socketSend({
          bindPage: 'server_monitor',
          type: 'REQ_BACKEND',
          msgType: 'getTaskDetail',
          msg: JSON.stringify({
            sendAccount: this.$store.state.userInfo.account,
            projName: this.selectedTaskName[0],
            taskName: this.selectedTaskName[1]
          })
        })
      }
    },
    submit () {
      if (this.activeName === '1') {
        this.submitKey()
      } else {
        this.submitJSON()
      }
    },
    addShellReq (params) {
      this.addShellLoading = true
      this.$service.addShell(params).then(() => {
        this.$message.success('脚本执行成功')
        this.close()
      }).finally(() => {
        this.addShellLoading = false
      })
    },
    submitKey(){
      let addShellFormCopy = JSON.parse(JSON.stringify(this.addShellForm))
      let percentTotal = 0
      addShellFormCopy.reqList.forEach(item => {
        percentTotal += Number(item.percent)

        item.paramHeaderMapList.forEach(paramHeaderMap => {
          let newHeaders = {}
          let newParams = {}
          paramHeaderMap.headers.forEach(header => {
            newHeaders[header.key] = header.value
          })
          paramHeaderMap.params.forEach(param => {
            newParams[param.key] = param.value
          })
          paramHeaderMap.headers = newHeaders
          paramHeaderMap.params = newParams
        })
      })
      if (percentTotal !== 1) {
        this.$message.error('占比之和不为1，请调整')
        // return false
      }
      console.log(addShellFormCopy)
      this.addShellReq({
        shellContent: JSON.stringify(addShellFormCopy),
        type: this.shellType,
        stressProjName: addShellFormCopy.stressProjName,
        stressTaskName: addShellFormCopy.stressTaskName,
        isHttps: addShellFormCopy.isHttps
      })
    },
    submitJSON () {
      this.addShellReq({
        ...this.addShellJSON,
        type: this.shellType
      })
    },
    close () {
      this.visible = false
      this.selectedTaskName = []
      this.shellType = '',
      this.addShellForm = {
        stressProjName: '',
        stressTaskName: '',
        execTime: null,
        threadNum: null,
        connectNum: null,
        reqList: [
          {
            host: 'api.weipaitang.com',
            method: 'get',
            paramHeaderMapList: [
              {
                repeat: '',
                headers: [{ key: '', value: '' }],
                params: [{ key: '', value: '' }]
              }
            ],
            percent: null,
            isObj: false,
            port: null,
            uri: ''
          }
        ]
      }
      this.addShellJSON = {
        shellContent: '',
        stressProjName: '',
        stressTaskName: '',
        isHttps: false
      }
    },
    // 改变method
    methodChange (reqIndex, e) {
      if (e === 'get') {
        this.addShellForm.reqList[reqIndex].paramHeaderMapList.forEach(paramHeaderMap => {
          this.$delete(paramHeaderMap, 'reqBody')
        })
        // this.$delete(this.addShellForm.reqList[reqIndex].paramHeaderMapList[0], 'reqBody')
      } else {
        this.addShellForm.reqList[reqIndex].paramHeaderMapList.forEach(paramHeaderMap => {
          this.$set(paramHeaderMap, 'reqBody')
        })
        // this.$set(this.addShellForm.reqList[reqIndex].paramHeaderMapList[0], 'reqBody', '')
      }
    },
    addParamHeaderMap (reqIndex) {
      this.addShellForm.reqList[reqIndex].paramHeaderMapList.push({
        headers: [{ key: '', value: '' }],
        params: [{ key: '', value: '' }]
      })
    },
    delParamHeaderMap (reqIndex, paramHeaderMapIndex) {
      this.addShellForm.reqList[reqIndex].paramHeaderMapList.splice(paramHeaderMapIndex, 1)
    },
    addHeader (reqIndex, paramHeaderMapIndex) {
      this.addShellForm.reqList[reqIndex].paramHeaderMapList[paramHeaderMapIndex].headers.push({ key: '', value: '' })
    },
    delHeader (reqIndex, paramHeaderMapIndex, headerIndex) {
      this.addShellForm.reqList[reqIndex].paramHeaderMapList[paramHeaderMapIndex].headers.splice(headerIndex, 1)
    },
    addParam (reqIndex, paramHeaderMapIndex) {
      this.addShellForm.reqList[reqIndex].paramHeaderMapList[paramHeaderMapIndex].params.push({ key: '', value: '' })
    },
    delParam (reqIndex, paramHeaderMapIndex, paramIndex) {
      this.addShellForm.reqList[reqIndex].paramHeaderMapList[paramHeaderMapIndex].params.splice(paramIndex, 1)
    },
    // 增加请求参数
    addRequestParam () {
      this.addShellForm.reqList.push({
        host: 'api.weipaitang.com',
        method: 'get',
        paramHeaderMapList: [
          {
            repeat: '',
            headers: [{ key: '', value: '' }],
            params: [{ key: '', value: '' }]
          }
        ],
        percent: null,
        isObj: false,
        port: null,
        uri: ''
      })
    },
    // 删除请求参数
    delRequestParam (reqIndex) {
      this.addShellForm.reqList.splice(reqIndex, 1)
    }
  }
}
</script>