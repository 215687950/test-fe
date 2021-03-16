<style lang="scss">
.el-dialog__wrapper.check-case-dialog {
  .el-dialog {
    height: 640px;
  }
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    height: 100%;
    padding: 0;
    display: flex;
    flex-direction: column;
    .dialog-body {
      flex: 1;
      overflow: hidden;
      display: flex;
      .dialog-body-left {
        width: 300px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border-right: 1px solid rgba(0, 0, 0, 0.07);
        &-header {
          padding: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
          .label {
            margin-right: 10px
          }
          .el-input__inner {
            border-radius: 2px;
          }
          .el-input__inner,
          .el-input__icon {
            line-height: 24px;
            height: 24px;
          }
        }
        &-main {
          flex: 1;
          overflow-y: auto;
        }
      }
      .dialog-body-right {
        position: relative;
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        &-header {
          height: 49px;
          line-height: 49px;
          padding: 0 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.07);
          display: flex;
          justify-content: space-between;
        }
        &-main {
          flex: 1;
          overflow-y: auto;
          .el-checkbox {
            display: block;
            line-height: 32px;
            padding: 0 60px 0 12px;
            margin: 0;
            position: relative;
            &:hover {
              background: #ecf5ff;
            }
            .el-checkbox__label {
              width: calc(100% - 10px);
              white-space: nowrap;
              text-overflow: ellipsis;
              overflow: hidden;
              vertical-align: sub;
            }
            .maintain {
              position: absolute;
              right: 10px;
            }
          }
          .no-data {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translateX(-50%);
          }
        }
      }
    }
    .dialog-footer {
      padding: 10px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
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
      border-top: 1px solid rgba(0, 0, 0, 0.07);
    }
  }
}
</style>
<template>
  <el-dialog class="check-case-dialog" :visible.sync="visible" :close-on-click-modal="false" width="800px">
    <!-- <div class="dialog-header">圈选用例</div> -->
    <div class="dialog-body">
      <div class="dialog-body-left">
        <div class="dialog-body-left-header">
          <span class="label">用例库</span>
          <el-select v-model="currentCaseLibraryId" @change="caseLibraryChange" style="width:223px">
            <el-option v-for="item in caseLibraryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </div>
        <div class="dialog-body-left-main">
          <el-tree
            v-loading="treeLoading"
            ref="caseTree"
            :data="treeData"
            show-checkbox
            highlight-current
            node-key="virtualId"
            default-expand-all
            :filter-node-method="caseTreeFilterNode"
            :expand-on-click-node="false"
            :props="defaultProps"
            @node-click="handleNodeClick"
            @check="handleCheck">
            <span class="custom-tree-node" slot-scope="{ node }">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="dialog-body-right">
        <div class="dialog-body-right-header">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div class="maintain">维护人</div>
        </div>
        <div class="dialog-body-right-main">
          <el-checkbox-group v-model="checkedCaseList" @change="handleCheckedCaseChange">
            <el-checkbox v-for="item in currentCaseList" :label="item.id" :key="item.id" @change="checkboxChange(item, $event)">
              {{item.name}}
              <span class="maintain">{{item.maintain}}</span>
            </el-checkbox>
          </el-checkbox-group>
          <div class="no-data" v-if="!currentCaseList.length">该分组下无测试用例</div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <div style="display:flex;align-items: center;">
        <span style="color:#409EFF">{{totalCheckedCases.length}} 条用例已选</span>
        <span style="width: 1px; height: 14px; background: rgba(0, 0, 0, 0.07); margin: 0px 10px;"></span>
        <span style="cursor: pointer;color:#9199a3" @click="clearChecked">清空已选</span>
      </div>
      <div>
        <el-button class="btn-item btn-ok" @click="submit" :loading="loading">确定</el-button>
        <el-button class="btn-item btn-cancel" @click="cancel">取消</el-button>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: ['initData', 'visible', 'loading'],
  data () {
    return {
      caseLibraryList: [],
      currentCaseLibraryId: '',
      treeLoading: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: function (data) {
          return data.name
        }
      },
      /* 右侧case区 */
      isIndeterminate: false,
      checkAll: false,
      currentCaseList: [],
      checkedCaseList: [],
      totalCheckedCases: []
    }
  },
  watch: {
    'visible' (bool) {
      if (bool) {
        this.totalCheckedCases = JSON.parse(JSON.stringify(this.initData))
        this.getCaseLibraryList()
      }
    }
  },
  methods: {
    clearChecked () {
      this.totalCheckedCases = []
      this.checkAll = false
      this.isIndeterminate = false
      this.checkedCaseList = []
    },
    // 全选
    handleCheckAllChange (bool) {
      if (bool) {
        let arr = []
        this.currentCaseList.forEach(item => {
          arr.push(item.id)
          let includes = this.totalCheckedCases.find(i => i.id === item.id)
          if (!includes) {
            this.totalCheckedCases.push(item)
            this.$refs.caseTree.setChecked(item, bool)
          }
        })
        this.checkedCaseList = arr
      } else {
        this.checkedCaseList = []
        this.currentCaseList.forEach(item => {
          let index = this.totalCheckedCases.findIndex(i => i.id === item.id)
          if (index > -1) {
            this.totalCheckedCases.splice(index, 1)
            this.$refs.caseTree.setChecked(item, bool)
          }
        })
      }
      this.isIndeterminate = false
    },
    // 监听checkbox-group
    handleCheckedCaseChange (data) {
      let checkedCount = data.length
      let currentCaseCount = this.currentCaseList.length
      this.checkAll = checkedCount === currentCaseCount
      this.isIndeterminate = checkedCount > 0 && checkedCount < currentCaseCount
    },
    // 监听checkbox
    checkboxChange (data, bool) {
      if (bool) {
        let includes = this.totalCheckedCases.find(i => i.id === data.id)
        if (!includes) {
          this.totalCheckedCases.push(data)
        }
      } else {
        let index = this.totalCheckedCases.findIndex(i => i.id === data.id)
        if (index > -1) {
          this.totalCheckedCases.splice(index, 1)
        }
      }
      this.$refs.caseTree.setChecked(data, bool)
    },
    // 切换用例库
    caseLibraryChange (id) {
      this.currentCaseLibraryId = id
      this.getCaseTree()
      this.currentCaseList = []
      this.checkedCaseList = []
      this.checkAll = false
      this.isIndeterminate = false
    },
    // 获取用例库列表
    getCaseLibraryList () {
      this.$service.getCaseLibraryList().then(res => {
        if (res.data.length) {
          this.caseLibraryList = res.data
          this.currentCaseLibraryId = res.data[0].id
          this.getCaseTree()
        }
      })
    },
    // 获取用例树
    getCaseTree () {
      this.treeLoading = true
      this.$service.getCaseTree({ productId: this.currentCaseLibraryId }).then(res => {
        let data = {
          id: '0',
          virtualId: '0',
          name: '全部用例',
          cardType: 3,
          children: res.data
        }
        this.$set(this.treeData, 0, data)
        this.$nextTick(() => {
          this.$refs.caseTree.filter(4)
          this.initCaseTreeChecked(this.treeData[0].children)
        })
      }).finally(() => {
        this.treeLoading = false
      })
    },
    initCaseTreeChecked (data) {
      data.forEach(item => {
        let includes = this.totalCheckedCases.find(i => i.virtualId === item.virtualId)
        if (includes) {
          this.$refs.caseTree.setChecked(item, true)
        }
        this.initCaseTreeChecked(item.children)
      })
    },
    // 筛去用例
    caseTreeFilterNode (value, data) {
      return data.cardType !== value
    },
    // 点击tree node
    handleNodeClick (data) {
      this.checkedCaseList = []
      this.currentCaseList = data.children.filter(item => item.cardType === 4)
      this.currentCaseList.forEach(item => {
        let includes = this.totalCheckedCases.find(i => i.id === item.id)
        if (includes) {
          this.checkedCaseList.push(item.id)
        }
      })
      let checkedCount = this.checkedCaseList.length
      let currentCaseCount = this.currentCaseList.length
      if (currentCaseCount) {
        this.checkAll = checkedCount === currentCaseCount
        this.isIndeterminate = checkedCount > 0 && checkedCount < currentCaseCount
      } else {
        this.checkAll = false
        this.isIndeterminate = false
      }
    },
    // 勾选树的复选框
    handleCheck(data, o) {
      let checked = o.checkedKeys.find(i => i === data.virtualId)
      if (checked) {
        this.setCheck(data.children, true)
      } else {
        this.setCheck(data.children, false)
      }
      this.$refs.caseTree.setCurrentKey(data.virtualId)
      this.handleNodeClick(data)
    },
    setCheck (data, bool) {
      if (bool) {
        data.forEach(item => {
          let includes = this.totalCheckedCases.find(i => i.virtualId === item.virtualId)
          if (!includes && item.cardType === 4) {
            this.totalCheckedCases.push(item)
          }
          if (item.cardType !== 4) {
            this.setCheck(item.children, bool)
          }
        })
      } else {
        data.forEach(item => {
          let index = this.totalCheckedCases.findIndex(i => i.virtualId === item.virtualId)
          if (index > -1) {
            this.totalCheckedCases.splice(index, 1)
          }
          if (item.cardType !== 4) {
            this.setCheck(item.children, bool)
          }
        })
      }
    },
    submit () {
      this.$emit('on-ok', this.totalCheckedCases)
    },
    cancel () {
      this.caseLibraryList = []
      this.currentCaseLibraryId = ''
      this.treeData = [{
        id: '0',
        name: '全部用例',
        children: []
      }]
      this.isIndeterminate = false
      this.checkAll = false
      this.currentCaseList = []
      this.checkedCaseList = []
      this.totalCheckedCases = []
      this.$emit('on-close')
    }
  }
}
</script>