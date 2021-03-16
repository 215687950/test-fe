<style lang="scss">
.component-popper-list {
  li.active {
    background: #ecf5ff;
  }
}
</style>
<template>
  <el-popover popper-class="component-popper-list">
    <ul class="ul">
      <li :class="{ 'active': reference === item.value }" v-for="item in list" :key="item.id" @click="handleClick(item)">{{item.value}}</li>
    </ul>
    <div slot="reference"  class="handler-popper-reference">
      <span>{{reference}}</span>
      <i class="el-icon-caret-bottom"></i>
    </div>
  </el-popover>
</template>
<script>
export default {
  props: ['reference', 'list'],
  methods: {
    handleClick (item) {
      this.$emit('on-select', item)
      document.querySelector('#app').click()
    }
  }
}
</script>