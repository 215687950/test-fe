<style lang="scss">
.page-coupons {
  .table-box {
    flex: 1;
    overflow: hidden;
    .receiveUser {
      color: red;
    }
  }
  .el-dialog__wrapper {
    .el-input,
    .el-date-editor.el-input,
    .el-select {
      width: 200px;
    }
    .form-item-block {
      display: flex;
      .el-form-item__content {
        flex: 1;
      }
    }
  }
}
</style>
<template>
  <div class="page page-coupons">
    <div class="page-search-bar">
      <label>创建人</label>
      <el-input
        v-model="searchData.name"
        placeholder="请输入关键字"
        prefix-icon="el-icon-search"
        clearable
        @keyup.enter.native="search"
      ></el-input>
      <label>时间</label>
      <el-date-picker
        v-model="searchData.createTime"
        type="date"
        size="small"
        :style="{ width: '180px' }"
        placeholder="选择时间"
        value-format="yyyy-MM-dd"
      ></el-date-picker>

      <el-button
        type="primary"
        size="small"
        icon="el-icon-search"
        @click="search"
        >搜索</el-button
      >
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
        ><el-table-column prop="id" label="id" align="center"></el-table-column>
        <el-table-column
          prop="templateName"
          label="模版"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="expireTime"
          label="有效时间"
          align="center"
        ></el-table-column>

        <el-table-column label="优惠情况" align="center">
          <template slot-scope="scope">
            {{ scope.row.fullValue / 100 }} - {{ scope.row.value / 100 }}
          </template>
        </el-table-column>

        <el-table-column
          prop="totalNum"
          label="总数"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="leftNum"
          label="剩余数量"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="usedNum"
          label="已使用"
          align="center"
        ></el-table-column>

        <el-table-column
          prop="useToShopIds"
          label="消费店铺ID"
          align="center"
        ></el-table-column>

        <el-table-column label="领取人ID" align="center">
          <template slot-scope="scope">
            <div
              v-for="item in scope.row.receiveUserinfoIds"
              :key="item"
              :class="{ receiveUser: whiteReceiverList.indexOf(item) === -1 }"
            >
              {{ item }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        ></el-table-column>
      </el-table>
    </div>

    <Pagination
      :total="total"
      :currentPage="searchData.page"
      @on-size-change="handleSizeChange"
      @on-current-change="handleCurrentChange"
    ></Pagination>
  </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
  components: { Pagination },
  data() {
    return {
      searchData: {
        page: 1,
        perpage: 10,
        name: "张俊杰",
        createTime: ""
      },
      tableLoading: false,
      tableData: [],
      total: 0,
      tableHeight: null,
      whiteReceiverList: [
        19046681,
        28033074,
        28480535,
        26356238,
        41113022,
        41089389,
        15774752,
        49425136,
        49742098,
        44996646,
        53113886,
        54959794,
        53221148,
        43350301,
        43180485,
        43622163,
        49161956,
        49161958,
        49161960,
        49161963,
        49161966,
        49161968,
        49741429,
        39911072,
        45101278,
        51341304,
        48635829,
        54234663,
        43186189,
        55311002,
        63517793,
        55309725,
        55831332,
        54945220,
        14393024,
        43821244,
        23913350,
        43653931,
        44972643,
        44629744,
        15137448,
        45157269,
        49632556,
        49854551,
        55901278,
        54071995,
        44310583,
        14527211,
        28355039,
        22852537,
        14291365,
        53141585,
        53161311,
        53747045,
        30853550,
      ],
      couponsTemplate: [
        {
          id: 101,
          name: "平台券",
          product: 1,
          bearCost: 1,
        },
        {
          id: 102,
          name: "店铺券",
          product: 1,
          bearCost: 2,
        },
        {
          id: 103,
          name: "分享+券",
          product: 1,
          bearCost: 2,
        },
        {
          id: 104,
          name: "直播分享+券",
          product: 1,
          bearCost: 2,
        },
        {
          id: 105,
          name: "活动店铺券",
          product: 1,
          bearCost: 2,
        },
        {
          id: 106,
          name: "千万保障计划赔付券",
          product: 1,
          bearCost: 1,
        },
        {
          id: 107,
          name: "赠送平台券",
          product: 1,
          bearCost: 1,
        },
        {
          id: 108,
          name: "活动平台券",
          product: 1,
          bearCost: 1,
        },
        {
          id: 109,
          name: "私密券",
          product: 1,
          bearCost: 2,
        },
        {
          id: 110,
          name: "超值券",
          product: 1,
          bearCost: 2,
        },
        {
          id: 111,
          name: "粉丝团券",
          product: 1,
          bearCost: 2,
        },
        {
          id: 112,
          name: "鉴真阁平台券",
          product: 5,
          bearCost: 1,
        },
      ],
    };
  },
  mounted() {
    this.tableHeight = this.$refs["table-box"].offsetHeight;
    window.onresize = () => {
      this.tableHeight = this.$refs["table-box"].offsetHeight;
    };
    this.getTableData();
  },

  methods: {
    search() {
      this.searchData.page = 1;
      this.getTableData();
    },

    // 获取表格数据
    getTableData() {
      this.tableLoading = true;
      this.$service
        .getCouponList(this.searchData)
        .then((res) => {
          console.log("获取的数据=====>", res);
          let data = res.data.coupons;
          data.forEach((item) => {
            this.couponsTemplate.forEach((type) => {
              if (type.id === item.templateId) {
                item.templateName = type.name;
              }
            });
          });
          this.tableData = data;
          this.total = res.data.total;
        })
        .finally(() => {
          this.tableLoading = false;
        });
    },

    // 切换每页条数
    handleSizeChange(value) {
      this.searchData.perpage = value;
      this.searchData.page = 1;
      this.getTableData();
    },
    // 切换页码
    handleCurrentChange(value) {
      this.searchData.page = value;
      this.getTableData();
    },
  },
};
</script>