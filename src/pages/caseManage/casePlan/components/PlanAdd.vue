<style lang="scss">
.el-dialog__wrapper.add-plan-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 24px;
    position: relative;
    .dialog-header {
      font-size: 20px;
      line-height: 24px;
      color: rgb(32, 45, 64);
    }
    .plan-type {
      position: absolute;
      top: 21px;
      right: 20px;
      label {
        margin-right: 10px;
      }
    }
    .dialog-body {
      margin: 10px 0 20px;
      .el-input.plan-name {
        .el-input__inner {
          padding: 8px 0px;
          height: 43px;
          font-size: 16px;
          color: #202d40;
          caret-color: #0066ff;
          border-radius: 0;
          border: none;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
          -webkit-font-smoothing: antialiased;
          &:hover {
            border-color: #bec4cc;
          }
          &:focus {
            border-color: #0066ff;
          }
        }
      }
      .setting-bar {
        display: flex;
        align-items: center;
        margin: 20px 0px;
        .label {
          margin-right: 8px;
          color: #9199a3;
        }
        .popover-reference {
          height: 32px;
          line-height: 32px;
          width: 108px;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          padding: 0 7px;
          border-radius: 2px;
          cursor: pointer;
          &:hover {
            background-color: rgba(16, 113, 211, 0.08);
            .el-icon-caret-bottom {
              color: #2970d3;
            }
          }
          &:focus {
            outline: none;
          }
          .el-icon-caret-bottom {
            margin-left: 5px;
            color: #babcbf;
          }
        }
        .popover-reference.actived {
          background-color: rgba(16, 113, 211, 0.08);
          .el-icon-caret-bottom {
            color: #2970d3;
          }
        }
        .split-line {
          width: 1px;
          height: 14px;
          background: rgba(0, 0, 0, 0.07);
          margin: 2px 24px 0px 18px;
        }
        .el-date-editor .el-input__inner {
          border: none;
          box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 6px 0px;
        }
      }
      .case-bar {
        height: 48px;
        padding: 0px 10px;
        margin: 30px 0 70px;
        box-shadow: rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 6px 0px;
        border-radius: 3px;
        display: flex;
        align-items: center;
      }
    }
    .dialog-footer {
      text-align: right;
      .btn-item {
        height: 36px;
        width: 100px;
        border-radius: 3px;
      }
      .btn-ok {
        background: #202d40;
        color: #fff;
        &:hover {
          background: #2f4463;
        }
      }
      .btn-cancel:hover {
        background: #f3f4f6;
      }
    }
  }
}
</style>
<template>
  <div>
    <el-dialog class="add-plan-dialog" :visible.sync="visible" :close-on-click-modal="false" width="666px">
      <div class="dialog-header">{{type === 'add' ? '创建测试计划' : '编辑测试计划'}}</div>
      <div class="plan-type" v-if="type === 'add'">
        <label>测试计划类型</label>
        <el-select v-model="planData.type" clearable>
          <el-option label="普通计划" :value="0"></el-option>
          <el-option label="测试单计划" :value="1"></el-option>
        </el-select>
      </div>
      <div class="dialog-body">
        <el-input class="plan-name" ref="plan-name" v-model="planData.name" maxlength="15" placeholder="请输入测试计划名称"></el-input>
        <div class="setting-bar">
          <span class="label">禅道产品</span>
          <el-popover
            popper-class="plan-setting-popover"
            placement="bottom-start"
            trigger="click"
            @show="popoverShow.chandao = true"
            @hide="popoverShow.chandao = false">
            <el-input v-model="chandaoKeyword" prefix-icon="el-icon-search" placeholder="搜索..." @input="searchChandao"></el-input>
            <ul v-if="chandaoList.length">
              <li v-for="item in chandaoList" :key="item.id" @click="selectChandao(item)">{{item.name}}</li>
            </ul>
            <div v-else style="text-align:center;line-height:50px">暂无筛选迭代</div>
            <div
              :class="popoverShow.chandao ? 'popover-reference actived' : 'popover-reference'"
              slot="reference">
              {{planData.ztProductName || '请搜索选择'}}<i class="el-icon-caret-bottom"></i>
            </div>
          </el-popover>
          <span class="split-line"></span>
          <span class="label">所属迭代</span>
          <el-popover
            popper-class="plan-setting-popover"
            placement="bottom-start"
            trigger="click"
            @show="popoverShow.iteration = true"
            @hide="popoverShow.iteration = false">
            <el-input v-model="iterationKeyword" prefix-icon="el-icon-search" placeholder="搜索..." @input="searchIteration"></el-input>
            <ul v-if="iterationList.length">
              <li v-for="item in iterationList" :key="item.id" @click="selectIteration(item)">{{item.name}}</li>
            </ul>
            <div v-else style="text-align:center;line-height:50px">暂无筛选迭代</div>
            <div
              :class="popoverShow.iteration ? 'popover-reference actived' : 'popover-reference'"
              slot="reference">
              {{planData.iterationName || '请搜索选择'}}<i class="el-icon-caret-bottom"></i>
            </div>
          </el-popover>
          <span class="split-line"></span>
          <span class="label">测试负责人</span>
          <el-popover
            popper-class="plan-setting-popover"
            placement="bottom-start"
            width="200"
            trigger="click"
            @show="popoverShow.principal = true"
            @hide="popoverShow.principal = false">
            <el-input v-model="principalKeyword" prefix-icon="el-icon-search" placeholder="搜索..." @input="searchPrincipal"></el-input>
            <ul v-if="principalList.length">
              <li v-for="item in principalList" :key="item.id" @click="selectPrincipal(item.name)">{{item.name}}</li>
            </ul>
            <div v-else style="text-align:center;line-height:50px">暂无筛选人员</div>
            <div
              :class="popoverShow.principal ? 'popover-reference actived' : 'popover-reference'"
              slot="reference">
              {{planData.principal || '请搜索选择'}}<i class="el-icon-caret-bottom"></i>
            </div>
          </el-popover>
        </div>
        <div class="setting-bar" v-if="planData.type === 0">
          <span class="label">开始时间</span>
          <el-date-picker v-model="planData.startTime" value-format="yyyy-MM-dd" placeholder="请选择开始时间"></el-date-picker>
          <span class="label" style="margin-left:34px">结束时间</span>
          <el-date-picker v-model="planData.endTime" value-format="yyyy-MM-dd" placeholder="请选择结束时间"></el-date-picker>
        </div>
        <div v-else>
          <div class="setting-bar">
            <span class="label">功能</span>
            <el-date-picker v-model="planData.startTime" value-format="yyyy-MM-dd" placeholder="请选择开始时间"  style="margin-right:30px"></el-date-picker>
            <el-date-picker v-model="planData.endTime" value-format="yyyy-MM-dd" placeholder="请选择结束时间"></el-date-picker>
          </div>
          <div class="setting-bar">
            <span class="label">冒烟</span>
            <el-date-picker v-model="planData.smokeStartTime" value-format="yyyy-MM-dd" placeholder="请选择开始时间"  style="margin-right:30px"></el-date-picker>
            <el-date-picker v-model="planData.smokeEndTime" value-format="yyyy-MM-dd" placeholder="请选择结束时间"></el-date-picker>
          </div>
          <div class="setting-bar">
            <span class="label">线上</span>
            <el-date-picker v-model="planData.onlineStartTime" value-format="yyyy-MM-dd" placeholder="请选择开始时间"  style="margin-right:30px"></el-date-picker>
            <el-date-picker v-model="planData.onlineEndTime" value-format="yyyy-MM-dd" placeholder="请选择结束时间"></el-date-picker>
          </div>
        </div>
        <div class="case-bar">
          <span>{{planData.caseList.length}}条用例已选</span>
          <span style="width: 1px;height: 14px;background: rgba(0, 0, 0, 0.07);margin: 0px 16px;"></span>
          <span style="color: #0066ff;cursor: pointer;" @click="showCheckCaseDialog = true">圈选用例<i class="el-icon-right"></i></span>
        </div>
      </div>
      <div class="dialog-footer">
        <el-button
          class="btn-item btn-ok"
          :loading="submitLoading"
          @click="submit">{{type === 'add' ? '创建计划' : '保存'}}</el-button>
        <el-button class="btn-item btn-cancel" @click="close">取消</el-button>
      </div>
    </el-dialog>
    <CheckCase
      :initData="planData.caseList"
      :visible="showCheckCaseDialog"
      @on-ok="checkCaseOk"
      @on-close="showCheckCaseDialog = false"></CheckCase>
  </div>
