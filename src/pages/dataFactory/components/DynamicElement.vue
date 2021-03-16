<style lang="scss">
.component-dynamic-element {
  .el-form-item {
    display: flex;
    margin-bottom: 0px;
    .el-form-item__content {
      flex: 1;
    }
    .el-input,
    .el-date-editor.el-input,
    .el-select {
      width: 220px;
    }
  }
  .el-form-item.height20 {
    .el-form-item__label,
    .el-form-item__content {
      line-height: 24px;
    }
  }
}
</style>
<template>
  <div class="component-dynamic-element">
    <el-form :inline="true" label-width="70px">
      <div v-for="ele in eleList" :key="ele.key">
        <!-- 输入框 -->
        <el-form-item v-if="ele.type === 'input'" :label="ele.label" :style="{'margin-left': ele.label ? 0 : '70px'}">
          <el-input v-model="ele.value" clearable :placeholder="ele.placeholder"></el-input>
        </el-form-item>
        <!-- 复选框 -->
        <el-form-item v-if="ele.type === 'checkboxGroup'" :label="ele.label" class="height20" :style="{'margin-left': ele.label ? 0 : '70px'}">
          <el-checkbox-group v-model="ele.value">
            <el-checkbox v-for="checkbox in ele.options" :label="checkbox.key" :key="checkbox.key">{{checkbox.value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- 单选框 -->
        <el-form-item v-if="ele.type === 'radioGroup'" :label="ele.label" class="height20" :style="{'margin-left': ele.label ? 0 : '70px'}">
          <el-radio-group v-model="ele.value">
            <el-radio v-for="radio in ele.options" :label="radio.value" :key="radio.key">{{radio.key}}</el-radio>
          </el-radio-group>
        </el-form-item>
          <!-- 下拉框 -->
        <el-form-item v-if="ele.type === 'select'" :label="ele.label" :style="{'margin-left': ele.label ? 0 : '70px'}">
          <el-select v-model="ele.value" clearable>
            <el-option v-for="option in ele.options" :key="option.key" :label="option.value"  :value="option.key"></el-option>
          </el-select>
        </el-form-item>
          <!-- 时间 -->
        <el-form-item v-if="ele.type === 'date'" :label="ele.label" :style="{'margin-left': ele.label ? 0 : '70px'}">
          <el-date-picker v-model="ele.value"></el-date-picker>
        </el-form-item>
      </div>
      <el-button :loading="loading" type="primary" style="width:290px;margin-top: 20px" @click="submit">提交</el-button>
    </el-form>
  </div>
</template>
<script>
export default {
  props: ['eleList', 'loading'],
  computed: {
    env () {
      return this.$store.state.dataFactoryEnv
    }
  },
  methods: {
    submit () {
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
      let params = {}
      this.eleList.forEach(ele => {
        params[ele.key] = ele.value
      })
      this.$emit('on-submit', {...params, env: this.env, creator: this.$store.state.userInfo.account})
    }
  }
}
</script>