<style lang="scss">
.report-list-drawer {
  .el-drawer {
    display: flex;
    flex-direction: column;;
  }
  .el-drawer__header {
    margin-bottom: 20px;
  }
  .el-drawer__body {
    flex: 1;
    overflow: hidden;
    padding: 0 20px 20px;
    display: flex;
    flex-direction: column;
    .main {
      flex: 1;
      overflow-y: auto;
      .box {
        .el-divider__text {
          color: #6ba9e8;
          font-size: 20px;
        }
        .el-form-item {
          margin-bottom: 15px;
        }
        .href_style {
          text-decoration: none;
          color: #67C23A;
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
<template>
  <el-drawer
    class="report-list-drawer"
    :title="data.projName"
    :visible.sync="visible"
    size="65%">
    <div style="margin-bottom: 30px">{{ data.creatorName }} 创建于 {{ data.createTime }}</div>
    <div class="main">
      <el-form label-width="100px" inline>
        <div class="box">
          <el-divider content-position="left">项目相关</el-divider>
          <el-form-item label="迭代名">
            <el-input :value="data.projName" readonly style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="迭代URL">
            <el-input :value="data.projUrl" readonly style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="蓝湖URL">
            <el-input :value="data.uiUrl" readonly style="width:300px"></el-input>
          </el-form-item>
        </div>
        <div class="box">
          <el-divider content-position="left">数据相关</el-divider>
          <el-form-item label="数据需求URL">
            <el-input :value="data.dataUrl" readonly style="width:300px"></el-input>
          </el-form-item>
          <br>
          <el-form-item label="是否涉及数仓">
            <el-switch
              v-model="data.isDataBase"
              active-color="#13ce66"
              inactive-color="#ff4949"
              disabled></el-switch>
          </el-form-item>
          <el-form-item label="是否涉及报表">
            <el-switch
              v-model="data.isReport"
              active-color="#13ce66"
              inactive-color="#ff4949"
              disabled></el-switch>
          </el-form-item>
          <el-collapse v-model="activeNames">
            <el-collapse-item
              title="原始数据需求"
              name="1"
            >{{ data.originInfo }}</el-collapse-item>
          </el-collapse>
        </div>
        <div class="box">
          <el-divider content-position="left">埋点相关</el-divider>
          <el-collapse v-model="activeNames">
            <el-collapse-item title="取数问题记录" name="2">{{ data.questionNum }}</el-collapse-item>
            <el-collapse-item title="待解决问题记录" name="3">{{ data.questionAbility }}</el-collapse-item>
            <el-collapse-item title="原始线上问题记录" name="4">{{ data.questionRelease }}</el-collapse-item>
          </el-collapse>
        </div>
        <div class="box">
          <el-divider content-position="left">埋点记录</el-divider>
          <el-table
            :data="data.recordList"
            border
            style="width: 100%">
            <el-table-column label="数据需求" align="center">
              <template slot-scope="scope">
                <a
                  :href="scope.row.dpUrl"
                  target="_blank"
                  class="href_style"
                  :title="'跳转埋点: ' + scope.row.dpUrl">{{ scope.row.name }}</a>
              </template>
            </el-table-column>
            <el-table-column label="图片" align="center">
              <template slot-scope="scope">
                <el-image
                  :src="scope.row.dpImages"
                  :preview-src-list="viewPicture(scope.row.dpImages)"
                  fit="contain"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column label="埋点样式" prop="dpDescStr" align="center"></el-table-column>
            <el-table-column label="涉及报表" align="center">
              <template slot-scope="scope">
                <el-tooltip :content="(scope.row.isReport ? '' : '不') + '涉及'" placement="top">
                  <el-switch
                    v-model="scope.row.isReport"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    disabled></el-switch>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark" align="center"></el-table-column>
          </el-table>
        </div>
        <div class="box">
          <el-divider content-position="left">埋点配置</el-divider>
          <el-table
            :data="data.dataTypeList"
            border
            style="width: 100%">
            <el-table-column label="埋点类型" prop="type" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.type === 0">业务埋点端</span>
                <span v-if="scope.row.type === 1">开发埋点端</span>
              </template>
            </el-table-column>
            <el-table-column label="埋点端" prop="clientArray" align="center"></el-table-column>
            <el-table-column label="开发时间" prop="devTime" align="center"></el-table-column>
            <el-table-column label="验收时间" prop="checkTime" align="center"></el-table-column>
            <el-table-column label="上线时间" prop="releaseTime" align="center"></el-table-column>
          </el-table>
        </div>
      </el-form>
    </div>
  </el-drawer>
</template>
<script>
export default {
  props: ['data', 'visible'],
  data () {
    return {
      activeNames: []
    }
  },
  methods: {
    // 转为array格式
    viewPicture(imageUrl) {
      return [imageUrl]
    }
  }
}
</script>