</template>
<script>
import CheckCase from './CheckCase'
export default {
  components: { CheckCase },
  props: ['type', 'visible', 'initData'],
  data () {
    return {
      showCheckCaseDialog: false,
      initCaseList: [],
      planData: {
        name: '',
        type: 1,
        iterationId: '',
        iterationName: '',
        ztProductId: '',
        ztProductName: '',
        principal: '',
        startTime: '',
        endTime: '',
        smokeStartTime: '',
        smokeEndTime: '',
        onlineStartTime: '',
        onlineEndTime: '',
        caseList: []
      },
      popoverShow: {
        iteration: false,
        principal: false,
        chandao: false
      },
      principalKeyword: '', // 测试负责人
      principalList: [],
      iterationKeyword: '', // 迭代
      iterationList: [],
      chandaoKeyword: '', // 禅道
      chandaoList: [],
      submitLoading: false
    }
  },
  watch: {
    'initData' (value) {
      if (value) {
        let valueCopy = JSON.parse(JSON.stringify(value))
        Object.keys(this.planData).forEach(key => {
          if (key === 'type') {
            this.planData[key] = 0
          } else {
            this.planData[key] = valueCopy[key]
          }
        })
        this.initCaseList = valueCopy.caseList
      }
    }
  },
  methods: {
    submit () {
      if (!this.planData.name) {
        this.$message.error('请填写计划名称')
        this.$refs['plan-name'].focus()
        return
      }
      this.submitLoading = true
      if (this.type === 'add') {
        this.$service.addPlan(this.planData).then(() => {
          this.$message.success('新增计划成功')
          this.close()
          this.$emit('on-save')
        }).finally(() => {
          this.submitLoading = false
        })
      } else {
        let initCaseListIds = []
        let isChange = false
        this.initCaseList.forEach(item => {
          initCaseListIds.push(item.id)
        })
        if (initCaseListIds.length !== this.planData.caseList.length) {
          isChange = true
        } else {
          this.planData.caseList.forEach(item => {
            if (!initCaseListIds.includes(item.id)) {
              isChange = true
            }
          })
        }
        let params = {
          id: this.initData.id,
          ...this.planData
        }
        if (!isChange) {
          delete params.caseList
        }
        delete params.type
        this.submitLoading = true
        this.$service.updatePlan(params).then(() => {
          this.$message.success('保存成功')
          this.close()
          this.$emit('on-save')
        }).finally(() => {
          this.submitLoading = false
        })
      }
    },
    close () {
      this.$emit('on-close')
      this.reset()
    },
    reset () {
      this.planData = {
        name: '',
        type: 0,
        iterationId: '',
        iterationName: '',
        principal: '',
        startTime: '',
        endTime: '',
        caseList: []
      }
      this.popoverShow = {
        iteration: false,
        principal: false
      }
      this.principalKeyword = ''
      this.principalList = []
      this.iterationKeyword = ''
      this.iterationList = []
    },
    // 搜索禅道
    searchChandao (value) {
      if (value.trim()) {
        this.$service.getProductList({ keyWord: value }).then(res => {
          this.chandaoList = res.data
        })
      } else {
        this.chandaoList = []
      }
    },
    // 选择禅道
    selectChandao (data) {
      this.planData.ztProductId = data.id
      this.planData.ztProductName = data.name
      document.querySelector('#app').click()
    },
    // 搜索迭代
    searchIteration (value) {
      if (value.trim()) {
        this.$service.getIterationByKeyword({ name: value }).then(res => {
          this.iterationList = res.data
        })
      } else {
        this.iterationList = []
      }
    },
    // 选择迭代
    selectIteration (data) {
      this.planData.iterationId = data.id
      this.planData.iterationName = data.name
      document.querySelector('#app').click()
    },
    // 搜索测试负责人
    searchPrincipal (value) {
      if (value.trim()) {
        this.$service.getUserByName({ name: this.principalKeyword }).then(res => {
          this.principalList = res.data
        })
      } else {
        this.principalList = []
      }
    },
    // 选择测试负责人
    selectPrincipal (name) {
      this.planData.principal = name
      document.querySelector('#app').click()
    },
    checkCaseOk (data) {
      this.planData.caseList = JSON.parse(JSON.stringify(data))
      this.showCheckCaseDialog = false
    }
  }
}
</script>