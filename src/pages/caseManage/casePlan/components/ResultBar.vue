<style lang="scss">
.component-result-bar {
  height: 10px;
  line-height: 10px;
  border-radius: 5px;
  background: #eee;
  overflow: hidden;
  &-item {
    display: inline-block;
    height: 10px;
    border-radius: 0 10px 10px 0;
    overflow: hidden;
    position: relative;
    &:not(:first-child):before {
      content: '';
      position: absolute;
      z-index: 1;
      left: -5px;
      display: block;
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 5px;
    }
  }
  .item-sucess {
    background: #73d897;
  }
  .item-pending {
    background: #5dcfff;
  }
  .item-fail {
    background: #ff7575;
  }
  .item-block {
    background: #ffcd5d;
  }
}
</style>
<template>
  <div class="component-result-bar">
    <el-tooltip v-if="result.successCount" popper-class="result-bar-tooltip" effect="dark" placement="top">
      <div slot="content">
        <span class="flag-dot flag-sucess"></span>
        <span>{{((result.successCount / result.totalCount) * 100).toFixed(2)}}% 通过</span>
        <br/>
        <span>{{result.successCount}}/{{result.totalCount}}用例</span>
      </div>
      <span
        class="component-result-bar-item item-sucess"
        :style="{width: (result.successCount / result.totalCount) * 100 + '%'}">
      </span>
    </el-tooltip>
    <el-tooltip v-if="result.blockCount" popper-class="result-bar-tooltip" effect="dark" placement="top">
      <div slot="content">
        <span class="flag-dot flag-block"></span>
        <span>{{((result.blockCount / result.totalCount) * 100).toFixed(2)}}% 受阻</span>
        <br/>
        <span>{{result.blockCount}}/{{result.totalCount}}用例</span>
      </div>
      <span
        class="component-result-bar-item item-block"
        :style="{width: (result.blockCount / result.totalCount) * 100 + '%'}"></span>
    </el-tooltip>
    <el-tooltip v-if="result.failCount" popper-class="result-bar-tooltip" effect="dark" placement="top">
      <div slot="content">
        <span class="flag-dot flag-fail"></span>
        <span>{{((result.failCount / result.totalCount) * 100).toFixed(2)}}% 失败</span>
        <br/>
        <span>{{result.failCount}}/{{result.totalCount}}用例</span>
      </div>
      <span
        class="component-result-bar-item item-fail"
        :style="{width: (result.failCount / result.totalCount) * 100 + '%'}"></span>
    </el-tooltip>
    <el-tooltip v-if="result.pendingCount" popper-class="result-bar-tooltip" effect="dark" placement="top">
      <div slot="content">
        <span class="flag-dot flag-pending"></span>
        <span>{{((result.pendingCount / result.totalCount) * 100).toFixed(2)}}% 未测</span>
        <br/>
        <span>{{result.pendingCount}}/{{result.totalCount}}用例</span>
      </div>
      <span
        class="component-result-bar-item item-pending"
        :style="{width: (result.pendingCount / result.totalCount) * 100 + '%'}">
      </span>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  props: ['result']
}
</script>