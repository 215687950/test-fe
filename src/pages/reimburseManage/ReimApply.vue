<style lang="scss">
.page-reimApply {
  .table-box {
    flex: 1;
    overflow: hidden;
  }
  .el-dialog__wrapper {
    .el-input,
    .el-date-editor.el-input,
    .el-select {
      width: 200px;
    }
  }
}
</style>
<template>
  <div class="page page-reimApply">
    <div class="page-search-bar">
      <el-input
        v-model="searchData.condition"
        placeholder="申请人关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"></el-input>
      <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
      <el-button type="success" size="small" icon="el-icon-plus" @click="showDialog.add = true">新增</el-button>
      <el-button type="info" size="small" icon="el-icon-plus" :disabled="remarkFormData.reimList.length === 0" @click="showDialog.remark = true">批量设置备注</el-button>
    </div>
    <div class="table-box" ref="table-box">
      <el-table
        v-loading="tableLoading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="#FFFAFA)"
        :data="tableData"
        :height="tableHeight"
        border
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center" width="60"></el-table-column>
        <el-table-column prop="commitName" label="申请人" align="center" width="100"></el-table-column>
        <el-table-column prop="reimDesc" label="申请描述" align="center" width="300"></el-table-column>
        <el-table-column label="金额统计" align="center" width="150">
          <template slot-scope="scope">
            <div>实际金额：{{ scope.row.actAmount }}</div>
            <div>手续费：{{ scope.row.fee }}</div>
          </template>
        </el-table-column>
        <el-table-column label="订单信息" align="center" width="300">
          <template slot-scope="scope">
            <div>
              报销单号：
              <div
                style="marginLeft:20px"
                v-for="item in scope.row.reimNums"
                :key="item">{{ item }}</div>
            </div>
            <div>
              订单描述：
              <div
                style="marginLeft:20px"
                v-for="item in scope.row.orderDescs"
                :key="item">{{ item }}</div>
            </div>
            <div>支付方式：{{ scope.row.payTypes }}</div>
            <div>支付环境：{{ scope.row.payEnvStr }}</div>
          </template>
        </el-table-column>
        <el-table-column label="申请图片" align="center" width="150">
          <template slot-scope="scope">
            <VuePictureSwipe :items="scope.row.allImageBeans || []"></VuePictureSwipe>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleEdit(scope.row)">修改</el-button>
            <br>
            <el-button type="danger" size="mini" @click="handleDel(scope.row)" style="margin:10px 0">删除</el-button>
            <br/>
            <el-button type="primary" size="mini" @click="addImages(scope.row)">
              上传图片
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" align="center" width="150">
          <template slot-scope="scope">
            <div>
              <el-input
                type="textarea"
                :disabled="scope.row.disRemark"
                style="width:120px"
                v-model="scope.row.remark"
                size="mini"
              ></el-input>
            </div>
            <div style="marginTop:10px">
              <el-button
                size="mini"
                type="primary"
                @click="changeDisRemark(scope.row)"
              >{{ scope.row.disRemark ? "修改" : "确认"}}</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="checkStatusStr" label="审核状态" align="center" width="100"></el-table-column>
        <el-table-column prop="auditorName" label="审核人" align="center" width="100"></el-table-column>
        <el-table-column prop="reimTime" label="报销时间" align="center" width="110"></el-table-column>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"></Pagination>
    <el-dialog title="批量备注"
      :visible.sync="showDialog.remark"
      center
      width="340px"
      @close="resetRemarkForm">
      <el-form ref="remarkFormData" :model="remarkFormData" :rules="remarkRules" :inline="true" label-width="80px">
        <el-form-item label="备注" prop="remark">
          <el-input v-model="remarkFormData.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.remark" type="primary" style="width: 100%" @click="remarkSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新增报销申请"
      :visible.sync="showDialog.add"
      center
      width="340px"
      @close="resetAddForm">
      <el-form ref="addFormData" :model="addFormData" :rules="addRules" :inline="true" label-width="80px">
        <el-form-item label="申请描述" prop="reimDesc">
          <el-input v-model="addFormData.reimDesc" placeholder="请输入申请描述"></el-input>
        </el-form-item>
        <el-form-item label="实际金额" prop="amount">
          <el-input v-model="addFormData.amount" type="number" placeholder="请输入实际金额"></el-input>
        </el-form-item>
        <el-form-item label="申请时间" prop="reimTime">
          <el-date-picker type="date" placeholder="选择日期" v-model="addFormData.reimTime"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.add" type="primary" style="width: 100%" @click="addSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑报销申请"
      :visible.sync="showDialog.edit"
      center
      width="340px"
      @close="resetEditForm">
      <el-form ref="editFormData" :model="editFormData" :rules="editRules" :inline="true" label-width="80px">
        <el-form-item label="申请描述" prop="reimDesc">
          <el-input v-model="editFormData.reimDesc" placeholder="请输入申请描述"></el-input>
        </el-form-item>
        <el-form-item label="实际金额" prop="amount">
          <el-input v-model="editFormData.amount" type="number" placeholder="请输入实际金额"></el-input>
        </el-form-item>
        <el-form-item label="报销单号" prop="reimNum">
          <el-input v-model="editFormData.reimNum" placeholder="请输入报销单号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.edit" type="primary" style="width: 100%" @click="editSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="上传图片"
      :visible.sync="showDialog.img"
      center
      width="415px"
      @close="resetImgData">
      <el-upload
        class="upload-demo"
        drag
        action="http://qa.wpt.la/vueApi/upload/newImg"
        :file-list="fileList"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :on-error="handleError"
        :before-remove="beforeRemove"
        :limit="3"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div
          style="marginTop:20px"
          class="el-upload__tip"
          slot="tip"
        >只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.img" type="primary" style="width: 100%" @click="imgSubmit">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import VuePictureSwipe from 'vue-picture-swipe'
