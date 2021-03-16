<style lang="scss">
.component-tree-table {
  height: 100%;
  position: relative;
  .handle-box {
    width: calc(100% - 40px);
    height: 38px;
    line-height: 38px;
    padding: 0 10px;
    position: absolute;
    top: 1px;
    right: 1px;
    z-index: 2;
    color: #606266;
    background: #f8f8f9;
    &-main {
      display: flex;
      &-item:not(:first-child) {
        margin-left: 30px;
        .el-popover__reference {
          cursor: pointer;
          &:hover {
            color: #409EFF;
          }
          .iconfont {
            vertical-align: bottom;
            margin-right: 5px;
          }
        }
      }
    }
  }
  .el-table {
    tr {
      cursor: pointer;
      &:hover {
        td .el-icon-circle-plus-outline {
          display: block;
        }
      }
    }
    th, td {
      padding: 8px 0;
    }
    .el-table-column--selection .cell {
      padding-right: 10px;
    }
    td {
      .el-table__placeholder {
        display: none;
      }
      .el-table__expand-icon {
        width: 12px;
        height: 12px;
        line-height: 12px;
        .el-icon-arrow-right:before {
          content: "\e791";
        }
      }
      .tree-lable-dot::before {
        content: " ";
        display: inline-block;
        width: 6px;
        height: 6px;
        margin: 0 5px;
        border-radius: 3px;
        background-color: #606266;
      }
      .el-icon-circle-plus-outline {
        display: none;
        position: absolute;
        right: 10px;
        top: 10px;
        color: #409EFF;
        font-size: 18px;
      }
    }
  }
}
</style>
<template>
  <div class="component-tree-table" ref="component-tree-table">
    <!-- 批量操作区 -->
    <div class="handle-box" :style="{display: caseIdList.length ? 'block': 'none'}">
      <div class="handle-box-main">
        <div class="handle-box-main-item">已选择{{caseIdList.length}}项</div>
        <!-- 设置维护人 -->
        <div class="handle-box-main-item">
          <el-popover
            popper-class="no-margin-top"
            placement="bottom"
            width="200"
            trigger="click">
            <el-select
              v-model="comply"
              size="small"
              filterable
              remote
              reserve-keyword
              :remote-method="remoteMethod"
              :loading="selectLoading">
              <el-option
                v-for="item in complyList"
                :key="item.value"
                :label="item.name"
                :value="item.name">
              </el-option>
            </el-select>
            <el-button :disabled="!comply" type="primary" style="width: 100%;margin-top: 10px" @click="setComply">确 定</el-button>
            <div slot="reference"><i class="iconfont icontouxiang"></i>设置维护人</div>
          </el-popover>
        </div>
        <!-- 修改用例等级 -->
        <div class="handle-box-main-item">
          <el-popover
            popper-class="no-margin-top no-padding"
            placement="bottom"
            width="150"
            trigger="click">
            <ul class="ul">
              <li v-for="item in priorityList" :key="item.id" @click="setPriority(item.id)">{{item.value}}</li>
            </ul>
            <div slot="reference"><i class="iconfont iconyuanquan"></i>修改用例等级</div>
          </el-popover>
        </div>
        <!-- 移动用例 -->
        <div class="handle-box-main-item">
          <el-popover
            popper-class="no-margin-top edit-case-popper"
            placement="bottom"
            :width="bodyType === 'group' ? 500 : 275"
            trigger="click"
            @show="getCaseTreeData">
            <div class="edit-case-popper-main">
              <div class="header">
                <span v-if="bodyType === 'default'">选择位置</span>
                <span v-if="bodyType === 'case'"><i class="el-icon-back" @click="bodyType = 'default'"></i>选择用例库</span>
                <span v-if="bodyType === 'group'"><i class="el-icon-back" @click="bodyType = 'default'"></i>选择分组</span>
                <i class="el-icon-close" @click="closePopper"></i>
              </div>
              <div v-if="bodyType === 'default'" class="body">
                <div class="body-row">
                  <div class="body-row-label">用例库</div>
                  <div class="body-row-content" @click="changeBodyType('case')">
                    <span>{{moveToCaseLibrary.name}}</span>
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
                <div class="body-row">
                  <div class="body-row-label">分组</div>
                  <div class="body-row-content" @click="changeBodyType('group')">
                    <span :title="moveToGroup.pathName">{{moveToGroup.pathName || '请选择分组'}}</span>
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
                <el-button
                  :disabled="!moveToCaseLibrary.id || !moveToGroup.id"
                  type="primary"
                  style="width:100%;margin-top:15px"
                  @click="moveCase">确定</el-button>
              </div>
              <div v-if="bodyType === 'case'" class="body">
                <ul class="ul">
                  <li v-for="item in caseLibraryList" :key="item.id" @click="selectCaseLibrary(item)">{{item.value}}</li>
                </ul>
              </div>
              <div v-if="bodyType === 'group'" class="body">
                <el-tree
                  ref="caseTree"
                  :data="caseTreeData"
                  default-expand-all
                  current-node-key="0"
                  :expand-on-click-node="false"
                  :highlight-current="true"
                  :props="defaultProps"
                  node-key="id"
                  :filter-node-method="caseTreeFilterNode"
                  @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            <div slot="reference"><i class="iconfont iconyichu"></i>移动用例</div>
          </el-popover>
        </div>
        <!-- 复制用例 -->
        <div class="handle-box-main-item">
          <el-popover
            popper-class="no-margin-top edit-case-popper"
            placement="bottom"
            :width="bodyType === 'group' ? 500 : 275"
            trigger="click"
            @show="getCaseTreeData">
            <div class="edit-case-popper-main">
              <div class="header">
                <span v-if="bodyType === 'default'">选择位置</span>
                <span v-if="bodyType === 'case'"><i class="el-icon-back" @click="bodyType = 'default'"></i>选择用例库</span>
                <span v-if="bodyType === 'group'"><i class="el-icon-back" @click="bodyType = 'default'"></i>选择分组</span>
                <i class="el-icon-close" @click="closePopper"></i>
              </div>
              <div v-if="bodyType === 'default'" class="body">
                <div class="body-row">
                  <div class="body-row-label">用例库</div>
                  <div class="body-row-content" @click="changeBodyType('case')">
                    <span>{{moveToCaseLibrary.name}}</span>
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
                <div class="body-row">
                  <div class="body-row-label">分组</div>
                  <div class="body-row-content" @click="changeBodyType('group')">
                    <span :title="moveToGroup.pathName">{{moveToGroup.pathName || '请选择分组'}}</span>
                    <i class="el-icon-arrow-right"></i>
                  </div>
                </div>
                <el-button
                  :disabled="!moveToCaseLibrary.id || !moveToGroup.id"
                  type="primary"
                  style="width:100%;margin-top:15px"
                  @click="copyCase">确定</el-button>
              </div>
              <div v-if="bodyType === 'case'" class="body">
                <ul class="ul">
                  <li v-for="item in caseLibraryList" :key="item.id" @click="selectCaseLibrary(item)">{{item.value}}</li>
                </ul>
              </div>
              <div v-if="bodyType === 'group'" class="body">
                <el-tree
                  ref="caseTree"
                  :data="caseTreeData"
                  default-expand-all
                  current-node-key="0"
                  :expand-on-click-node="false"
                  :highlight-current="true"
                  :props="defaultProps"
                  node-key="id"
                  :filter-node-method="caseTreeFilterNode"
                  @node-click="handleNodeClick"></el-tree>
              </div>
            </div>
            <div slot="reference"><i class="iconfont iconfuzhi"></i>复制用例</div>
          </el-popover>
        </div>
        <!-- 删除用例 -->
        <div class="handle-box-main-item" v-if="roleId === '1' || roleId === '1211847371895558145'">
          <el-popover
            popper-class="no-margin-top edit-case-popper"
            placement="bottom"
            width="220"
            trigger="click">
            <div class="edit-case-popper-main">
              <div class="header">
                <span>删除用例</span>
                <i class="el-icon-close" @click="closePopper"></i>
              </div>
              <div>
                <p>是否确定删除 {{caseIdList.length}} 个基础用例？删除后，数据不可再恢复。</p>
                <el-button type="danger" style="width:100%;" @click="deleteCase">确定</el-button>
              </div>
            </div>
            <div slot="reference"><i class="iconfont iconshanchu"></i>删除用例</div>
          </el-popover>
        </div>
      </div>
    </div>
    <!-- 表格区 -->
    <el-table
      ref="treeTable"
      :height="tableHeight"
      :data="data"
      row-key="virtualId"
      border
      default-expand-all
      style="width: 100%"
      :row-style="rowStyle"
      :span-method="spanMethod"
      :tree-props="{children: 'children'}"
      :row-class-name="rowClassName"
      @select-all="selectAll"
      @select="select"
      @selection-change="selectionChange"
      @row-click="rowClick">
      <el-table-column
        type="selection"
        align="center"
        width="40">
      </el-table-column>
      <el-table-column
        label="标题"
        min-width="200"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <i v-if="scope.row.cardType === 4" class="tree-lable-dot"></i>
          <i v-if="scope.row.cardType !== 4 && !scope.row.children.length" class="el-icon-arrow-right"></i>
          {{scope.row.name}}
          <i
            v-if="scope.row.cardType !== 4"
            class="el-icon-circle-plus-outline"
            @click.stop="addCase(scope.row)"></i>
        </template>
      </el-table-column>
      <el-table-column
        label="用例等级">
        <template slot-scope="scope">
          <span v-if="scope.row.cardType === 4">P{{scope.row.priority}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="maintain"
        label="维护人">
      </el-table-column>
      <el-table-column
        prop="caseType"
        label="用例类型">
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: ['data', 'caseLibraryList'],
  data () {
    return {
      productId: this.$route.params.id,
      tableHeight: null,
      tableTotalRow: 0,
      isSelectAll: false,
      caseIdList: [],
      complyList: [], // 维护人列表
      selectLoading: false,
      comply: '',
      moveToCaseLibrary: {
        id: this.$route.params.id,
        name: this.$route.params.name
      },
      caseTreeData: [],
      moveToGroup: {
        id: '',
        path: '',
        pathName: ''
      },
      bodyType: 'default',
      defaultProps: { // 用例树配置
        children: 'children',
        label: function (data) {
          return data.name
        }
      }
    }
  },
  computed: {
    priorityList () {
      return this.$store.state.allEnum.priority
    },
    roleId () {
      return this.$store.state.userInfo.roleId
    }
  },
  mounted () {
    this.tableHeight = this.$refs['component-tree-table'].offsetHeight
    window.onresize = () => {
      this.tableHeight = this.$refs['component-tree-table'].offsetHeight
    }
  },
  methods: {
    changeBodyType (type) {
      this.bodyType = type
      if (type === 'group') {
        this.$nextTick(() => {
          this.$refs.caseTree.filter(4)
        })
      }
    },
    // 移动or复制-选择用例库
    selectCaseLibrary (item) {
      this.moveToCaseLibrary.id = item.id
      this.moveToCaseLibrary.name = item.name
      this.getCaseTreeData()
      this.bodyType = 'default'
    },
    handleNodeClick (data) {
      this.moveToGroup = data
      this.bodyType = 'default'
    },
    // 筛去用例
    caseTreeFilterNode (value, data) {
      return data.cardType !== value
    },
    closePopper () {
      document.querySelector('#app').click()
    },
    getCaseTreeData () {
      this.$service.getTreeByProductId({ productId: this.moveToCaseLibrary.id }).then((res) => {
        this.caseTreeData = res.data
      })
    },
    // 搜索维护人
    remoteMethod (query) {
      if (query !== '') {
        this.selectLoading = true
        this.$service.getUserByName({ name: query }).then(res => {
          this.complyList = res.data
          this.selectLoading = false
        })
      } else {
        this.complyList = []
      }
    },
    // 批量设置维护人
    setComply () {
      this.$service.bathOperatorCase({
        productId: this.productId,
        caseIdList: this.caseIdList,
        operatorType: 1,
        maintain: this.comply
      }).then(() => {
        this.$message.success('设置维护人成功')
        this.$emit('on-save-sucess')
        this.closePopper()
      })
    },
    // 批量设置用例等级
    setPriority (id) {
      this.$service.bathOperatorCase({
        productId: this.productId,
        caseIdList: this.caseIdList,
        operatorType: 2,
        priority: id
      }).then(() => {
        this.$message.success('修改用例等级成功')
        this.$emit('on-save-sucess')
        this.closePopper()
      })
    },
    // 批量移动用例
    moveCase () {
      this.$service.bathOperatorCase({
        productId: this.moveToCaseLibrary.id,
        caseIdList: this.caseIdList,
        operatorType: 3,
        path: this.moveToGroup.path,
        sectionId: this.moveToGroup.id
      }).then(() => {
        this.$message.success('移动用例成功')
        this.$emit('on-save-sucess')
        this.closePopper()
      })
    },
    // 批量复制用例 - TODO可以与移动复用
    copyCase () {
      this.$service.bathOperatorCase({
        productId: this.moveToCaseLibrary.id,
        caseIdList: this.caseIdList,
        operatorType: 4,
        path: this.moveToGroup.path,
        sectionId: this.moveToGroup.id
      }).then(() => {
        this.$message.success('复制用例成功')
        this.$emit('on-save-sucess')
        this.closePopper()
      })
    },
    // 批量删除用例
    deleteCase () {
      this.$service.bathDeleteCase({
        productId: this.productId,
        caseIdList: this.caseIdList
      }).then(() => {
        this.$message.success('删除用例成功')
        this.$emit('on-save-sucess')
        this.closePopper()
      })
    },
    // 新增用例
    addCase (data) {
      this.$emit('on-add-case', data)
    },
    // 单击行：文件夹收缩展开、用例编辑
    rowClick (row) {
      if (row.cardType === 4) {
        this.$emit('on-edit-case', row)
      } else {
        this.$refs.treeTable.toggleRowExpansion(row)
      }
    },
    // 行为用例时合并列
    spanMethod ({ row, columnIndex }) {
      if (row.cardType === 3) {
        if (columnIndex === 2) {
          return [1, 3]
        }
      }
    },
    // 表格行样式
    rowStyle ({ row }) {
      if (row.cardType !== 4) {
        return {
          color: '#8c8c8c'
        }
      }
    },
    rowClassName ({rowIndex}) {
      this.tableTotalRow = rowIndex + 1
    },
    initSelect () {
      this.isSelectAll = false
    },
    // 表头复选框操作
    selectAll () {
      this.isSelectAll = !this.isSelectAll
      console.log(this.isSelectAll);
      this.data.forEach(item => {
        this.setChildChecked(item, this.isSelectAll)
      })
    },
    // 复选框变化，取出选中case id
    selectionChange (selection) {
      this.caseIdList = []
      selection.forEach(item => {
        if (item.cardType === 4) {
          this.caseIdList.push(item.id)
        }
      })
      if (selection.length === this.tableTotalRow) {
        this.isSelectAll = true
      }
    },
    // 单个选择
    select (selection, row) {
      if (!selection.includes(row)) {
        this.isSelectAll = false
      }
      this.setChildChecked(row, selection.includes(row))
      if (row.parentId !== '0') {
        let parentIds = row.path.split('/').slice(1)
        this.setParentChecked(this.data, parentIds, selection.includes(row))
      }
    },
    // 单个选择对子节点处理
    setChildChecked (row, bool) {
      if (row.children) {
        row.children.forEach(item => {
          this.$nextTick(() => {
            this.$refs.treeTable.toggleRowSelection(item, bool)
          })
          this.setChildChecked(item, bool)
        })
      }
    },
    // 单个选择对父节点处理
    setParentChecked (data, parentIds, bool) {
      data.forEach(item => {
        parentIds.forEach(parentId => {
          if (item.id === parentId && item.cardType === 3) {
            if (!bool) { // 取消本行选中 - 取消父选中
              this.$refs.treeTable.toggleRowSelection(item, bool)
              this.setParentChecked(item.children, parentIds, bool)
            } else { // 选中本行 - 查询同层是否全部选中
              // 全选中 - 父选中
              this.$refs.treeTable.toggleRowSelection(item, bool)
              this.setParentChecked(item.children, parentIds, bool)
              // 未全选中 - 父不选中
              // TODO。。。
            }
          }
        })
      })
    }
  }
}
</script>