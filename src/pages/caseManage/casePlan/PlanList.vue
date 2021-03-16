<style lang="scss">
.page-plan {
  &-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    height: 50px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 0 8px 0 rgba(0,0,0,.1);
  }
  &-main {
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    background: #f5f5f5;
    &-wrapper {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 20px;
      background: #fff;
      .handle-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        color: #888;
        .el-input__inner {
          height: 35px;
          line-height: 35px;
        }
        .el-dropdown-link {
          color: #888;
          cursor: pointer;
        }
      }
      .table-box {
        flex: 1;
        .el-table {
          th, td {
            padding: 14px 0;
            height: 30px;
            line-height: 30px;
          }
          td {
            color: #333;
            cursor: pointer;
          }
          .el-table__header {
            th {
              background: #fff;
              color: #888;
              font-weight: normal;
            }
          }
          .status {
            width: max-content;
            padding: 0 10px;
            border: 1px solid;
            border-radius: 3px;
            font-size: 12px;
          }
          .status1 { // 未开始
            color: #ff7575;
            border-color: #ff7575;
          }
          .status2 { // 进行中
            color: #5dcfff;
            border-color: #5dcfff;
          }
          .status3 { // 已延期
            color: #ffcd5d;
            border-color: #ffcd5d;
          }
          .status4 { // 已完成
            color: #73d897;
            border-color: #73d897;
          }
          .el-dropdown {
            width: 100%;
          }
          .el-dropdown-link {
            // display: none;
            text-align: center;
            color: #cacaca;
            border-radius: 4px;
          }
          tr:hover .el-dropdown-link {
            // display: block;
            &:hover {
              color: #348fe4;
              background: rgba(52,143,228,.1);
            }
          }
          .el-dropdown-link.actived {
            // display: block;
            outline: none;
            color: #348fe4;
            background: rgba(52,143,228,.1);
          }
        }
      }
    }
  }
}
</style>
<template>
  <div class="page page-plan">
    <header class="page-plan-header">
      <div>计划列表</div>
      <el-button type="primary" icon="el-icon-plus" @click="addPlan">新建计划</el-button>
    </header>
    <main class="page-plan-main">
      <div class="page-plan-main-wrapper">
        <div class="handle-header">
          <el-input
            v-model="searchData.title"
            prefix-icon="el-icon-search"
            placeholder="搜索计划（按Enter搜索）"
            clearable
            style="width:300px"
            @keyup.enter.native="getPlanList"></el-input>
          <el-input
            v-model="searchData.principal"
            prefix-icon="el-icon-search"
            placeholder="负责人（按Enter搜索）"
            clearable
            style="width:300px"
            @keyup.enter.native="getPlanList"></el-input>
          <div>
            <el-dropdown @command="statusChange">
              <span class="el-dropdown-link">
                {{currentStatus}}<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in statusLists" :key="item.id" :command="item">{{item.value}}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span style="margin:0 16px">|</span> 共 <span style="color:#333">{{total}}</span> 个计划
          </div>
        </div>
        <div class="table-box" ref="table-box">
          <el-table
            :data="tableData"
            v-loading="loading"
            element-loading-text="拼命加载中"
            element-loading-spinner="el-icon-loading"
            element-loading-background="#FFFAFA)"
            :height="tableHeight"
            style="width: 100%"
            @row-click="rowClick"
            @sort-change="sortChange">
            <el-table-column label="计划名称"
              prop="name"
              min-width="200"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="关联迭代"
              prop="iterationName"
              show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="状态"
              prop="status"
              sortable="custom"
              width="100">
              <template slot-scope="scope">
                <div class="status" :class="`status${scope.row.status}`">{{scope.row.statusName}}</div>
              </template>
            </el-table-column>
            <el-table-column label="结果分布"
              width="200">
              <template slot-scope="scope">
                <ResultBar :result="scope.row.result"></ResultBar>
              </template>
            </el-table-column>
            <el-table-column label="负责人"
              prop="principal"
              width="100">
            </el-table-column>
            <el-table-column label="开始时间"
              prop="startTime"
              sortable="custom"
              width="170">
            </el-table-column>
            <el-table-column label="结束时间"
              prop="endTime"
              sortable="custom"
              width="170">
            </el-table-column>
            <el-table-column label="操作" width="50">
              <template slot-scope="scope">
                <!-- 1.未开始；2.进行中；3.已延期；4.已完成 -->
                <el-dropdown trigger="click" @visible-change="dropdownVisibleChange(scope.$index, $event)">
                  <div class="el-dropdown-link" :class="{actived: dropdownVisible === scope.$index}" @click.stop="1">
                    <i class="el-icon-more"></i>
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="scope.row.status === 1" @click.native="handleStart(scope.row, scope.$index)">开始测试</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.status !== 1" @click.native="goProgressPage(scope.row)">测试进度</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.status === 4" @click.native="goViewPlanPage(scope.row)">查看测试报告</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.status === 4 && scope.row.isSync === 1" @click.native="syncToProduct(scope.row)">同步用例库</el-dropdown-item>
                    <!-- <el-dropdown-item v-if="scope.row.status !== 4">规划用例</el-dropdown-item> -->
                    <el-dropdown-item v-if="scope.row.status !== 4"  @click.native="handleEnd(scope.row, scope.$index)">结束测试</el-dropdown-item>
                    <el-dropdown-item v-if="scope.row.status !== 4" :divided="scope.row.status !== 4" @click.native="editPlan(scope.row)">编辑</el-dropdown-item>
                    <el-dropdown-item :divided="scope.row.status === 4" @click.native="copyPlan(scope.row)">复制</el-dropdown-item>
                    <el-dropdown-item @click.native="deletePlan(scope.row, scope.$index)">删除</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <Pagination :currentPage="searchData.page" :total="total" :pageSize="20" @on-size-change="handleSizeChange" @on-current-change="handleCurrentChange"></Pagination>
      </div>
    </main>
    <PlanAdd
      :type="dialogType"
      :visible="showDialog.addPlan"
      :initData="dialogInitData"
      @on-save="getPlanList"
      @on-close="showDialog.addPlan = false"></PlanAdd>
  </div>
