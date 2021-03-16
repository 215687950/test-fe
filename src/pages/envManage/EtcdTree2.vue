<style lang="scss">
.page-etcdTree {
  flex-direction: row;
  &-left {
    width: 350px;
    margin-right: 20px;
    display: flex;
    flex-direction: column;
    .search-bar {
      display: flex;
      margin-bottom: 10px;
    }
    .data-tree {
      flex: 1;
      overflow-y: auto;
      .custom-tree-node {
        width: 100%;
        height: 32px;
        line-height: 32px;
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: relative;
        padding-right: 28px;
        .el-icon-circle-close {
          font-size: 18px;
          color: #f00;
          position: absolute;
          top: 7px;
          right: 5px;
          display: none;
        }
        &:hover .el-icon-circle-close{
          display: block;
        }
      }
    }
  }
  &-right {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .info-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .el-form-item {
        margin-bottom: 10px;
      }
    }
    .editor-box {
      flex: 1;
      overflow: hidden;
      border: 1px solid #e5e5e5;
      display: flex;
      flex-direction: column;
      .handler-bar {
        display: flex;
        justify-content: space-between;
        .el-radio-button__inner {
          border-radius: 0;
          border: none;
          border-right: 1px solid #e5e5e5;
        }
        .el-button {
          width: 71px;
          border-radius: 0;
          border: none;
          border-left: 1px solid #e5e5e5;
        }
      }
      .editor-box {
        flex: 1;
        overflow: hidden;
        .ace_editor {
          border-top: 1px solid #e5e5e5;
        }
      }
    }
  }
}
</style>
<template>
  <div class="page page-etcdTree">
    <section class="page-etcdTree-left">
      <div class="search-bar">
        <el-select
          v-model="selectedEnv"
          placeholder="请选择环境"
          @change="getKeyTreeByEnv"
          style="margin-right:10px"
          disabled
        >
          <el-option
            v-for="item in envList"
            :key="item.id"
            :label="item.completeName"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-input
          placeholder="输入关键字enter过滤"
          v-model="filterText"
          clearable
          @keyup.enter.native="handleSearch">
        </el-input>
      </div>
      <el-tree
        ref="tree"
        class="data-tree"
        v-loading="treeLoading"
        :data="treeData"
        node-key="completePath"
        :props="{ children: 'children', label: 'name' }"
        :default-expanded-keys="['/']"
        :expand-on-click-node="false"
        :filter-node-method="filterNode"
        @node-click="nodeClick">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <i class="el-icon-folder" v-if="data.children.length"></i>
          <i class="el-icon-document" v-else></i>
          <span :title="data.name" style="margin-left:6px">{{ data.name || '/' }}</span>
          <i class="el-icon-circle-close" @click.stop="delEtcdClick(node, data)"></i>
        </span>
      </el-tree>
    </section>
    <section class="page-etcdTree-right">
      <div class="info-bar">
        <div style="color:#666">当前路径：{{currentKey.completePath}}</div>
        <div>
          <el-button
            type="success"
            size="small"
            icon="el-icon-plus"
             @click="addEtcdClick">新增</el-button>
          <el-dialog
            class="add-etcd-dialog big-dialog"
            title="新增配置"
            :visible.sync="isShowAddEtcd"
            top="50px"
            width="51%"
            @close="resetAddForm">
            <el-form v-model="addData" label-width="85px">
              <el-form-item label="环境">
                <el-select
                  v-model="addData.targetEnv"
                  size="small"
                  multiple
                  clearable
                  placeholder="请选择环境"
                  style="width:100%"
                  disabled>
                  <el-option
                    v-for="item in envList"
                    :key="item.id"
                    :label="item.completeName"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="key">
                <el-input v-model="addData.keyName" placeholder="请输入keyName" size="small"></el-input>
              </el-form-item>
              <el-form-item label="操作人">
                <el-input v-model="addData.demand" placeholder="请输入需求方" size="small"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input v-model="addData.remark" placeholder="请输入备注" size="small"></el-input>
              </el-form-item>
              <el-form-item label="配置内容">
                <el-input v-model="addData.setting" type="textarea" :autosize="{ minRows: 20, maxRows: 20}" ></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" size="small" @click="confirmAdd" :loading="confirmLoading">确 定</el-button>
            </span>
          </el-dialog>
        </div>
      </div>
      <div class="editor-box" v-loading="editorLoading">
        <div class="handler-bar">
          <el-radio-group v-model="viewType" size="small">
            <el-radio-button label="text" ></el-radio-button>
            <el-radio-button label="json"></el-radio-button>
            <el-radio-button label="yaml"></el-radio-button>
            <el-radio-button label="toml"></el-radio-button>
          </el-radio-group>
          <div>
            <el-button v-if="!editFlag" type="info" icon="el-icon-edit" plain @click="edit">编辑</el-button>
            <el-button-group v-else>
              <el-button type="info" icon="el-icon-check" plain :loading="saveEditLoading" @click="saveEdit">保存</el-button>
              <el-button type="info" icon="el-icon-close" plain @click="cancelEdit">取消</el-button>
            </el-button-group>
          </div>
        </div>
        <div class="editor-box">
          <editor
            ref="myEditor"
            v-model="setting"
            :lang="viewType"
            :options="{
              showPrintMargin: false,
              enableBasicAutocompletion: true,
              enableSnippets: true,
              enableLiveAutocompletion: true
            }"
            @init="editorInit"
          ></editor>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  components: {
    editor: require('vue2-ace-editor')
  },
  data () {
    return {
      selectedEnv: '',
      envList: [],
      filterText: '',
      treeLoading: false,
      treeData: [],
      editorLoading: false,
      currentKey: {},
      viewType: 'text',
      editFlag: false,
      saveEditLoading: false,
      setting: '',
      settingCopy: '',
      isShowAddEtcd: false,
      addData: {
        targetEnv: [],
        keyName: '',
        demand: this.$store.state.userInfo.name,
        remark: '',
        setting: ''
      },
      confirmLoading: false
    }
  },
  created () {
    this.getEtcdEnv()
  },
  methods: {
    delEtcdClick (node, data) {
      this.$msgbox.confirm('确认删除?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.deleteTemplateKeyOnTree({
          env: this.selectedEnv,
          targetEnv: [this.selectedEnv],
          keyName: data.completePath,
          keyNameList: [data.completePath]
        }).then(() => {
          this.$message.success('删除成功')
          const parent = node.parent
          const children = parent.data.children || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
        })
      })
    },
    edit () {
      this.editFlag = true
      this.settingCopy = this.setting
      this.editorInit(this.$refs.myEditor.editor)
    },
    saveEdit () {
      this.saveEditLoading = true
      this.$service.updateTemplateKeyOnTree({
        keyName: this.currentKey.completePath,
        targetEnv: [this.selectedEnv],
        setting: this.setting,
        demand: this.$store.state.userInfo.name,
        remark: ''
      }).then(() => {
        this.$message.success('配置修改成功')
        this.editFlag = false
        this.editorInit(this.$refs.myEditor.editor)
      }).finally(() => {
        this.saveEditLoading = false
      })
    },
    cancelEdit() {
      this.editFlag = false
      this.setting = this.settingCopy
      this.editorInit(this.$refs.myEditor.editor)
    },
    addEtcdClick () {
      this.envList.forEach(item => {
        this.addData.targetEnv.push(item.id)
      })
      let curPath = this.currentKey.completePath
      this.addData.keyName = this.currentKey.name ? curPath + '/' : curPath
      this.isShowAddEtcd = true
    },
    resetAddForm () {
      this.addData = {
        targetEnv: [],
        keyName: '',
        demand: this.$store.state.userInfo.name,
        remark: '',
        setting: ''
      }
    },
    confirmAdd () {
      this.confirmLoading = true
      this.$service.addTemplateKeyOnTree(this.addData).then(() => {
        this.$message.success('增加配置成功')
        this.getKeyTreeByEnv()
        this.isShowAddEtcd = false
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    editorInit(ed) {
      require("brace/ext/language_tools")
      require("brace/ext/emmet")
      require("brace/theme/chrome")
      require("brace/mode/text")
      require("brace/mode/yaml")
      require("brace/mode/json")
      require("brace/mode/toml")
      ed.setReadOnly(!this.editFlag)
    },
    // 获取环境
    getEtcdEnv () {
      this.$service.getTemplateEtcdEnv().then(res => {
        this.envList = res.data
        this.selectedEnv = res.data[0].id
        this.getKeyTreeByEnv()
      })
    },
    // 根据环境获取tree数据
    getKeyTreeByEnv () {
      this.currentKey = {}
      this.setting = ''
      this.treeData = []
      this.treeLoading = true
      this.$service.getTemplateKeyTreeByEnv({ env: this.selectedEnv }).then(res => {
        this.treeData = res.data
        if (this.treeData.length) {
          this.$nextTick(() => {
            this.$refs.tree.setCurrentNode(this.treeData[0])
            this.currentKey = this.treeData[0]
            this.handleSearch()
          })
        }
      }).finally(() => {
        this.treeLoading = false
      })
    },
    // 关键字搜索
    handleSearch () {
      this.$refs.tree.filter(this.filterText)
    },
    filterNode(value, data) {
      if (!value) return true
      return (data.name.indexOf(value) !== -1 || data.completePath.indexOf(value) !== -1)
    },
    nodeClick (value) {
      this.editFlag = false
      this.setting = ''
      this.currentKey = value
      this.editorLoading = true
      this.$service.getTemplateSettingByEnvAndKey({
        env: this.selectedEnv,
        keyName: this.currentKey.completePath,
      }).then(res => {
        this.setting = res.data
      }).finally(() => {
        this.editorLoading = false
      })
    }
  }
}
</script>