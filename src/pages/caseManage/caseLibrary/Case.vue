<style lang="scss">
.page-case {
  &-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    text-align: center;
    box-shadow: 0 0 8px 0 rgba(0,0,0,.1);
    &-title {
      float: left;
    }
  }
  &-main {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px 50px 0;
    background: #f5f5f5;
    overflow-y: auto;
    &-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      padding: 0 10px;
      &-right {
        cursor: pointer;
        color: #409EFF;
        .el-icon-circle-plus {
          margin-right: 5px;
        }
      }
    }
    &-list {
      .el-card {
        height: 120px;
        float: left;
        margin: 0 10px 20px;
        cursor: pointer;
        background: url('../../../assets/images/file.png') no-repeat;
        background-size: 133px 37px;
        background-repeat: no-repeat;
        background-position: bottom;
        background-color: #fff;
        .card-title {
          display: flex;
          justify-content: space-between;
          &-btn {
            display: none;
            i {
              font-size: 16px;
              margin-left: 10px;
            }
            .el-icon-edit {
              color: #409eff;
            }
            .el-icon-delete {
              color: #f56c6c;
            }
          }
        }
        &:hover {
          transform: translateY(-10px);
          box-shadow: 0 7px 21px rgba(56,56,56,0.15);
          .card-title .card-title-btn {
            display: inline-block;
          }
        }
        .el-card__body {
          padding-top: 0;
          .intro {
            -webkit-line-clamp: 3;
            color: #8c8c8c;
            font-size: 12px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
          }
        }
      }
      .add-card {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        color: #bfbfbf;
        background-image: none;
        .el-card__body {
          padding: 0;
          .el-icon-circle-plus {
            font-size: 30px;
          }
          p {
            margin: 10px 0 0;
          }
        }
        &:hover {
          color: #1b9aee;
        }
      }
    }
    .el-dialog__wrapper {
      .el-dialog__body {
        .el-input {
          margin: 30px 0 16px;
        }
      }
      .el-dialog__footer {
        padding-top: 0;
        .el-button {
          width: 100%;
        }
      }
    }
  }
}
</style>
<template>
  <div class="page page-case">
    <header class="page-case-header">
      <div class="page-case-header-title">测试用例</div>
      <el-input v-model="keyWord" placeholder="搜索测试库（按Enter搜索）" @keyup.enter.native="search" style="width: 300px"></el-input>
    </header>
    <main class="page-case-main" v-loading="loading">
      <div class="page-case-main-info">
        <div class="page-case-main-info-left">所有用例库 · {{caseLibraryList.length}}</div>
        <div v-if="superPermission" class="page-case-main-info-right" @click="handleShowDialog('add')">
          <i class="el-icon-circle-plus"></i>创建用例库
        </div>
      </div>
      <div class="page-case-main-list">
        <el-card v-for="item in caseLibraryList" :key="item.id" :style="{width: cardWidth}" @click.native="goCaseDetails(item)">
          <p class="card-title">
            <span>{{item.name}}</span>
            <span class="card-title-btn">
              <i class="el-icon-edit" @click.stop="handleShowDialog('edit', item)"></i>
              <i
                class="el-icon-delete"
                v-if="superPermission"
                @click.stop="delCaseLibraryList(item.id)"></i>
            </span>
          </p>
          <p class="intro">{{item.remark}}</p>
        </el-card>
        <el-card v-if="superPermission" class="add-card" :style="{width: cardWidth}" @click.native="handleShowDialog('add')">
          <i class="el-icon-circle-plus"></i>
          <p>创建用例库</p>
        </el-card>
      </div>
      <el-dialog
        :title="handleType === 'add' ? '创建用例库' : '编辑用例库'"
        :visible.sync="showDialog"
        center
        width="390px">
        <div style="text-align: center;">
          <img src="../../../assets/images/collections.png" alt="img" width="72px" height="72px">
          <el-input v-model="name" placeholder="用例库名称（必填）"></el-input>
          <el-input
            v-model="remark"
            type="textarea"
            :rows="2"
            placeholder="用例库简介（选填）"></el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button
            :disabled="dialogButtonDis"
            type="primary"
            @click="addOrUpdateCaseLibrary">
            {{handleType === 'add' ? '完成并创建' : '完成并保存'}}
          </el-button>
        </span>
      </el-dialog>
    </main>
  </div>
</template>
<script>
export default {
  data () {
    return { 
      keyWord: '',
      loading: false,
      caseLibraryList: '',
      cardWidth: null,
      showDialog: false,
      id: '',
      name: '',
      remark: '',
      handleType: ''
    }
  },
  computed: {
    // 校验确认按钮可用性
    dialogButtonDis () {
      return this.name === ''
    },
    superPermission () {
      return this.$store.state.permission.includes('/case/manage')
    }
  },
  mounted () {
    this.calcCardWidth()
    window.onresize = () => {
      this.calcCardWidth()
    }
    this.getCaseLibraryList()
  },
  methods: {
    // 搜索测试库
    search () {
      this.getCaseLibraryList()
    },
    // 获取用例库列表
    getCaseLibraryList () {
      this.loading = true
      this.$service.getCaseLibraryList({ keyWord: this.keyWord }).then(res => {
        this.caseLibraryList = res.data
      }).finally(() => {
        this.loading = false
      })
    },
    // 前往用例详情页
    goCaseDetails (item) {
      this.$router.push(`/caseDetails/${item.id}/${item.name}`)
    },
    // 显示新增/编辑弹框
    handleShowDialog (type, value) {
      this.handleType = type
      if (type === 'edit') {
        this.id = value.id
        this.name = value.name
        this.remark = value.remark
      }
      this.showDialog = true
    },
    // 新增/编辑用例库
    addOrUpdateCaseLibrary () {
      let data = {
        id: this.id,
        name: this.name,
        remark: this.remark
      }
      this.$service.addOrUpdateCaseLibrary(this.handleType, data).then(() => {
        this.$message.success(`${this.handleType === 'add' ? '新增' : '修改'}成功`)
        this.id = ''
        this.name = ''
        this.remark = ''
        this.showDialog = false
        this.getCaseLibraryList()
      })
    },
    // 删除用例库
    delCaseLibraryList (id) {
      this.$msgbox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.delCaseLibraryList({ id }).then(() => {
          this.$message.success('删除成功')
          this.getCaseLibraryList()
        })
      })
    },
    // 计算动态卡片宽度
    calcCardWidth () {
      let cardNum = Math.round(document.querySelector('.page-case-main').clientWidth / 250)
      this.cardWidth = `calc((100% - ${cardNum * 20}px) / ${cardNum})`
    }
  }
}
</script>