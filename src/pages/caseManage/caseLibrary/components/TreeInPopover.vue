<style lang="scss">
.component-tree-in-popover {
  padding: 0;
  margin-top: 5px !important;
  transform: translateX(-53px);
  header {
    padding: 10px;
    text-align: center;
    border-bottom: 1px solid #dcdfe6;
  }
  &-tree {
    width: 398px;
    height: 500px;
    overflow-y: auto;
  }
  footer {
    padding: 10px;
    border-top: 1px solid #dcdfe6;
    .el-button {
      width: 100%;
    }
  }
}
</style>
<template>
  <el-popover popper-class="component-tree-in-popover" width="400" placement="bottom-start">
    <header>选择分组</header>
    <el-tree
      class="component-tree-in-popover-tree"
      ref="popoverCaseTree"
      :data="caseTreeData[0].children"
      default-expand-all
      :expand-on-click-node="false"
      :highlight-current="true"
      :props="defaultProps"
      node-key="id"
      :filter-node-method="caseTreeFilterNode"
      @node-click="handleNodeClick"></el-tree>
    <footer>
      <el-button type="primary" @click="handleSure">确定</el-button>
    </footer>
    <slot slot="reference"></slot>
  </el-popover>
</template>
<script>
export default {
  inject: ['caseTreeData'],
  data () {
    return {
      defaultProps: { // 用例树配置
        children: 'children',
        label: function (data) {
          return data.name
        }
      },
      groupData: {}
    }
  },
  mounted () {
    this.$refs.popoverCaseTree.filter(4)
  },
  methods: {
    handleSure () {
      this.$emit('on-tree-node-click', this.groupData)
      document.querySelector('#treeInPopover').click()
    },
    handleNodeClick (data) {
      this.groupData = data
    },
    // 筛去用例
    caseTreeFilterNode (value, data) {
      return data.cardType !== value
    }
  }
}
</script>