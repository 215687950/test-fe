<style lang="scss">
.page-problemRecord {
  .page-search-bar {
    flex-wrap: wrap;
    margin-bottom: 0;
    .el-row {
      margin-bottom: 10px;
    }
    .el-date-editor {
      .el-range-separator,
      .el-range__icon,
      .el-range__close-icon {
        line-height: 22px;
      }
    }
  }
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
    .el-textarea__inner {
      width: 490px;
    }
  }
}
</style>
<template>
  <div class="page page-problemRecord">
    <div class="page-search-bar">
      <el-row>
        <label>关键字</label>
        <el-input
          v-model="searchData.keywords"
          placeholder="请输入名称/责任人"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="search"></el-input>
        <label>类型</label>
        <el-select v-model="searchData.problemType" clearable placeholder="请选择类型">
          <el-option v-for="item in problemTypeArray" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <label>状态</label>
        <el-select v-model="searchData.problemStatus" clearable placeholder="请选择状态">
          <el-option v-for="item in problemStatusArray" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-row>
      <el-row>
        <label>时间段</label>
        <el-date-picker
          v-model="times"
          type="datetimerange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd HH:mm:ss"
          :default-time="['00:00:00', '23:59:59']"
          align="right"
          style="margin-right:20px">
        </el-date-picker>
      </el-row>
      <el-row>
        <el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
        <el-button type="success" size="small" icon="el-icon-plus" @click="handleAdd">新增记录</el-button>
        <download-excel
          style="display:inline-block;margin-left:10px"
          :data="tableData"
          :fields="json_fields"
          name="problem.xls">
          <el-button type="warning" size="small" icon="el-icon-download" plain>导出excel</el-button>
        </download-excel>
      </el-row>
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
        style="width: 100%">
        <el-table-column prop="id" label="id" width="80" align="center"></el-table-column>
        <el-table-column prop="problemName" label="名称" align="center" min-width="1"></el-table-column>
        <el-table-column prop="problemContent" label="内容" show-overflow-tooltip align="center" min-width="2"></el-table-column>
        <el-table-column prop="problemUser" label="责任人" align="center" width="160"></el-table-column>
        <el-table-column prop="problemType" label="类型" align="center" :formatter="formatterType" width="100"></el-table-column>
        <el-table-column label="状态" align="center" width="100">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.problemStatus === 0" type="danger" size="small" effect="plain">待解决</el-tag>
            <el-tag v-if="scope.row.problemStatus === 1" type="success" size="small" effect="plain">已解决</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="generationTime" label="产生时间" align="center" width="180"></el-table-column>
        <el-table-column label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button type="info" size="mini" plain @click="handleEdit(scope.row)">查看详情</el-button>
            <el-button v-if="scope.row.problemStatus === 0" type="success" size="mini" plain @click="handleSolve(scope.row)">设为解决</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"></Pagination>
    <el-dialog title="设为已解决"
      :visible.sync="showDialog.solve"
      center
      width="540px">
      <el-input
        type="textarea"
        :rows="6"
        placeholder="请输入问题原因"
        v-model="problemReason"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="width: 100%" @click="solveSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="big-dialog"
      :title="recordDialogType === 'add' ? '新增记录' : '修改记录'"
      :visible.sync="showDialog.record"
      center
      width="640px"
      @close="reset">
      <el-form ref="ruleForm" :model="recordDialogData" :inline="true" label-width="80px">
        <el-form-item label="问题名称">
          <el-input v-model="recordDialogData.problemName" clearable placeholder="请填写问题名称"></el-input>
        </el-form-item>
        <el-form-item label="问题类型">
          <el-select v-model="recordDialogData.problemType" clearable placeholder="请选择类型">
            <el-option v-for="item in problemTypeArray" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="产生时间">
          <el-date-picker
            v-model="recordDialogData.generationTime"
            type="datetime"
            placeholder="选择日期时间"
            size="small"
            style="width:200px"></el-date-picker>
        </el-form-item>
        <el-form-item label="问题状态">
          <el-select v-model="recordDialogData.problemStatus" clearable placeholder="请选择状态">
            <el-option v-for="item in problemStatusArray" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理时间">
          <el-input v-model="recordDialogData.processingTime" clearable placeholder="请填写处理时间"></el-input>
        </el-form-item>
        <el-form-item label="责任人">
          <el-input v-model="recordDialogData.problemUser" clearable placeholder="请填写责任人"></el-input>
        </el-form-item>
        <el-form-item label="问题内容">
          <el-input v-model="recordDialogData.problemContent" :rows="3" type="textarea" placeholder="请填写问题内容"></el-input>
        </el-form-item>
        <el-form-item label="问题原因">
          <el-input v-model="recordDialogData.problemReason" :rows="3" type="textarea" placeholder="请填写问题原因"></el-input>
        </el-form-item>
        <el-form-item>
          <el-upload
            action="http://qa.wpt.la/vueApi/upload/newImg"
            list-type="picture-card"
            :file-list="fileList"
            :on-success="handleSuccess"
            :on-error="handleError"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :limit="3">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="recordDialogType === 'add'"
          :loading="submitLoading"
          type="primary"
          size="small"
          style="width:100%"
          @click="dialogSubmit">提 交</el-button>
        <el-button
          v-else
          :loading="submitLoading"
          type="primary"
          size="small"
          style="width:100%"
          @click="dialogSubmit">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl">
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import DownloadExcel from 'vue-json-excel'
import mixin from '@/mixins/mixin'
export default {
  components: { Pagination, DownloadExcel },
  mixins: [mixin],
  data () {
    return {
      searchData: {
        keywords: '',
        problemType: '',
        problemStatus: '',
        page: 1,
        pageSize: 10
      },
      times: [],
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      problemTypeArray: [
        { id: 0, name: '环境问题' },
        { id: 1, name: '代码问题' },
        { id: 2, name: '配置问题' }
      ],
      problemStatusArray: [
        { id: 0, name: '待解决' },
        { id: 1, name: '已解决' },
      ],
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      showDialog: {
        solve: false,
        record: false
      },
      currentId: '',
      problemReason: '',
      recordDialogType: 'add',
      submitLoading: false,
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      recordDialogData: {
        problemName: '',
        problemType: '',
        generationTime: '',
        problemStatus: '',
        processingTime: '',
        problemUser: '',
        problemContent: '',
        problemReason: '',
        imgList: ''
      },
      json_fields: {
        名称: 'problemName',
        内容: 'problemContent',
        原因: 'problemReason',
        解决时间: 'processingTime',
        责任人: 'problemUser',
        类型: {
          filed: 'problemType',
          callback: (value) => {
            return value.problemType === 0
              ? '环境问题'
              : value.problemType === 1
              ? '代码问题'
              : '配置问题'
          }
        },
        状态: {
          filed: 'problemStatus',
          callback: (value) => {
            console.log(value);
            return value.problemStatus === 0 ? '待解决' : '已解决'
          }
        },
        时间: 'generationTime',
        处理方式: {
          callback: () => {
            return ''
          }
        }
      }
    }
  },
  methods: {
    // 新增
    handleAdd () {
      this.recordDialogType = 'add'
      this.showDialog.record = true
    },
    // 修改
    handleEdit (row) {
      this.recordDialogType = 'edit'
      this.currentId = row.id
      Object.keys(this.recordDialogData).forEach( key => { this.recordDialogData[key] = row[key]})
      if (row.imgList) {
        this.fileList = JSON.parse(row.imgList)
      }
      this.showDialog.record = true
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
      console.log('上传失败', err)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleRemove(file) {
      let index = this.fileList.findIndex(item => item.uid === file.uid)
      this.fileList.splice(index, 1)
    },
    dialogSubmit () {
      let imgList = []
      if (this.fileList.length > 0) {
        this.fileList.forEach((file) => {
          imgList.push({
            name: file.name,
            url: 'http://qa.wpt.la/showimgs/' + file.response.data.originPath,
            response: file.response
          })
        })
        this.recordDialogData.imgList = JSON.stringify(imgList)
      }
      let params = JSON.parse(JSON.stringify(this.recordDialogData))
      let method = ''
      if (this.recordDialogType === 'add') {
        method = 'addProblemRecord'
      } else {
        method = 'updateProblem'
        params.id = this.currentId
      }
      this.submitLoading = true
      this.$service[method](params).then(() => {
        this.$message.success(this.recordDialogType === 'add' ? '新增记录成功' : '修改记录成功')
        this.showDialog.record = false
        this.getTableData()
      }).finally(() => {
        this.submitLoading = false
      })
    },
    reset () {
      this.fileList = []
      this.recordDialogData = {
        problemName: '',
        problemType: '',
        generationTime: '',
        problemStatus: '',
        processingTime: '',
        problemUser: '',
        problemContent: '',
        problemReason: '',
        imgList: ''
      }
    },
    // 设为已解决
    handleSolve (row) {
      this.currentId = row.id
      this.problemReason = ''
      this.showDialog.solve = true
    },
    solveSubmit () {
      if (!this.problemReason) {
        this.$message.error('请填写问题原因')
        return
      }
      this.$service.updateProblem({
        id: this.currentId,
        problemStatus: 1,
        problemReason: this.problemReason,
      }).then(() => {
        this.$message.success('设置成功')
        this.showDialog.solve = false
        this.getTableData()
      })
    },
    getTableData () {
      let params = JSON.parse(JSON.stringify(this.searchData))
      if (this.times !== null) {
        params.startTime = this.times[0]
        params.endTime = this.times[1]
      }
      params.size = params.pageSize
      delete params.pageSize
      this.tableLoading = true
      this.$service.listProblemRecord(params).then(res => {
        this.tableData = res.data.dataList
        this.total = res.data.count
      }).finally(() => {
        this.tableLoading = false
      })
    },
    formatterType(row) {
      let item = this.problemTypeArray.find((item) => item.id === row.problemType)
      return item == undefined ? '' : item.name
    }
  }
}
</script>