</template>
<script>
import ResultBar from './components/ResultBar'
import Pagination from '@/components/Pagination'
import PlanAdd from './components/PlanAdd'
export default {
  components: { ResultBar, Pagination, PlanAdd },
  data() {
    return {
      showDialog: {
        addPlan: false
      },
      dialogType: '',
      dialogInitData: {},
      currentStatus: '全部计划',
      searchData: {
        title: '',
        principal: this.$store.state.userInfo.name,
        statusList: [],
        page: 1,
        pageSize: 20,
        orderType: '',
        orderTurn: null
      },
      loading: false,
      tableHeight: null,
      tableData: [],
      total: 0,
      dropdownVisible: ''
    }
  },
  computed: {
    statusLists () {
      let data = this.$store.state.allEnum.planStatus
      if (data && data.length === 4) {
        data.unshift({ id: 0, value: '全部计划' })
      }
      return data
    }
  },
  mounted () {
    this.tableHeight = this.$refs['table-box'].offsetHeight
    this.getPlanList()
  },
  methods: {
    // 删除
    deletePlan (row, index) {
      this.$msgbox.confirm('确认删除此计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.deleteById({ id: row.id }).then(() => {
          this.$message.success('删除成功')
          this.tableData.splice(index, 1)
        })
      })
    },
    // 复制
    copyPlan (row) {
      this.$service.copyPlan({ id: row.id }).then(() => {
        this.$message.success('复制成功')
        this.getPlanList()
      })
    },
    // add
    addPlan () {
      this.dialogType = 'add'
      this.showDialog.addPlan = true
    },
    // 编辑
    editPlan (row) {
      this.$service.getPlanInfo({ id: row.id }).then(res => {
        this.dialogInitData = res.data
        this.dialogType = 'edit'
        this.showDialog.addPlan = true
      })
    },
    // 结束计划
    handleEnd (row, index) {
      this.$msgbox.confirm('确认结束此计划?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.updatePlan({
          id: row.id,
          status: 4
        }).then(() => {
          this.$message.success('计划已结束')
          this.tableData.splice(index, 1, Object.assign({}, row, { status: 4, statusName: '已完成' }))
        })
      })
    },
    // 同步至用例库
    syncToProduct (row) {
      this.$service.syncToProduct({ id: row.id }).then(() => {
        this.$message.success('同步成功')
      })
    },
    // 前往查看测试报告页面
    goViewPlanPage (row) {
      this.$router.push(`/planReportDetail/${row.id}`)
    },
    // 前往测试进度页面
    goProgressPage (row) {
      this.$router.push(`/planList/planProgress/${row.id}`)
    },
    // 开始计划
    handleStart (row) {
      this.$service.updatePlan({
        id: row.id,
        status: 2
      }).then(() => {
        this.$message.success('计划已开始')
        this.rowClick(row)
        // this.tableData.splice(index, 1, Object.assign({}, row, { status: 2, statusName: '进行中' }))
      })
    },
    rowClick (row) {
      this.$router.push(`/planExecute/${row.id}`)
    },
    sortChange (data) {
      let prop = ''
      let order = null
      if (data.prop === 'startTime') {
        prop = 'start_time'
      } else if (data.prop === 'endTime') {
        prop = 'end_time'
      } else {
        prop = data.prop
      }
      if (data.order === 'ascending') {
        order = 0
      } else if (data.order === 'descending') {
        order = 1
      }
      this.searchData.orderType = prop
      this.searchData.orderTurn = order
      this.getPlanList()
    },
    // 激活...菜单
    dropdownVisibleChange (index, bool) {
      this.dropdownVisible = bool ? index : ''
    },
    // 状态筛选
    statusChange (data) {
      this.currentStatus = data.value
      if (data.id === 0) {
        this.searchData.statusList = []
      } else {
        this.searchData.statusList = [data.id]
      }
      this.searchData.page = 1
      this.getPlanList()
    },
    // 切换每页条数
    handleSizeChange (value) {
      this.searchData.pageSize = value
      this.searchData.page = 1
      this.getPlanList()
    },
    // 页码切换
    handleCurrentChange (value) {
      this.searchData.page = value
      this.getPlanList()
    },
    // 获取计划列表
    getPlanList () {
      this.loading = true
      this.$service.getPlanList(this.searchData).then(res => {
        let data = res.data.list
        data.forEach(item => {
          this.statusLists.forEach(status => {
            if (status.id === item.status) {
              item.statusName = status.value
            }
          })
        })
        this.tableData = data
        this.total = res.data.count
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>