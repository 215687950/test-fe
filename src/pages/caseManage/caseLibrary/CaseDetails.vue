<style lang="scss">
.page-case-details {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  &-left {
    width: 300px;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #dcdfe6;
    .el-breadcrumb {
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      .el-icon-arrow-right {
        margin-right: 0;
      }
      .handler-popper-reference {
        display: flex;
        align-items: center;
        span {
          display: inline-block;
          max-width: 180px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
    .case-tree-box {
      flex: 1;
      margin-top: 20px;
      overflow-y: auto;
      position: relative;
      .tree-root-node-btn {
        position: absolute;
        right: 12px;
        top: 6px;
        z-index: 2;
        padding: 2px 0 2px 5px;
        display: flex;
        i.el-icon-circle-plus {
          font-size: 20px;
          margin-left: 5px;
          color: #409EFF;
          cursor: pointer;
        }
        .expand-all-btn {
          color: #606266;
          cursor: pointer;
          &:hover {
            background: #ecf5ff;
          }
          .iconfont {
            font-size: 14px;
          }
        }
      }
      .el-tree {
        .el-tree-node__content {
          position: relative;
          height: 36px;
          .custom-tree-node {
            width: 100%;
            padding-right: 10px;
            display: block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            .case-count {
              padding: 0 5px;
              height: 20px;
              background: rgba(83, 168, 255, .2);
              border-radius: 10px;
              font-size: 12px;
            }
          }
          &:hover {
            .node-handle-btn {
              display: block;
            }
          }
          .node-handle-btn {
            position: absolute;
            top: 8px;
            right: 4px;
            background: #ecf5ff;
            display: none;
            i {
              font-size: 16px;
              color: #8c8c8c;
              &:hover {
                color: #409EFF
              }
            }
            i.el-icon-circle-plus-outline {
              font-size: 18px;
              margin-left: 1px
            }
            i.el-icon-more {
              margin: 0 12px;
            }
          }
        }
        .el-tree-node:focus > .el-tree-node__content {
          background: #ecf5ff;
        }
      }
      .case-tree-popover-reference {
        display: inline-block;
      }
      .copy-dialog {
        height: 100%;
        overflow: hidden;
        .el-dialog {
          max-height: calc(100% - 40px);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: flex;
          flex-direction: column;
          margin: 0 !important;
          .el-dialog__body {
            flex: 1;
            padding: 0 0 63px;
            overflow: auto;
            .el-tree .el-tree-node__content {
              height: 30px;
            }
          }
          .el-dialog__footer {
            width: 100%;
            padding: 10px 20px;
            text-align: center;
            position: absolute;
            bottom: 0;
            background: #fff;
            border-top: 1px solid #eee;
          }
        }
      }
    }
    .moveBtn{
      height: 100%;
      width: 5px;
      position: absolute;
      right: 0px;
      top: 0;
      cursor: col-resize;
      background-color: rgba(0, 0, 0, .1);
    }
  }
  &-right {
    flex: 1;
    min-width: 650px;
    height: 100%;
    background: #f5f5f5;
    padding: 10px;
    display: flex;
    flex-direction: column;
    &-header {
      margin-bottom: 10px;
      padding: 5px 10px;
      background: #fff;
      position: relative;
      display: flex;
      justify-content: space-between;
      .header-left {
        line-height: 30px;
      }
      .header-middle {
        display: inline-block;
        .more-btn {
          color: #8c8c8c;
          font-weight: normal;
          padding-right: 0;
          :hover {
            color: #66b1ff;
          }
        }
      }
      .header-right {
        display: flex;
        align-items: center;
        &-btn {
          color: #8c8c8c;
          margin-right: 20px;
          cursor: pointer;
          &:hover {
            color: #409EFF;
          }
          .iconfont {
            vertical-align: middle;
            margin-right: 5px;
          }
        }
        .el-button {
          padding: 7px 10px;
        }
      }
    }
    &-main {
      flex: 1;
      padding: 10px;
      background: #fff;
    }
  }
}
</style>
<template>
  <div class="page page-case-details">
    <div class="page-case-details-left" id="silderLeft">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/case' }">用例库</el-breadcrumb-item>
        <el-breadcrumb-item>
          <PopoverSelect className="case-breadcrumb-popover" :reference="name" :list="caseLibraryList" @on-select="caseChange"></PopoverSelect>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="case-tree-box" v-loading="treeLoading">
        <div class="tree-root-node-btn">
          <div class="expand-all-btn" @click="handleExpandedAll">
            {{isExpandedAll ? '收起' : '展开'}}<i class="iconfont" :class="isExpandedAll ? 'iconzhankai' : 'iconshouqi'"></i>
          </div>
          <PopoverInTree className="case-tree-popover" :parentId="0" @refresh-tree="rootAddSucess">
            <div class="case-tree-popover-reference" @click.stop="stop"><i class="el-icon-circle-plus"></i></div>
          </PopoverInTree>
        </div>
        <el-tree
          ref="caseTree"
          :data="caseTreeData"
          current-node-key="0"
          :expand-on-click-node="false"
          :highlight-current="true"
          :props="defaultProps"
          node-key="virtualId"
          :filter-node-method="caseTreeFilterNode"
          draggable
          :allow-drag="allowDrag"
          :allow-drop="allowDrop"
          @node-drop="dragEnd"
          @node-click="handleNodeClick"
          @node-expand="handleExpanded"
          @node-collapse="handleCollapse">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <el-input
              id="editInput"
              v-if="data.id === editNode.id"
              v-model="data.name"
              @blur="updateGroup(data)"
              @keyup.enter.native="$event.target.blur"></el-input>
            <!-- <el-tooltip v-else class="item" effect="dark" :content="node.label" placement="top-start"> -->
            <span v-else>{{ node.label }} · <span class="case-count">{{ data.caseCount }}</span></span>
            <!-- </el-tooltip> -->
            <span class="node-handle-btn" v-if="data.id !== '0' && data.id !== editNode.id">
              <PopoverInTree v-if="node.level < 6" className="case-tree-popover" :parentId="data.id" @refresh-tree="getCaseTree">
                <div class="case-tree-popover-reference" @click.stop="stop"><i class="el-icon-circle-plus-outline"></i></div>
              </PopoverInTree>
              <el-dropdown trigger="click" @command="handleCommand">
                <span class="el-dropdown-link" @click.stop="stop">
                  <i class="el-icon-more"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item icon="el-icon-edit-outline" :command="{ type: 'xmind', data: data}">xmind模式</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-edit-outline" :command="{ type: 'edit', data: data}">修改</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-document-copy" :command="{ type: 'copy', data: data}">复制</el-dropdown-item>
                  <el-dropdown-item icon="el-icon-delete" :command="{ type: 'delete', data: data}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </span>
          </span>
        </el-tree>
        <el-dialog
          class="copy-dialog"
          title="选择要复制到的分组"
          center
          :visible.sync="copyDialogVisible"
          width="500px">
          <el-tree
            ref="caseTree2"
            :data="caseTreeData"
            default-expand-all
            current-node-key="0"
            :expand-on-click-node="false"
            :highlight-current="true"
            :props="defaultProps2"
            node-key="virtualId"
            :filter-node-method="caseTreeFilterNode"
            @node-click="handleNodeClick2"></el-tree>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="copyGroup">确 定</el-button>
          </span>
        </el-dialog>
      </div>
      <div class="moveBtn" v-move></div>
    </div>
    <div class="page-case-details-right">
      <header class="page-case-details-right-header">
        <div class="header-left">
          <div v-if="Object.keys(currentNode).length">{{currentNode.name + ' · ' + currentNode.caseCount}}</div>
        </div>
        <div class="header-middle">
          <el-input
            v-model="searchValue"
            @keyup.enter.native="handleSearch"
            placeholder="输入搜索词（按Enter搜索）"
            clearable
            style="width: 215px"></el-input>
          <el-popover
            placement="bottom-end"
            width="280"
            trigger="click">
            <div>
              <label style="width: 56px; display:inline-block; text-align:right; margin-right:6px;">维护人</label>
              <el-select
                v-model="maintainList"
                size="small"
                multiple
                filterable
                remote
                reserve-keyword
                :remote-method="remoteMethod"
                :loading="selectLoading">
                <el-option
                  v-for="item in complyPersons"
                  :key="item.value"
                  :label="item.name"
                  :value="item.name">
                </el-option>
              </el-select>
            </div>
            <div style="margin:10px 0;">
              <label style="width: 56px; display:inline-block; text-align:right; margin-right:6px;">用例类型</label>
              <el-select v-model="caseTypeList" multiple size="small">
                <el-option v-for="item in caseType" :key="item.id" :value="item.id" :label="item.value"></el-option>
              </el-select>
            </div>
            <div>
              <el-button type="primary" icon="el-icon-search" style="width: 48%;" @click="handleSearch">搜索</el-button>
              <el-button style="width: 48%;" @click="clearSearch">清空</el-button>
            </div>
            <el-button slot="reference" type="text" class="more-btn">更多<i class="el-icon-caret-bottom"></i></el-button>
          </el-popover>
        </div>
        <div class="header-right">
          <span class="header-right-btn" @click="showImportDialog = true"><i class="iconfont icondaoru"></i>导入</span>
          <el-dialog :visible.sync="showImportDialog" title="选择导入类型" width="350px">
            <el-radio-group v-model="importType">
              <el-radio :label="1">CSV导入</el-radio>
              <el-radio :label="2">XMind导入</el-radio>
            </el-radio-group>
            <div v-if="importType === 2" style="margin-top: 20px;">
              <span style="margin-right:10px">用例类型</span>
              <el-select v-model="importCaseType" size="small">
                <el-option v-for="item in caseType" :key="item.id" :value="item.value" :label="item.value"></el-option>
              </el-select>
            </div>
            <div style="margin-top: 20px;color:#ccc">
              <span>注意：</span>
              <span style="display: block;">分组名 不能超过15个字符</span>
              <span style="display: block;">用例名 不能超过30个字符</span>
              <br>
              <span>xmind导入时：</span>
              <span style="display: block;">会忽略 以#开头的分组下的用例、以#开头的用例</span>
            </div>
            <div slot="footer">
              <el-upload
                action="default"
                :accept="importType === 1 ? '.csv' : '.xmind'"
                :show-file-list="false"
                :http-request="beforeUpload">
                <el-button :loading="uploadLoading" type="primary" style="width:310px">{{uploadLoading ? '正在上传中。。。' : '选择文件'}}</el-button>
              </el-upload>
            </div>
          </el-dialog>
          <el-dialog class="big-dialog" center :visible.sync="showCheckErrorDialog" title="文件格式有误" width="80%">
            <ol>
              <li v-for="item in checkErrorList" :key="item" style="margin-bottom:10px">{{item}}</li>
            </ol>
          </el-dialog>
          <el-dropdown trigger="click" @command="exportCase">
            <span class="el-dropdown-link">
              <span class="header-right-btn"><i class="iconfont icondaochu"></i>导出</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="1">导出CSV</el-dropdown-item>
              <el-dropdown-item :command="2">导出XMind</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button type="primary" icon="el-icon-folder-add" @click="addCase(currentNode)">创建用例</el-button>
        </div>
      </header>
      <main class="page-case-details-right-main">
        <TreeTable
          ref="treeTableComp"
          :data="currentNode.children"
          :caseLibraryList="caseLibraryList"
          @on-add-case="addCase"
          @on-edit-case="editCase"
          @on-save-sucess="savaSucess"></TreeTable>
        <Drawer
          :visible="showDrawer"
          :drawerInitData="drawerInitData"
          @on-save-sucess="savaSucess"
          @on-close="drawerClose"></Drawer>
      </main>
    </div>
  </div>
</template>
<script>
import PopoverInTree from './components/PopoverInTree'
import TreeTable from './components/TreeTableNew'
import Drawer from './components/Drawer'
import PopoverSelect from '@/components/PopoverSelect'
export default {
  components: { PopoverSelect, PopoverInTree, TreeTable, Drawer },
  directives: {
    move(el) {
      el.onmousedown = function(e) {
        let page = document.getElementsByClassName('page-case-details')[0]
        page.style.userSelect = 'none'
        let init = e.clientX
        let parent = document.getElementById('silderLeft')
        let initWidth = parent.offsetWidth
        document.onmousemove = function(e) {
          let end = e.clientX
          let newWidth = end - init + initWidth
          parent.style.width = newWidth + 'px'
        }
        document.onmouseup = function() {
          document.onmousemove = document.onmouseup = null
          page.style.userSelect = 'auto'
        }
      }
    }
  },
  data () {
    return {
      id: this.$route.params.id,
      name: this.$route.params.name,
      caseLibraryList: [],
      treeLoading: false,
      isExpandedAll: true, // 是否全部展开
      defaultProps: { // 用例树配置
        children: 'children',
        label: function (data) {
          return data.name
        }
      },
      caseTreeData: [{ // 用例树数据
        id: '0',
        virtualId: '0',
        name: '全部用例',
        path: '0',
        pathName: '全部用例',
        caseCount: 0,
        children: []
      }],
      currentNode: {}, // 当前选中节点数据
      editNode: {}, // 编辑节点
      copyNode: {}, // 复制节点
      copyToNodeId: '',
      copyDialogVisible: false,
      defaultProps2: { // 用例树配置
        children: 'children',
        label: function (data) {
          return data.name
        }
      },
      complyPersons: [],
      selectLoading: false,
      maintainList: [], // 搜索条件 - 维护人
      caseTypeList: [], // 搜索条件 - 用例类型
      searchValue: '', // 搜索文本
      showImportDialog: false,
      showCheckErrorDialog: false,
      checkErrorList: [],
      uploadLoading: false,
      importType: 1,
      importCaseType: '功能测试',
      tableData: [],
      showDrawer: false,
      drawerInitData: {}
    }
  },
  computed: {
    caseType () {
      return this.$store.state.allEnum.caseType
    }
  },
  provide () {
    return {
      caseTreeData: this.caseTreeData
    }
  },
  created () {
    this.getCaseLibraryList()
    this.getCaseTree()
  },
  watch: {
    '$route' () {
      this.$router.go(0)
    }
  },
  methods: {
    // 导入
    beforeUpload (params) {
      this.uploadLoading = true
      let formData = new FormData()
      formData.append('file', params.file)
      formData.append('productId', this.id)
      formData.append('sectionId', this.currentNode.id)
      if (this.importType === 1) {
        this.$service.checkCsv(formData).then((res) => { // 检查
          if (res.data.length === 0) {
            this.$service.csvToCase(formData).then(() => {
              this.$message.success('上传成功')
              this.showImportDialog = false
              this.getCaseTree()
            }).finally(() => {
              this.uploadLoading = false
            })
          } else {
            this.uploadLoading = false
            this.showCheckErrorDialog = true
            this.checkErrorList = res.data
          } 
        }).catch(() => {
          this.uploadLoading = false
        })
      } else {
        formData.append('caseType', this.importCaseType)
        this.$service.checkXmind(formData).then((res) => { // 检查
          if (res.data.length === 0) {
            this.$service.xmindToCase(formData).then(() => {
              this.$message.success('上传成功')
              this.showImportDialog = false
              this.getCaseTree()
            }).finally(() => {
              this.uploadLoading = false
            })
          } else {
            this.uploadLoading = false
            this.showCheckErrorDialog = true
            this.checkErrorList = res.data
          } 
        }).catch(() => {
          this.uploadLoading = false
        })
      }
    },
    // 导出
    exportCase (type) {
      if (type === 1) {
        this.$service.exportCsv({ productId: this.id, sectionId: this.currentNode.id }).then(res => {
          window.open(res.data)
        })
      } else {
        this.$service.exportXmind({ productId: this.id, sectionId: this.currentNode.id }).then(res => {
          window.open(res.data)
        })
      }
    },
    // 阻止冒泡
    stop () {},
    // 新增、修改用例成功
    savaSucess () {
      this.getCaseTree()
    },
    drawerClose () {
      this.showDrawer = false
      this.drawerInitData = {}
    },
    // 下拉菜单操作
    handleCommand (command) {
      if (command.type === 'xmind') {
        window.open(`${window.origin}/mindEditor/#/${this.id}/${command.data.id}`, '_blank')
      } else if (command.type === 'delete') {
        this.deleteGroup(command.data)
      } else if (command.type === 'edit') {
        this.editNode = command.data
        this.$nextTick(() => {
          document.querySelector('#editInput').focus()
        })
      } else if (command.type === 'copy') {
        this.copyDialogVisible = true
        this.copyNode = command.data
        this.$nextTick(() => {
          this.$refs.caseTree2.filter(4)
        })
      }
    },
    handleNodeClick2 (data) {
      this.copyToNodeId = data.id
    },
    // 复制分组
    copyGroup () {
      this.$service.copyGroup({
        id: this.copyNode.id,
        parentId: this.copyToNodeId
      }).then(() => {
        this.$message.success('复制成功')
        this.getCaseTree()
        this.copyDialogVisible = false
      })
    },
    // 新增分组
    rootAddSucess (data) {
      this.caseTreeData[0].children.unshift({
        ...data,
        cardType: 3,
        caseCount: 0,
        caseType: '',
        children: [],
        maintain: '',
        path: `0/${data.id}`,
        pathName: data.name,
        priority: '',
        virtualId: `3_${data.id}`
      })
    },
    // 修改分组
    updateGroup (data) {
      this.$service.updateGroup({
        id: data.id,
        name: data.name,
        parentId: data.parentId,
        productId: data.productId
      }).then(() => {
        this.$message.success('修改成功')
        this.editNode = {}
      })
    },
    // 删除分组
    deleteGroup (data) {
      this.$msgbox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.deleteGroup({ id: data.id }).then(() => {
          this.$message.success('删除成功')
          this.deleteGroupNode(this.caseTreeData[0].children, data)
          // this.getCaseTree()
        })
      })
    },
    deleteGroupNode (treeData, data) {
      treeData.forEach((item, index) => {
        if (item.virtualId === data.virtualId) {
          console.log(item.virtualId, data.virtualId);
          treeData.splice(index, 1)
        } else {
          this.deleteGroupNode(item.children, data)
        }
      })
    },
    // 获取用例树
    getCaseTree () {
      this.treeLoading = true
      this.$service.getCaseTree({ productId: this.id }).then(res => {
        let totalCaseCount = 0
        res.data.forEach(item => {
          totalCaseCount += item.caseCount
        })
        this.$set(this.caseTreeData[0], 'children', res.data)
        this.$set(this.caseTreeData[0], 'caseCount', totalCaseCount)
        this.$set(this.caseTreeData[0], 'cardType', 3)
        this.$nextTick(() => {
          this.$refs.caseTree.filter(4)
          this.$refs.caseTree.setCurrentKey(this.$refs.caseTree.getCurrentNode().virtualId)
          this.currentNode = JSON.parse(JSON.stringify(this.$refs.caseTree.getCurrentNode()))
        })
        setTimeout(() => {
          // this.handleExpandedAll()
          let list = this.$refs.caseTree.store._getAllNodes()
            for (let i = 0; i < list.length; i++) {
              if (list[i].data.id === '0') {
                list[i].expanded = true
              } else {
                list[i].expanded = false
              }
            }
        }, 0)
      }).finally(() => {
        this.treeLoading = false
      })
    },
    // 筛去用例
    caseTreeFilterNode (value, data) {
      return data.cardType !== value
    },
    // 可拖动节点
    allowDrag (node) {
      return node.level === 2
    },
    dragEnd () {
      let list = []
      this.caseTreeData[0].children.forEach(item => {
        list.push(item.id)
      })
      this.$service.sortSection({ sectionSortList: list })
    },
    // 可插入节点
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.level !== 2) {
        return false
      } else {
        return type !== 'inner'
      }
    },
    // 点击树节点
    handleNodeClick (data) {
      if (data.virtualId === this.currentNode.virtualId) return
      this.$refs['treeTableComp'].initSelect()
      this.currentNode = JSON.parse(JSON.stringify(data))
    },
    // 搜索维护人
    remoteMethod (query) {
      if (query !== '') {
        this.selectLoading = true
        this.$service.getUserByName({ name: query }).then(res => {
          this.complyPersons = res.data
          this.selectLoading = false
        })
      } else {
        this.complyPersons = []
      }
    },
    // 清空更多搜索条件
    clearSearch () {
      this.caseTypeList = []
      this.maintainList = []
    },
    // 搜索
    handleSearch () {
      this.$service.filtrationCase({
        productId: this.id,
        sectionId: this.currentNode.id,
        caseTypeList: this.caseTypeList,
        maintainList: this.maintainList,
        title: this.searchValue
      }).then(res => {
        this.$set(this.currentNode, 'children', res.data)
      })
    },
    // 创建用例
    addCase (data) {
      console.log(data);
      if (data) {
        this.drawerInitData = {
          parentId: data.id,
          path: data.path,
          pathName: data.pathName
        }
      }
      this.drawerInitData.type = 'add'
      this.showDrawer = true
    },
    // 修改用例
    editCase (data) {
      data.type = 'edit'
      this.drawerInitData = data
      this.showDrawer = true
    },
    handleExpanded () {
      this.isExpandedAll = true
    },
    handleCollapse (obj) {
      if (obj.id === '0') {
        this.isExpandedAll = false
      }
    },
    // 展开、收起
    handleExpandedAll () {
      let list = this.$refs.caseTree.store._getAllNodes()
      for (let i = 0; i < list.length; i++) {
        if (list[i].data.id === '0') {
          list[i].expanded = true
        } else {
          list[i].expanded = !this.isExpandedAll
        }
      }
      this.isExpandedAll = !this.isExpandedAll
    },
    // 获取用例库列表
    getCaseLibraryList () {
      this.$service.getCaseLibraryList().then(res => {
        res.data.forEach(item => {
          item.value = item.name
        })
        this.caseLibraryList = res.data
      })
    },
    caseChange (data) {
      this.$router.replace(`/caseDetails/${data.id}/${data.name}`)
    }
  }
}
</script>