import Pagination from '@/components/Pagination'
import mixin from '@/mixins/mixin'
export default {
  components: { VuePictureSwipe, Pagination },
  mixins: [mixin],
  data () {
    return {
      searchData: {
        page: 1,
        pageSize: 10,
        condition: ''
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      showDialog: {
        add: false,
        edit: false,
        remark: false,
        img: false
      },
      loading: {
        add: false,
        edit: false,
        remark: false,
        img: false
      },
      addFormData: {
        auditorId: '1117707375893831682',
        reimDesc: '',
        amount: '',
        reimTime: ''
      },
      addRules: {
        reimDesc: [
          { required: true, message: '请输入申请描述', trigger: 'blur' },
        ],
        amount: [
          { required: true, message: '请输入实际金额', trigger: 'blur' },
        ],
        reimTime: [
          { required: true, message: '请选择申请时间', trigger: 'change' },
        ]
      },
      editFormData: {
        id: '',
        reimDesc: '',
        amount: '',
        reimNum: '',
        checkStatus: ''
      },
      editRules: {
        reimDesc: [
          { required: true, message: '请输入申请描述', trigger: 'blur' },
        ],
        amount: [
          { required: true, message: '请输入实际金额', trigger: 'blur' },
        ],
        reimNum: [
          { required: true, message: '请输入报销单号', trigger: 'blur' },
        ]
      },
      remarkFormData: {
        reimList: [],
        remark: ''
      },
      remarkRules: {
        remark: [
          { required: true, message: '请输入备注', trigger: 'blur' },
        ]
      },
      imgData: {
        reimId: '',
        imgs: []
      },
      fileList: []
    }
  },
  methods: {
    // 批量备注
    handleSelectionChange (value) {
      if (value.length) {
        let list = []
        value.forEach(item => {
          list.push(item.id)
        })
        this.remarkFormData.reimList = list
      } else {
        this.remarkFormData.reimList = []
      }
    },
    remarkSubmit () {
      this.$refs['remarkFormData'].validate((valid) => {
        if (valid) {
          this.loading.remark = true
          this.$service.batchUpdateRemark(this.remarkFormData).then(() => {
            this.$message.success('批量更新成功')
            this.showDialog.remark = false
            this.getTableData()
          }).finally(() => {
            this.loading.remark = false
          })
        }
      })
    },
    resetRemarkForm () {
      this.$refs['remarkFormData'].resetFields()
    },
    // 删除
    handleDel (row) {
      this.$msgbox.confirm('是否确认删除当前报销单?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.reimapplyDel({ reimId: row.id }).then(() => {
          this.$message.success('删除成功')
          this.getTableData()
        })
      })
    },
    // 上传图片
    addImages (row) {
      this.imgData.reimId = row.id
      this.showDialog.img = true
    },
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.$message.success('文件：' + file.name + '上传成功')
      } else {
        this.$message.error(file.name + '上传失败')
        fileList.pop(file)
      }
      this.fileList = fileList
    },
    handleError(err, file) {
      this.$message.error('文件：' + file.name + '上传失败')
    },
    handleRemove(file) {
      let index = this.fileList.findIndex(item => item.uid === file.uid)
      this.fileList.splice(index, 1)
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    imgSubmit () {
      if (this.fileList.length == 0) {
        this.$message.error('图片为空')
        return
      }
      this.fileList.forEach(item =>
        this.imgData.imgs.push({
          originPath: item.response.data.originPath,
          thumbPath: item.response.data.thumbPath,
          width: item.response.data.width,
          height: item.response.data.height
        })
      )
      this.$service.reimUpdateImages(this.imgData).then(() => {
        this.$message.success('保存成功')
        this.getTableData()
      }).finally(() => {
        this.showDialog.img = false
      })
    },
    resetImgData () {
      this.imgData = { reimId: '', imgs: [] }
    },
    // 切换备注输入状态
    changeDisRemark(row) {
      if (!row.disRemark) {
        this.$service.updateReimRemark({ reimId: row.id, remark: row.remark }).then(() => {
          this.$message.success('修改成功')
        })
      }
      row.disRemark = !row.disRemark;
    },
    // 编辑
    handleEdit (row) {
      this.editFormData = {
        id: row.id,
        reimDesc: row.reimDesc,
        amount: row.amount,
        reimNum: '',
        checkStatus: row.checkStatusStr
      }
      this.showDialog.edit = true
    },
    editSubmit () {
      this.$refs['editFormData'].validate((valid) => {
        if (valid) {
          this.loading.edit = true
          this.$service.reimapplyUpdate(this.editFormData).then(() => {
            this.$message.success('修改成功')
            this.getTableData()
          }).finally(() => {
            this.loading.edit = false
            this.showDialog.edit = false
          })
        }
      })
    },
    resetEditForm () {
      this.$refs['editFormData'].resetFields()
    },
    // 新增
    addSubmit () {
      this.$refs['addFormData'].validate((valid) => {
        if (valid) {
          this.loading.add = true
          this.$service.reimapplyAdd(this.addFormData).then(() => {
            this.$message.success('新增成功')
            this.showDialog.add = false
            this.getTableData()
          }).finally(() => {
            this.loading.add = false
          })
        }
      })
    },
    resetAddForm () {
      this.$refs['addFormData'].resetFields()
    },
    // 获取表格数据
    getTableData () {
      this.tableLoading = true
      this.tableData = []
      this.$service.getAllReimApply(this.searchData).then(res => {
        this.tableData = res.data
        this.total = res.totalCount
      }).finally(() => {
        this.tableLoading = false
      })
    }
  }
}
</script>