let mixin = {
  mounted () {
    this.tableHeight = this.$refs['table-box'].offsetHeight
    window.onresize = () => {
      this.tableHeight = this.$refs['table-box'].offsetHeight
    }
    this.getTableData()
  },
  methods: {
    // 搜索
    search () {
      this.searchData.page = 1
      this.getTableData()
    },
    // 切换每页条数
    handleSizeChange (value) {
      this.searchData.pageSize = value
      this.searchData.page = 1
      this.getTableData()
    },
    // 切换页码
    handleCurrentChange (value) {
      this.searchData.page = value
      this.getTableData()
    }
  }
}

export default mixin