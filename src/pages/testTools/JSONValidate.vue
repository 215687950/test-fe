<style lang="scss">
.page-jsonValidate {
  main {
    flex: 1;
    overflow: hidden;
    display: flex;
  }
}
</style>
<template>
  <div class="page page-jsonValidate">
    <div class="page-search-bar">
      <!-- <el-select
        v-model="pageObj"
        value-key="completeName"
        placeholder="查询pageName"
        clearable
        filterable
        remote
        :remote-method="searchPages"
        @change="changePage"
      >
        <el-option
          v-for="item in pageNames"
          :key="item.completeName"
          :label="item.pageName"
          :value="item"
        ></el-option>
      </el-select>
      <el-select
        v-model="searchSchemaObj.type"
        placeholder="选择类型"
        @change="changeType"
      >
        <el-option
          v-for="item in types"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        ></el-option>
      </el-select>

      <el-select
        v-model="schemaValue"
        value-key="completeName"
        @change="changeSchema"
        placeholder="请选择JsonSchema"
      >
        <el-option
          v-for="item in schemas"
          :key="item.completeName"
          :label="item.completeName"
          :value="item"
        ></el-option>
      </el-select> -->

      <el-button type="primary" size="small" @click="check">校验</el-button>
    </div>
    <main ref="main">
      <el-input
        type="textarea"
        :rows="row"
        placeholder="请输入JsonSchema"
        v-model="schemaStr"
        style="margin-right: 20px"
        resize="none"
      ></el-input>

      <el-input
        type="textarea"
        :rows="row"
        placeholder="请输入待校验Json"
        v-model="jsonStr"
        resize="none"
      ></el-input>
    </main>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableHeight: null,
      pageNames: [],
      types: [
        {
          id: 1,
          name: "click",
        },
        {
          id: 2,
          name: "exposure",
        },
        {
          id: 3,
          name: "exposureOther",
        },
        {
          id: 4,
          name: "pay",
        },
        {
          id: 5,
          name: "residence",
        },
        {
          id: 6,
          name: "share",
        },
        {
          id: 7,
          name: "visit",
        },
      ],
      searchSchemaObj: {
        pageName: "",
        type: "",
      },
      pageObj: {},
      schemas: [],
      schemaValue: "",
      schemaStr: "",
      jsonStr: "",
      row: 0,
    };
  },
  mounted() {
    this.row = (this.$refs["main"].offsetHeight - 12) / 21;
    window.onresize = () => {
      this.row = (this.$refs["main"].offsetHeight - 12) / 21;
    };
  },
  methods: {
    searchPages(keyword) {
      let data = {
        pageName: keyword,
      };
      this.$service.selectSchemaByNameAndType(data).then((res) => {
        this.pageNames = res.data;
      });
    },

    changePage(data) {
      this.pageObj = data;
      this.searchSchemaObj.pageName = data.md5str;
      this.searchSchemaObj.type = data.type;
      this.type = data.type;
      this.clearSchema();
      this.getSchemaByPageAndType();
    },
    changeType(type) {
      this.searchSchemaObj.type = type;
      this.clearSchema();
      this.getSchemaByPageAndType();
    },

    clearSchema() {
      this.schemas = [];
      this.schemaValue = "";
      this.schemaStr = "";
    },

    getSchemaByPageAndType() {
      if (!this.searchSchemaObj.pageName) {
        return;
      }
      this.$service
        .selectSchemaByNameAndType(this.searchSchemaObj)
        .then((res) => {
          this.schemas = res.data;
          this.schemaValue = this.schemas[0];
          this.type = this.schemaValue.type;
          this.schemaStr = this.schemaValue.schemaContent;
        });
    },

    changeSchema(data) {
      this.schemaValue = data;
      this.schemaStr = this.schemaValue.schemaContent;
    },

    check() {
      if (!(this.jsonStr && this.schemaStr)) {
        this.$message.error("请输入 JsonSchema 和待校验的 Json 内容");
        return;
      }
      var data = { jsonStr: this.jsonStr, schemaStr: this.schemaStr };
      this.$service.checkJsonValidate(data).then(() => {
        this.$message("校验通过！");
      });
    },
  },
};
</script>