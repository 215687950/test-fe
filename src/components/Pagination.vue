<template>
  <el-pagination
      style="margin-top: 10px; text-align: center;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 50, 500]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</template>
<script>
export default {
  // props: ['total', 'pageSize'],
  props: {
    total: Number,
    pageSize: {
      type: Number,
      default: 10
    },
    currentPage: {
      type: Number,
      default: 1
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('on-size-change', val)
    },
    handleCurrentChange(val) {
      this.$emit('on-current-change', val)
    }
  }
}
</script>