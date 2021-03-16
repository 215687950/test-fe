<template>
  <el-popover
    :popper-class="className"
    width="280"
    @show="popperShow"
    @hide="poperHide">
    <header>创建分组</header>
    <el-input v-model="groupName" minlength="2" maxlength="15" placeholder="分组名称" clearable @keyup.enter.native="addGroup"></el-input>
    <el-button :disabled="groupName.length < 2" type="primary" @click="addGroup">创建</el-button>
    <slot slot="reference"></slot>
    <!-- <div class="case-tree-popover-reference" slot="reference" @click.stop="stop"><i class="el-icon-circle-plus-outline"></i></div> -->
  </el-popover>
</template>
<script>
export default {
  props: ['className', 'parentId'],
  data () {
    return {
      id: this.$route.params.id,
      groupName: ''
    }
  },
  methods: {
    // 新增分组
    addGroup () {
      this.$service.addGroup({
        parentId: this.parentId,
        name: this.groupName,
        productId: this.id
      }).then((res) => {
        document.querySelector('#app').click()
        this.$message.success('新增成功')
        this.$emit('refresh-tree', {
          name: this.groupName,
          id: res.data,
          parentId: this.parentId,
          productId: this.id
        })
        this.groupName = ''
      })
    },
    // popover组建蒙层
    popperShow () {
      let mask = document.querySelector('.mask')
      if (!mask) {
        let div = document.createElement('div')
        div.className = 'mask'
        div.style.display = 'block'
        document.body.appendChild(div)
      } else {
        mask.style.display = 'block'
      }
    },
    poperHide () {
      document.querySelector('.mask').style.display = 'none'
    }
  }
}
</script>