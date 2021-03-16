<style lang="scss">
.page-dataFactoryBusiness {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  background: #f5f5f5;
  .el-form-item {
    margin-bottom: 8px;
  }
  .dataFactoryBusiness-header {
    padding: 6px 16px 0 16px;
    margin-bottom: 10px;
    background: #fff;
  }
  .dataFactoryBusiness-main {
    flex: 1;
    overflow: hidden;
    background: #fff;
    padding: 10px 16px;
    display: flex;
    flex-direction: column;
    .result-box {
      flex: 1;
      overflow: hidden;
      textarea {
        background: #f5f5f5;
      }
    }
  }
}
</style>
<template>
  <div class="page page-dataFactoryBusiness">
    <section class="dataFactoryBusiness-header">
      <el-form :inline="true">
        <el-form-item label="商家">
          <el-input v-model="uidOrTelephone" clearable placeholder="输入商家id/手机号码"></el-input>
        </el-form-item>
        <el-form-item label="功能">
          <el-select v-model="feature" clearable placeholder="请选择功能" @change="featureChange">
            <el-option
              v-for="item in featureList"
              :key="item.key"
              :label="item.value"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="类型" v-if="this.typeList.length">
          <el-select v-model="type" clearable placeholder="请选择类型">
            <el-option
              v-for="item in typeList"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" :loading="submitLoading" @click="handleSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </section>
    <section class="dataFactoryBusiness-main">
      <el-form :inline="true">
        <el-form-item label="类型">
          <el-select v-model="searchData.type" clearable placeholder="请选择查询类型">
            <el-option
                v-for="item in selectList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询值">
          <el-input v-model="searchData.value" clearable placeholder="输入商家id/手机号码/uri"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="result-box" ref="result-box">
        <el-input v-model="resultVaule" type="textarea" :rows="rows"></el-input>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  data () {
    return {
      uidOrTelephone: '',
      feature: '',
      featureList: [],
      type: '',
      typeList: [],
      submitLoading: false,
      selectList: [],
      searchData: {
        type: '',
        value: ''
      },
      resultVaule: '',
      rows: 0
    }
  },
  computed: {
    env () {
      return this.$store.state.dataFactoryEnv
    }
  },
  mounted () {
    this.rows = Math.floor((this.$refs['result-box'].offsetHeight - 12) / 21)
    window.onresize = () => {
      this.rows = Math.floor((this.$refs['result-box'].offsetHeight - 12) / 21)
    }
    this.shopGetInfo()
  },
  methods: {
    handleSearch () {
       if (!this.env) {
        this.$message.warning({
          message: '请选择环境',
          duration: 1000,
          offset: 40,
          customClass: 'env-warning-message'
        })
        this.$store.commit('dataFactoryEnvErr', true)
        return
      }
      if (!this.searchData.type || !this.searchData.value) {
        this.$message.warning('信息不全，请填写后重试')
        return
      }
      this.$service.getShopInfo({
        env: this.env,
        selectKey: this.searchData.type,
        uidOrTelephone: this.searchData.value,
      }).then(res => {
        try {
          this.resultVaule = JSON.stringify(res.data, null, '\t')
        } catch (err) {
          this.$message.error(err)
        }
      })
    },
    featureChange (value) {
      this.type = ''
      this.typeList = []
      if (value && 'subKey' in value) {
        this.typeList = value.subKey
      }
    },
    handleSubmit () {
      if (!this.env) {
        this.$message.warning({
          message: '请选择环境',
          duration: 1000,
          offset: 40,
          customClass: 'env-warning-message'
        })
        this.$store.commit('dataFactoryEnvErr', true)
        return
      }
      if (!this.uidOrTelephone || !this.feature || (this.typeList.length && !this.type)) {
        this.$message.warning('信息不全，请填写后重试')
        return
      }
      this.submitLoading = true
      this.$service.setShop({
        env: this.env,
        shopIdOrTelephone: this.uidOrTelephone,
        key: this.feature.key,
        subKey: this.type
      }).then(() => {
        this.$message.success('提交成功')
      }).finally(() => {
        this.submitLoading = false
      })
    },
    // 获取字典
    shopGetInfo () {
      this.$service.shopGetInfo().then(res => {
        this.$store.commit('dataFactoryEnvList', res.data.envList)
        this.featureList = res.data.function
        this.selectList = res.data.selectList
      })
    }
  }
}
</script>