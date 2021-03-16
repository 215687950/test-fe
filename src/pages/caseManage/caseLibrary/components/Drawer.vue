<style lang="scss">
.component-drawer {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
  .fade-enter-active, .fade-leave-active {
    transition: all .5s;
  }
  .fade-enter, .fade-leave-to {
    right: -700px;
  }
  &-main {
    width: 700px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    background: #fff;
    &-header {
      padding: 16px 20px 10px;
      border-bottom: 1px solid #dcdfe6;
      &-title {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        &-label {
          height: 24px;
          font-size: 18px;
          color: #aaa;
          margin-right: 10px;
        }
        &-input {
          flex: 1;
          .el-input__inner {
            padding: 0;
            font-size: 18px;
            font-weight: bold;
            border: none;
            border-radius: 0;
            &:focus {
              border-bottom: 1px solid #409EFF;
            }
          }
        }
      }
      &-handler {
        height: 30px;
        line-height: 30px;
        display: flex;
        color: #606c80;
        .tree-in-popover-reference {
          display: inline-block;
          padding: 0 7px;
          max-width: 300px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          cursor: pointer;
          vertical-align: bottom;
          margin-right: 5px;
          &:hover {
            background: #f0f7ff;
          }
        }
      }
    }
    main {
      padding: 16px;
      max-height: calc(100% - 175px);
      overflow: auto;
      .step-box {
        .step-box-row {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
          .step-box-column1 {
            width: 18px;
            text-align: center;
          }
          .step-box-column2 {
            flex: 1;
            padding: 0 15px;
          }
        }
        .step-box-header {
          margin-top: 5px;
          font-size: 12px;
          color: #9199a3;
        }
        .step-item {
          position: relative;
          .step-box-column1 {
            text-align: center;
            span {
              display: inline-block;
              width: 18px;
              height: 18px;
              line-height: 18px;
              text-align: center;
              font-size: 12px;
              border-radius: 50%;
              background: #ccc;
              color: #fff;
            }
          }
          .step-box-column2 {
            .el-textarea__inner {
              padding: 0;
              border: none
            }
          }
          .handle-btn {
            display: none;
            position: absolute;
            top: 11px;
            right: 0;
            .el-icon-remove {
              font-size: 20px;
              color: #f56c6c;
              cursor: pointer;
            }
          }
          &:hover {
            .handle-btn {
              display: block;
            }
          }
        }
        .step-box-footer {
          color: #409EFF;
          .step-box-column2 {
            cursor: pointer;
          }
        }
      }
    }
    footer {
      padding: 16px 20px;
    }
    .el-icon-error {
      position: absolute;
      top: 42px;
      left: -12px;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      font-size: 24px;
      color: #9facc3;
      background: #fff;
      cursor: pointer;
    }
  }
}
</style>
<template>
  <div v-if="visible" class="component-drawer">
    <transition name="fade">
      <div v-if="mainVisible" class="component-drawer-main" v-loading="loading" v-click-out-side="close">
        <header class="component-drawer-main-header">
          <div class="component-drawer-main-header-title">
            <div class="component-drawer-main-header-title-label">用例标题 :</div>
            <el-input v-model="name" maxlength="30" class="component-drawer-main-header-title-input" placeholder="未命名用例"></el-input>
          </div>
          <div class="component-drawer-main-header-handler">
            <div>
              分组
              <TreeInPopover @on-tree-node-click="selectGroup">
                <span v-if="pathName" id="treeInPopover" class="tree-in-popover-reference" :title="pathName">{{ pathName }}<i class="el-icon-caret-bottom"></i></span>
                <span v-else id="treeInPopover" class="tree-in-popover-reference">请选择分组<i class="el-icon-caret-bottom"></i></span>
              </TreeInPopover>
            </div>
            <div>
              等级
              <PopoverSelect :reference="'P' + priority || 'P2'" :list="priorityList" @on-select="priorityChange"></PopoverSelect>
            </div>
            <div>
              用例类型
              <PopoverSelect :reference="caseType" :list="caseTypeList" @on-select="caseTypeChange"></PopoverSelect>
            </div>
          </div>
        </header>
        <main>
          <div>
            <div>前置条件</div>
            <el-input v-model="premise" placeholder="点击此处添加前置条件（可选）" style="margin: 10px 0 16px;"></el-input>
          </div>
          <div>
            <div>步骤描述</div>
            <div class="step-box">
              <div class="step-box-row step-box-header">
                <div class="step-box-column1">#</div>
                <div class="step-box-column2">步骤</div>
                <div class="step-box-column2">预期</div>
              </div>
              <div class="step-box-row step-item" v-for="(step, index) in stepList" :key="step.id">
                <div class="step-box-column1">
                  <span>{{index + 1}}</span>
                </div>
                <div class="step-box-column2">
                  <el-input type="textarea" :rows="1" autosize v-model="step.operatorContent" placeholder="请输入步骤"></el-input>
                </div>
                <div class="step-box-column2">
                  <el-input type="textarea" :rows="1" autosize v-model="step.exceptionResult" placeholder="请输入预期"></el-input>
                </div>
                <div class="handle-btn">
                  <i class="el-icon-remove" @click="delStep(index)"></i>
                </div>
              </div>
              <div class="step-box-row step-box-footer">
                <div class="step-box-column1">+</div>
                <div class="step-box-column2" @click="addStep">增加步骤</div>
              </div>
            </div>
          </div>
        </main>
        <footer ref="drawer-footer">
          <el-button type="primary" @click="handleSave(true)">{{ `保存${drawerInitData.type === 'edit' ? '修改' : ''}`}}</el-button>
          <el-button v-if="drawerInitData.type === 'add'" type="success" @click="handleSave(false)">保持并新建</el-button>
        </footer>
        <i class="el-icon-error" @click="close"></i>
      </div>
    </transition>
  </div>
