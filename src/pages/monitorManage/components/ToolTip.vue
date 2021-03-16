<template>
  <div @contextmenu.prevent="rightClick(data[name + 'HostName'])" style="padding: 20px 0">
    <el-tooltip placement="right-start">
      <div slot="content">
        <div>基础值：{{ data[name + 'BaseValue'] + unit }}</div>
        <div>阈值：{{ data[name + 'ThresholdValue'] + unit }}</div>
        <div>最大值：{{ data[name + 'LimitValue'] + unit }}</div>
        <div>与基础比值：{{ data['cur' + tranName + 'BaseRatio'] }}<span v-if="name === 'mysqlThread' || name === 'codisProxy'">{{unit}}</span></div>
        <div>与最大比值：{{ data['cur' + tranName + 'LimiRatio'] }}<span v-if="name === 'mysqlThread' || name === 'codisProxy'">{{unit}}</span></div>
      </div>
      <div v-if="err">
        <div style="fontSize:16px">Error</div>
      </div>
      <div v-else>
        <div style="fontSize:16px">{{ data[name + 'UseAgePer'] + unit }}</div>
        <div style="fontSize:12px">{{ data[name + 'HostName'] }}</div>
      </div>
    </el-tooltip>
  </div>
</template>
<script>
export default {
  props: ['data', 'name', 'unit', 'noRightClick', 'err'],
  computed: {
    tranName () {
      if (this.name === 'mysqlQps') {
        return 'MysqlQPS'
      } else if (this.name === 'mysqlThread') {
        return 'MysqlThread'
      } else if (this.name === 'mysqlThreadRun') {
        return 'MysqlThreadRun'
      } else if (this.name === 'codisProxy') {
        return 'CodisProxy'
      } else {
        return this.name.toUpperCase()
      }
    }
  },
  methods: {
    rightClick (hostName) {
      if (this.noRightClick || this.err) return
      this.$msgbox.confirm(`将 ${hostName} 服务过滤?`, '过滤服务', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$emit('on-right-click', hostName)
      })
    }
  }
}
</script>