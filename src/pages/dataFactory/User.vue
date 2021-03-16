<style lang="scss">
.page-dataFactoryUser {
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
  .dataFactoryUser-header {
    padding: 6px 16px 0 16px;
    margin-bottom: 10px;
    background: #fff;
    .el-row {
      display: inline-block;
    }
    .el-form-item__content .el-input-group {
      vertical-align: middle;
    }
  }
  .dataFactoryUser-main {
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
  <div class="page page-dataFactoryUser">
    <section class="dataFactoryUser-header">
      <el-form :inline="true">
        <el-row>
          <el-form-item label="用户">
            <el-input v-model="uidOrTelephone" clearable placeholder="输入用户id/手机号码"></el-input>
          </el-form-item>
          <el-form-item label="功能">
            <el-select v-model="feature" clearable placeholder="请选择功能">
              <el-option
                v-for="item in featureList"
                :key="item.key"
                :label="item.value"
                :value="item.key"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="值">
            <el-input v-model="featureValue" clearable placeholder="输入需要值"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini" :loading="submitLoading" @click="handleSubmit">提交</el-button>
          </el-form-item>
        </el-row>
        <br>
        <el-row style="margin-left: 40px;">
          <el-form-item>
            <el-input v-model="uidOrTelephone1" clearable placeholder="输入用户id/手机号码">
              <el-button
                slot="append"
                style="color: #67c23a;background: #f0f9eb;height: 28px;padding: 0 10px;margin-top: -3px;border: none;"
                @click="handleClear('Cache')">清用户缓存</el-button>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model="uidOrTelephone2" clearable placeholder="输入用户id/手机号码">
              <el-button
                slot="append"
                style="color: #f56c6c;background: #fef0f0;height: 28px;padding: 0 10px;margin-top: -3px;border: none;"
                @click="handleClear('UserNew')">清用户新用户</el-button>
            </el-input>
          </el-form-item>
        </el-row>
      </el-form>
    </section>
    <section class="dataFactoryUser-main">
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
          <el-input v-model="searchData.value" clearable placeholder="输入用户id/手机号码/uri"></el-input>
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
      uidOrTelephone1: '',
      uidOrTelephone2: '',
      feature: '',
      featureList: [],
      featureValue: '',
      submitLoading: false,
      searchData: {
        type: '',
        value: ''
      },
      selectList: [],
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
    this.factoryGetInfo()
  },
  methods: {
    // 提交 - 更新用户信息
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
      if (!this.uidOrTelephone || !this.feature || !this.featureValue) {
        this.$message.warning('信息不全，请填写后重试')
        return
      }
      this.submitLoading = true
      this.$service.factorySetUserValue({
        env: this.env,
        uidOrTelephone: this.uidOrTelephone,
        key: this.feature,
        value: this.featureValue
      }).then(() => {
        this.$message.success('提交成功')
      }).finally(() => {
        this.submitLoading = false
      })
    },
    // 清用户缓存 or 为新用户
    handleClear (type) {
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
      if ((type === 'Cache' && !this.uidOrTelephone1) || (type === 'UserNew' && !this.uidOrTelephone2)) {
        this.$message.warning('请输入用户id/手机号码')
        return
      }
      if (type === 'UserNew') {
        this.$msgbox.confirm('确认清用户新用户吗?', '提示', {
          type: 'warning',
          center: true
        }).then(() => {
          this.$service['factoryClear' + type]({
            env: this.env,
            uidOrTelephone: this.uidOrTelephone2
          }).then(() => {
            this.$message.success('操作成功')
          })
        })
      } else {
        this.$service['factoryClear' + type]({
          env: this.env,
          uidOrTelephone: this.uidOrTelephone1
        }).then(() => {
          this.$message.success('操作成功')
        })
      }
    },
    // 获取用户信息
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
      this.$service.factoryGetUserInfo({
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
    // 获取字典
    factoryGetInfo () {
      this.$service.factoryGetInfo().then(res => {
        this.$store.commit('dataFactoryEnvList', res.data.envList)
        this.featureList = res.data.function
        this.selectList = res.data.selectList
      })
    }
  }
}
</script>