</template>
<script>
import TreeInPopover from './TreeInPopover'
import PopoverSelect from '@/components/PopoverSelect'
export default {
  components: { TreeInPopover, PopoverSelect },
  props: {
    visible: Boolean,
    drawerInitData: Object
  },
  data () {
    return {
      mainVisible: false,
      loading: false,
      id: '',
      parentId: '',
      name: '',
      path: '',
      pathName: '',
      priority: '2',
      caseType: '功能用例',
      premise: '',
      stepList: [
        { operatorContent: '', exceptionResult: '' }
      ],
      stepListCopy: []
    }
  },
  watch: {
    'visible' (value) {
      setTimeout(() => {
        this.mainVisible = value
      }, 0)
    },
    'drawerInitData' (value) {
      if (value.type === 'add') {
        this.parentId = value.parentId
        this.path = value.path
        this.pathName = value.pathName
      } else if (value.type === 'edit') {
        this.loading = true
        this.$service.getCaseDetail({ id: value.id }).then(res => {
          this.id = res.data.id
          this.parentId = res.data.parentId
          this.name = res.data.name
          this.path = res.data.path
          this.pathName = res.data.pathName
          this.priority = res.data.priority
          this.caseType = res.data.caseType
          this.premise = res.data.premise
          this.stepList = res.data.stepList
          this.stepListCopy = JSON.parse(JSON.stringify(res.data.stepList))
        }).finally(() => {
          this.loading = false
        })
      }
    }
  },
  computed: {
    priorityList () {
      return this.$store.state.allEnum.priority
    },
    caseTypeList () {
      return this.$store.state.allEnum.caseType
    }
  },
  methods: {
    handleSave (close) {
      if (this.drawerInitData.type === 'add') {
        this.save(close)
      } else if (this.drawerInitData.type === 'edit') {
        this.edit(close)
      }
    },
    save (close) {
      if (this.name === '') {
        this.$message.error('请填写用例名')
        return
      }
      if (!this.path) {
        this.$message.error('请选择分组')
        return
      }
      this.$service.addCase({
        productId: this.$route.params.id,
        parentId: this.parentId,
        name: this.name,
        path: this.path,
        priority: this.priority,
        caseType: this.caseType,
        premise: this.premise,
        stepList: this.stepList
      }).then(() => {
        this.$message.success('创建成功')
        if (close) {
          this.close()
        } else {
          this.name = ''
          this.premise = ''
          this.stepList = [
            { operatorContent: '', exceptionResult: '' }
          ]
        }
        this.$emit('on-save-sucess')
      })
    },
    edit (close) {
      if (this.name !== '') {
        let data = {
          id: this.id,
          productId: this.$route.params.id,
          parentId: this.parentId,
          name: this.name,
          path: this.path,
          priority: this.priority,
          caseType: this.caseType,
          premise: this.premise
        }
        if (JSON.stringify(this.stepList) !== JSON.stringify(this.stepListCopy)) {
          data.stepList = this.stepList
        }
        this.$service.updateCase(data).then(() => {
          this.$message.success('修改成功')
          if (close) {
            this.close()
          }
          this.$emit('on-save-sucess')
        })
      } else {
        this.$message.error('请填写用例名')
      }
    },
    selectGroup (value) {
      this.parentId = value.id
      this.path = value.path
      this.pathName = value.pathName
    },
    priorityChange (data) {
      this.priority = data.id
    },
    caseTypeChange (data) {
      this.caseType = data.value
    },
    addStep () {
      this.stepList.push({ operatorContent: '', exceptionResult: '' })
    },
    delStep (index) {
      this.stepList.splice(index, 1)
    },
    close () {
      this.id = ''
      this.parentId = ''
      this.name = ''
      this.path = ''
      this.pathName = ''
      this.priority = '2'
      this.caseType = '功能用例'
      this.premise = ''
      this.stepList = [
        { operatorContent: '', exceptionResult: '' }
      ]
      this.mainVisible = false
      setTimeout(() => {
        this.$emit('on-close')
      }, 500)
    }
  }
}
</script>