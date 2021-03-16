<style lang="scss">
.page-employTke {
  &-title {
    padding: 0 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .title {
      font-size: 16px;
      font-weight: bold;
    }
  }
  .card-box {
    flex: 1;
    overflow-y: auto;
    .el-card {
      float: left;
      margin: 10px;
      cursor: pointer;
      &:hover {
        transform: scale(1.02);
        box-shadow: 0 7px 21px rgba(56,56,56,0.15);
      }
      .el-card__body {
        padding: 16px;
        overflow: hidden;
        position: relative;
        .config {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 2;
          i {
            font-size: 18px;
          }
        }
        .info {
          overflow: hidden;
          .el-row {
            margin-bottom: 8px;
          }
          .card-title {
            color: #b5b5b5;
          }
          span {
            color: red;
          }
          .count-down {
            margin-top: 30px;
            font-size: 42px;
            color: #ff3030;
            text-shadow: 0 0 0.2em #f87, 0 0 0.2em #f87;
          }
        }
        .prompt {
          font-size: 12px;
          color: #828282;
          margin-top: 8px;
        }
      }
    }
    .el-card.add-card {
      background: rgba($color: #000000, $alpha: 0.05);
      .el-card__body {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        i {
          font-size: 70px;
          color: #ccc;
        }
      }
    }
  }
  .el-dialog__wrapper {
    .el-input,
    .el-date-editor.el-input,
    .el-select {
      width: 200px;
    }
  }
  .el-dialog__wrapper.view-dialog {
    height: 100%;
    .el-dialog {
      height: 80%;
      .el-dialog__body {
        display: flex;
        flex-direction: column;
        .table-box {
          flex: 1;
          overflow: hidden;
        }
      }
    }
  }
  .el-dialog__wrapper.config-dialog {
    .el-dialog__body {
      flex-direction: row !important;
      justify-content: space-between;
      .tree-box {
        width: 46%;
        display: flex;
        flex-direction: column;
        .title {
          text-align: center;
          font-size: 16px;
          padding-bottom: 10px;
          margin-bottom: 10px;
          border-bottom: 1px solid #DCDFE6;
        }
        .el-tree {
          flex: 1;
          overflow-y: auto;
          .el-tree-node__expand-icon.is-leaf {
            display: none;
          }
          .el-tree-node__content > label.el-checkbox {
            margin-left: 10px;
          }
        }
      }
      .el-divider--vertical {
        height: 100%;
      }
    }
  }
}
</style>
<template>
  <div class="page page-employTke" v-loading="pageLoading">
    <div class="page-employTke-title">
      <div class="title">环境占用信息</div>
      <div>
        <el-button v-if="superPermission" type="primary" size="small" @click="showServerList">服务列表</el-button>
        <el-button v-if="superPermission" type="primary" size="small" @click="showShellList">脚本列表</el-button>
        <el-button type="primary" size="small" :loading="loading.record" @click="viewRecord">查看占用记录</el-button>
        <el-button type="primary" size="small" @click="getEnvInfo">刷新</el-button>
      </div>
    </div>
    <div class="card-box">
      <el-card v-for="(item, index) in envInfoList" :key="item.employEnv" :style="{width: cardWidth, background: item.background}">
        <div v-if="superPermission" class="config">
          <i class="el-icon-edit" @click="handleEdit(item)" style="color:#409EFF;"></i>
          <i class="el-icon-delete" @click="handleDel(item)" style="color:red;margin:0 5px;"></i>
          <i class="el-icon-setting" @click="handleConfig(item)" style="color:#67C23A"></i>
        </div>
        <div class="info">
          <el-col :span="14">
            <el-row class="card-title">占用信息({{item.envName}}) - {{item.envDesc}}</el-row>
            <el-row>当前占用人：<span>{{item.userName}}</span></el-row>
            <el-row>占用时间：<span>{{item.convertUseTime}}</span></el-row>
            <el-row>申请时间：<span>{{item.createTime}}</span></el-row>
            <el-row>结束时间：<span>{{item.useEndTime}}</span></el-row>
          </el-col>
          <el-col :span="10">
            <el-row class="card-title">剩余占用时间</el-row>
            <el-row class="count-down">{{item.convertCountDownTime}}</el-row>
          </el-col>
        </div>
        <div>
          <el-button
            type="info"
            size="mini"
            v-if="item.isShowAddBtn"
            @click="showEmployDialog(item)">申请占用</el-button>
          <el-button
            type="danger"
            size="mini"
            v-if="item.isShowOperateBtn"
            @click="giveUpEnv(item)">放弃占用</el-button>
          <el-button
            type="success"
            size="mini"
            v-if="item.isShowOperateBtn"
            @click="execShell(item)">执行脚本</el-button>
          <el-button
            type="success"
            size="mini"
            @click="execViewTime(item)">查看时间</el-button>
          <el-button
            type="info"
            size="mini"
            :loading="loading.msg && index === msgIndex"
            v-if="!item.isShowOperateBtn && !item.isShowAddBtn"
            @click="sendWxMsg(item, index)">催一催</el-button>
        </div>
        <div class="prompt">提示:为了提高测试效率,请谨慎申请环境占用, 如使用完毕,请及时释放!</div>
      </el-card>
      <el-card v-if="!pageLoading" class="add-card" :style="{width: cardWidth, height: '227px'}" @click.native="addEnv">
        <i class="el-icon-circle-plus"></i>
      </el-card>
    </div>
    <el-dialog title="服务列表"
      class="big-dialog view-dialog"
      :visible.sync="showDialog.serverList"
      center
      width="700px">
      <div class="page-search-bar">
        <el-input
          v-model="serverKeywords"
          placeholder="请输入关键字"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchServer"></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchServer">搜索</el-button>
        <el-button type="success" size="small" icon="el-icon-plus" @click="addServer">新增</el-button>
      </div>
      <div class="table-box" ref="server-table-box">
        <el-table
          v-loading="serverListTableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#FFFAFA)"
          :data="serverList"
          :height="serverTableHeight"
          border
          style="width: 100%">
          <el-table-column prop="id" label="ID" align="center" width="60"></el-table-column>
          <el-table-column prop="employServerName" label="名称" align="center"></el-table-column>
          <el-table-column prop="employServerDesc" label="描述" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="light" content="编辑" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="editServer(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="删除" placement="top">
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="delServer(scope.row.id)"></el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="新增服务"
      :visible.sync="showDialog.addServer"
      center
      width="316px">
      <div>
        <label style="margin-right:10px">服务名称</label>
        <el-input v-model="addServerData.employServerName" clearable placeholder="请填写名称" style="width:200px"></el-input>
      </div>
      <div style="margin: 16px 0">
        <label style="margin-right:10px">服务描述</label>
        <el-input v-model="addServerData.employServerDesc" clearable placeholder="请填写描述" style="width:200px"></el-input>
      </div>
      <div>
        <label style="margin-right:25px">服务IP</label>
        <el-input v-model="addServerData.employServerIp" clearable placeholder="请填写描述" style="width:200px"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="width: 100%" @click="addServerSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改服务"
      :visible.sync="showDialog.editServer"
      center
      width="316px">
      <div>
        <label style="margin-right:10px">服务名称</label>
        <el-input v-model="editServerData.employServerName" clearable placeholder="请填写名称" style="width:200px"></el-input>
      </div>
      <div style="margin: 16px 0">
        <label style="margin-right:10px">服务描述</label>
        <el-input v-model="editServerData.employServerDesc" clearable placeholder="请填写描述" style="width:200px"></el-input>
      </div>
      <div>
        <label style="margin-right:25px">服务IP</label>
        <el-input v-model="editServerData.employServerIp" clearable placeholder="请填写描述" style="width:200px"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="width: 100%" @click="editServerSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="脚本列表"
      class="big-dialog view-dialog"
      :visible.sync="showDialog.shellList"
      center
      width="700px">
      <div class="page-search-bar">
        <el-input
          v-model="shellKeywords"
          placeholder="请输入关键字"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchShell"></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchShell">搜索</el-button>
        <el-button type="success" size="small" icon="el-icon-plus" @click="addShell">新增</el-button>
      </div>
      <div class="table-box" ref="shell-table-box">
        <el-table
          v-loading="shellListTableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#FFFAFA)"
          :data="shellList"
          :height="shellTableHeight"
          border
          style="width: 100%">
          <el-table-column prop="id" label="ID" align="center" width="60"></el-table-column>
          <el-table-column prop="employShellName" label="名称" align="center"></el-table-column>
          <el-table-column prop="employShellDesc" label="描述" align="center"></el-table-column>
          <el-table-column prop="shell" label="shell" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button-group>
                <el-tooltip class="item" effect="light" content="编辑" placement="top">
                  <el-button type="primary" size="mini" icon="el-icon-edit" @click="editShell(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip class="item" effect="light" content="删除" placement="top">
                  <el-button type="danger" size="mini" icon="el-icon-delete" @click="delShell(scope.row.id)"></el-button>
                </el-tooltip>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="新增脚本"
      :visible.sync="showDialog.addShell"
      center
      width="316px">
      <div>
        <label style="margin-right:10px">脚本名称</label>
        <el-input v-model="addShellData.employShellName" clearable placeholder="请填写名称" style="width:200px"></el-input>
      </div>
      <div style="margin-top: 16px">
        <label style="margin-right:10px">脚本描述</label>
        <el-input v-model="addShellData.employShellDesc" clearable placeholder="请填写描述" style="width:200px"></el-input>
      </div>
      <div style="margin-top: 16px">
        <label style="margin-right:36px">shell</label>
        <el-input v-model="addShellData.shell" clearable placeholder="请填写描述" style="width:200px"></el-input>
      </div>
      <div style="margin-top: 16px">
        <label style="margin-right:8px">是否需要参数</label>
        <el-radio-group v-model="addShellData.is_need_param">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 16px" v-if="addShellData.is_need_param === 1">
        <label style="margin-right:36px">参数类型</label>
        <el-radio-group v-model="addShellData.paramType">
          <el-radio :label="0">时间</el-radio>
          <el-radio :label="1">字符串</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 16px">
        <label style="margin-right:36px">是否异步</label>
        <el-radio-group v-model="addShellData.is_async">
          <el-radio :label="1">异步</el-radio>
          <el-radio :label="0">同步</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 16px">
        <label style="margin-right:36px">执行方式</label>
        <el-radio-group v-model="addShellData.execType">
          <el-radio :label="1">脚本机</el-radio>
          <el-radio :label="0">容器</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="width: 100%" @click="addShellSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改脚本"
      :visible.sync="showDialog.editShell"
      center
      width="316px">
      <div>
        <label style="margin-right:10px">脚本名称</label>
        <el-input v-model="editShellData.employShellName" clearable placeholder="请填写名称" style="width:200px"></el-input>
      </div>
      <div style="margin-top: 16px">
        <label style="margin-right:10px">脚本描述</label>
        <el-input v-model="editShellData.employShellDesc" clearable placeholder="请填写描述" style="width:200px"></el-input>
      </div>
      <div style="margin-top: 16px">
        <label style="margin-right:36px">shell</label>
        <el-input v-model="editShellData.shell" clearable placeholder="请填写描述" style="width:200px"></el-input>
      </div>
      <div style="margin-top: 16px">
        <label style="margin-right:8px">是否需要参数</label>
        <el-radio-group v-model="editShellData.is_need_param">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 16px" v-if="editShellData.is_need_param === 1">
        <label style="margin-right:36px">参数类型</label>
        <el-radio-group v-model="editShellData.paramType">
          <el-radio :label="0">时间</el-radio>
          <el-radio :label="1">字符串</el-radio>
        </el-radio-group>
      </div>
      <div style="margin-top: 16px">
        <label style="margin-right:36px">是否异步</label>
        <el-radio-group v-model="editShellData.is_async">
          <el-radio :label="1">异步</el-radio>
          <el-radio :label="0">同步</el-radio>
        </el-radio-group>
      <div style="margin-top: 16px">
        <label style="margin-right:36px">执行方式</label>
        <el-radio-group v-model="editShellData.execType">
          <el-radio :label="1">脚本机</el-radio>
          <el-radio :label="0">容器</el-radio>
        </el-radio-group>
      </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" style="width: 100%" @click="editShellSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="占用记录"
      class="big-dialog view-dialog"
      :visible.sync="showDialog.record"
      center
      width="1000px">
      <div class="page-search-bar">
        <label>环境</label>
        <el-select v-model="recordSearchData.env" clearable>
          <el-option
            v-for="item in envTypeList"
            :key="item.key"
            :label="item.name"
            :value="item.key"></el-option>
        </el-select>
        <label>申请人</label>
        <el-input
          v-model="recordSearchData.keywords"
          placeholder="请输入申请人"
          prefix-icon="el-icon-search"
          clearable
          @keyup.enter.native="searchRecord"></el-input>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchRecord">搜索</el-button>
      </div>
      <div class="table-box" ref="record-table-box">
        <el-table
          v-loading="recordTableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#FFFAFA)"
          :data="recordTableData"
          :height="recordTableHeight"
          border
          style="width: 100%">
          <el-table-column prop="id" label="id" align="center" width="60"></el-table-column>
          <el-table-column prop="employEnvName" label="环境名称" align="center"></el-table-column>
          <el-table-column prop="userName" label="申请人" align="center"></el-table-column>
          <el-table-column prop="isOver" label="状态" align="center">
            <template slot-scope="scope">
              <el-tag
                size="small"
                :type="scope.row.isOver == 1 ? 'success' : 'danger'"
                effect="plain"
              >{{scope.row.isOver == 1 ? '已完成' : '占用中'}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="convertUseTime" label="使用时间" align="center"></el-table-column>
          <el-table-column prop="createTime" label="占用开始时间" min-width="160" align="center"></el-table-column>
          <el-table-column prop="useEndTime" label="占用结束时间" min-width="160" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button
                type="success"
                size="mini"
                icon="el-icon-s-order"
                @click="showEvent(scope.row)"
                plain
              >查看事件</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <Pagination
        :total="total"
        :pageSize="recordSearchData.pageSize"
        :currentPage="recordSearchData.page"
        @on-size-change="handleSizeChange"
        @on-current-change="handleCurrentChange"></Pagination>
    </el-dialog>
    <el-dialog title="环境配置"
      class="big-dialog view-dialog config-dialog"
      :visible.sync="showDialog.config"
      center
      width="800px">
      <div class="tree-box">
        <div class="title">服 务 配 置</div>
        <el-tree
          ref="server-tree"
          :data="allServerList"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="{
            children: 'children',
            label: 'employServerName'
          }"
          @node-click="serverNodeClick">
        </el-tree>
        <el-button type="primary" style="width: 100%;" @click="serverConfigSubmit">提交服务配置</el-button>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="tree-box">
        <div class="title">脚 本 配 置</div>
        <el-tree
          ref="shell-tree"
          :data="allShellListCopy"
          v-loading="shellTreeLoading"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="{
            children: 'children',
            label: 'employShellName'
          }"
          empty-text="请选择服务">
        </el-tree>
        <el-button type="primary" style="width: 100%;" @click="shellConfigSubmit">提交脚本配置</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增环境"
      :visible.sync="showDialog.addEnv"
      center
      width="316px">
      <div>
        <label style="margin-right:10px">环境类型</label>
        <el-select v-model="addEnvData.employEnvType">
          <el-option label="灰度" :value="1"></el-option>
          <el-option label="测试" :value="2"></el-option>
        </el-select>
      </div>
      <div style="margin: 16px 0">
        <label style="margin-right:10px">环境名称</label>
        <el-input v-model="addEnvData.employEnvName" clearable placeholder="请填写名称"></el-input>
      </div>
      <div>
        <label style="margin-right:10px">环境描述</label>
        <el-input v-model="addEnvData.employEnvDesc" clearable placeholder="请填写描述"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.addEnv" type="primary" style="width: 100%" @click="addEnvSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改环境"
      :visible.sync="showDialog.editEnv"
      center
      width="316px">
      <div>
        <label style="margin-right:10px">环境类型</label>
        <el-select v-model="editEnvData.employEnvType">
          <el-option label="灰度" :value="1"></el-option>
          <el-option label="测试" :value="2"></el-option>
        </el-select>
      </div>
      <div style="margin: 16px 0">
        <label style="margin-right:10px">环境名称</label>
        <el-input v-model="editEnvData.employEnvName" clearable placeholder="请填写名称" style="width:200px"></el-input>
      </div>
      <div>
        <label style="margin-right:10px">环境描述</label>
        <el-input v-model="editEnvData.employEnvDesc" clearable placeholder="请填写描述" style="width:200px"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.editEnv" type="primary" style="width: 100%" @click="editEnvSubmit">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog :title="'申请占用 ' + employDialogData.envName"
      :visible.sync="showDialog.employ"
      center
      width="630px">
      <div>
        <label>结束时间</label>
        <el-time-select placeholder="选择结束时间"
          size="small"
          v-model="employDialogData.selectEmployTime"
          :picker-options="{
            start: startTime,
            step: '00:01',
            end: endTime
          }"
          style="width:150px;margin:0 20px 0 10px"></el-time-select>
        <font color="#828282" size="2">提示:为了保障测试效率,环境占用最多四个小时,请谨慎申请!</font>
      </div>
      <div style="margin-top:16px">
        <span style="margin-right:10px;">备注</span>
        <el-input
          v-model="employDialogData.employDesc"
          placeholder="请输入内容"
          type="textarea"
          style="width:540px;vertical-align:text-top;"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="!employDialogData.selectEmployTime" :loading="loading.employ" type="primary" style="width: 100%" @click="employSubmit">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="执行脚本"
      :visible.sync="showDialog.exec"
      center
      width="316px">
      <div>
        <label style="margin-right:10px">选择服务</label>
        <el-select
          v-model="execDialogData.serverId"
          size="small"
          style="width:200px"
          @change="execServerChange">
          <el-option
            v-for="item in employServerList"
            :key="item.name"
            :label="item.employServerName"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div style="margin: 16px 0">
        <label style="margin-right:10px">选择脚本</label>
        <el-select
          v-model="execDialogData.shellId"
          size="small"
          style="width:200px"
          @change="execShellChange">
          <el-option
            v-for="item in shellArray"
            :key="item.key"
            :label="item.employShellName"
            :value="item.id"></el-option>
        </el-select>
      </div>
      <div v-if="execShellInfo.isNeedParam == '1'">
        <div v-if="execShellInfo.paramType === 0">
          <label style="margin-right:10px">选择时间</label>
          <el-date-picker
            v-model="execDialogData.params"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择要修改的时间"
            size="small"
            style="width:200px"></el-date-picker>
        </div>
        <div v-if="execShellInfo.paramType === 1">
          <label style="margin-right:10px">输入参数</label>
          <el-input v-model="execDialogData.params" placeholder="请输入"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.exec" type="primary" style="width: 100%" @click="execSubmit">执行脚本</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看时间"
      :visible.sync="showDialog.execViewTime"
      center
      width="316px">
      <label style="margin-right:10px">选择服务</label>
      <el-select
        v-model="execViewTimeData.serverId"
        clearable 
        size="small"
        style="width:200px">
        <el-option
          v-for="item in employServerList"
          :key="item.name"
          :label="item.employServerName"
          :value="item.id"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button :loading="loading.execViewTime" type="primary" style="width: 100%" @click="execViewTimeSubmit">执行脚本</el-button>
      </span>
    </el-dialog>
    <el-dialog title="查看事件"
      class="big-dialog view-dialog"
      :visible.sync="showDialog.event"
      center
      width="800px">
      <div class="page-search-bar">
        <label>选择脚本</label>
        <el-select v-model="eventType" clearable>
          <el-option
            v-for="item in eventTypeArray"
            :key="item.id"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" size="small" icon="el-icon-search" @click="searchEvent">搜索</el-button>
      </div>
      <div class="table-box" ref="event-table-box">
        <el-table
          v-loading="eventTableLoading"
          element-loading-text="拼命加载中"
          element-loading-spinner="el-icon-loading"
          element-loading-background="#FFFAFA)"
          :data="eventTableData"
          :height="eventTableHeight"
          border
          style="width: 100%">
          <el-table-column prop="id" label="ID" align="center" width="60"></el-table-column>
          <el-table-column prop="eventType" label="类型" :formatter="fatEventType" align="center" width="100"></el-table-column>
          <el-table-column prop="eventDesc" label="描述" align="center"></el-table-column>
          <el-table-column prop="createTime" label="执行时间" align="center" width="170"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
  components: { Pagination },
  data () {
    return {
      pageLoading: false,
      // 配置
      currentEnvId: '',
      allServerList: [],
      checkServerList: [],
      currentServerId: '',
      allShellList: [],
      allShellListCopy: [],
      shellTreeLoading: false,
      checkShellList: [],
      // 服务
      serverTableHeight: null,
      serverKeywords: '',
      serverList: [],
      serverListTableLoading: false,
      addServerData: {
        employServerName: '',
        employServerDesc: '',
        employServerIp: ''
      },
      editServerData: {
        id: '',
        employServerName: '',
        employServerDesc: '',
        employServerIp: ''
      },
      // 脚本
      shellTableHeight: null,
      shellKeywords: '',
      shellList: [],
      shellListTableLoading: false,
      addShellData: {
        employShellName: '',
        employShellDesc: '',
        shell: '',
        is_need_param: '',
        paramType: '',
        is_async: '',
        execType: ''
      },
      editShellData: {
        id: '',
        employShellName: '',
        employShellDesc: '',
        shell: '',
        is_need_param: '',
        paramType: '',
        is_async: '',
        execType: ''
      },
      // 记录
      recordSearchData: {
        keywords: '',
        env: '',
        page: 1,
        pageSize: 20
      },
      recordTableLoading: false,
      recordTableHeight: null,
      recordTableData: [],
      total: 0,
      eventType: '',
      employId: '',
      eventTableLoading: false,
      eventTableHeight: null,
      eventTableData: [],
      // 卡片
      cardWidth: null,
      envInfoList: [],
      timer: null,
      msgIndex: null,
      startTime: '00:00',
      endTime: '00:00',
      // 弹框
      showDialog: {
        employ: false,
        exec: false,
        execViewTime: false,
        record: false,
        event: false,
        addEnv: false,
        editEnv: false,
        serverList: false,
        addServer: false,
        editServer: false,
        shellList: false,
        addShell: false,
        editShell: false,
        config: false
      },
      // loading
      loading: {
        employ: false,
        exec: false,
        execViewTime: false,
        msg: false,
        record: false,
        event: false,
        addEnv: false,
        editEnv: false,
        serverConfig: false,
        shellConfig: false
      },
      // 新增环境
      addEnvData: {
        employEnvType: 1,
        employEnvName: '',
        employEnvDesc: ''
      },
      editEnvData: {
        id: '',
        employEnvType: '',
        employEnvName: '',
        employEnvDesc: ''
      },
      employDialogData: {
        employEnv: '',
        envName: '',
        selectEmployTime: '',
        employDesc: ''
      },
      execShellInfo: {},
      execDialogData: {
        employEnvListId: '',
        serverId: '',
        shellId: '',
        params: ''
      },
      execViewTimeData: {
        serverId: '',
        envId: ''
      },
      envTypeList: [
        { key: 1, name: 'gray-01' },
        { key: 2, name: 'gray-02' },
      ],
      eventTypeArray: [
        { id: 1, name: '执行脚本' },
        { id: 2, name: '发布服务' },
      ],
      shellArray: [],
      employServerList: []
    }
  },
  computed: {
    superPermission () {
      return this.$store.state.permission.includes('/employTke/superAdmin')
    }
  },
  created () {
    this.getEnvInfo()
  },
  destroyed () {
    clearInterval(this.timer)
  },
  mounted () {
    this.calcCardWidth()
    window.onresize = () => {
      this.calcCardWidth()
      this.$nextTick(() => {
        if (this.showDialog.record) {
          this.recordTableHeight = this.$refs['record-table-box'].offsetHeight
        }
        if (this.showDialog.event) {
          this.eventTableHeight = this.$refs['event-table-box'].offsetHeight
        }
        if (this.showDialog.shellList) {
          this.shellTableHeight = this.$refs['shell-table-box'].offsetHeight
        }
        if (this.showDialog.serverList) {
          this.serverTableHeight = this.$refs['server-table-box'].offsetHeight
        }
      })
    }
  },
  methods: {
    // 配置
    handleConfig (item) {
      this.currentEnvId = item.employEnv
      this.$service.getEnvServerList().then(res => {
        this.allServerList = res.data
        this.showDialog.config = true
        this.$service.getSelectServer({ envId: item.employEnv }).then(res => {
          this.$refs['server-tree'].setCheckedNodes(res.data)
        })
      })
      this.$service.getEnvShellList().then(res => {
        this.allShellList = res.data
      })
    },
    serverNodeClick (data) {
      this.shellTreeLoading = true
      this.allShellListCopy = JSON.parse(JSON.stringify(this.allShellList))
      this.currentServerId = data.id
      this.$service.getSelectShell({ serverId: data.id }).then(res => {
        this.$refs['shell-tree'].setCheckedNodes(res.data)
      }).finally(() => {
        this.shellTreeLoading = false
      })
    },
    serverConfigSubmit () {
      this.loading.serverConfig = true
      let list = this.$refs['server-tree'].getCheckedKeys()
      this.$service.relationServer({
        envId: this.currentEnvId,
        selectServerList: list
      }).then(() => {
        this.$message.success('服务配置成功')
      }).finally(() => {
        this.loading.serverConfig = false
      })
    },
    shellConfigSubmit () {
      this.loading.shellConfig = true
      let list = this.$refs['shell-tree'].getCheckedKeys()
      this.$service.relationShell({
        serverId: this.currentServerId,
        selectShellList: list
      }).then(() => {
        this.$message.success('脚本配置成功')
      }).finally(() => {
        this.loading.shellConfig = false
      })
    },
    // 脚本
    showShellList () {
      this.showDialog.shellList = true
      this.shellKeywords = ''
      this.$nextTick(() => {
        this.shellTableHeight = this.$refs['shell-table-box'].offsetHeight
      })
      this.searchShell()
    },
    searchShell () {
      this.shellListTableLoading = true
      this.$service.getEnvShellList({ keywords: this.shellKeywords }).then(res => {
        this.shellList = res.data
      }).finally(() => {
        this.shellListTableLoading = false
      })
    },
    addShell () {
      this.addShellData = {
        employShellName: '',
        employShellDesc: '',
        shell: '',
        is_need_param: '',
        paramType: '',
        is_async: '',
        execType: ''
      }
      this.showDialog.addShell = true
    },
    addShellSubmit () {
      if (!this.addShellData.employShellName ||
        !this.addShellData.employShellDesc ||
        !this.addShellData.shell ||
        this.addShellData.is_need_param === '' ||
        this.addShellData.is_async === '' ||
        this.addShellData.execType === ''
      ) {
        this.$message.error('请填全信息')
        return
      }
      this.$service.addEnvShell(this.addShellData).then(() => {
        this.$message.success('脚本新增成功')
        this.showDialog.addShell = false
        this.searchShell()
      })
    },
    editShell (row) {
      this.editShellData = {
        id: row.id,
        employShellName: row.employShellName,
        employShellDesc: row.employShellDesc,
        shell: row.shell,
        is_need_param: row.isNeedParam,
        paramType: row.paramType,
        is_async: row.isAsync,
        execType: row.execType
      }
      this.showDialog.editShell = true
    },
    editShellSubmit () {
      if (!this.editShellData.employShellName ||
        !this.editShellData.employShellDesc ||
        !this.editShellData.shell ||
        this.editShellData.is_need_param === '' ||
        this.editShellData.is_async === '' ||
        this.editShellData.execType === ''
      ) {
        this.$message.error('请填全信息')
        return
      }
      this.$service.editEnvShell(this.editShellData).then(() => {
        this.$message.success('脚本新增成功')
        this.showDialog.editShell = false
        this.searchShell()
      })
    },
    delShell (id) {
      this.$msgbox.confirm('确认删除此脚本?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.delEnvShell({ shellId: id }).then(() => {
          this.$message.success('删除成功')
          this.searchShell()
        })
      })
    },
    // 服务
    showServerList () {
      this.showDialog.serverList = true
      this.serverKeywords = ''
      this.$nextTick(() => {
        this.serverTableHeight = this.$refs['server-table-box'].offsetHeight
      })
      this.searchServer()
    },
    searchServer () {
      this.serverListTableLoading = true
      this.$service.getEnvServerList({ keywords: this.serverKeywords }).then(res => {
        this.serverList = res.data
      }).finally(() => {
        this.serverListTableLoading = false
      })
    },
    addServer () {
      this.addServerData = {
        employServerName: '',
        employServerDesc: '',
        employServerIp: ''
      }
      this.showDialog.addServer = true
    },
    addServerSubmit () {
      if (!this.addServerData.employServerName ||
        !this.addServerData.employServerDesc
      ) {
        this.$message.error('请填全信息')
        return
      }
      this.$service.addEnvServer(this.addServerData).then(() => {
        this.$message.success('服务新增成功')
        this.showDialog.addServer = false
        this.searchServer()
      })
    },
    editServer (row) {
      this.editServerData = {
        id: row.id,
        employServerName: row.employServerName,
        employServerDesc: row.employServerDesc,
        employServerIp: row.employServerIp
      }
      this.showDialog.editServer = true
    },
    editServerSubmit () {
      if (!this.editServerData.employServerName ||
        !this.editServerData.employServerDesc
      ) {
        this.$message.error('请填全信息')
        return
      }
      this.$service.editEnvServer(this.editServerData).then(() => {
        this.$message.success('服务修改成功')
        this.showDialog.editServer = false
        this.searchServer()
      })
    },
    delServer (id) {
      this.$msgbox.confirm('确认删除此服务?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.delEnvServer({ serverId: id }).then(() => {
          this.$message.success('删除成功')
          this.searchServer()
        })
      })
    },
    // 新增环境
    addEnv () {
      if (!this.superPermission) {
        this.$message.error('请联系管理员')
        return
      }
      this.addEnvData = {
        employEnvType: 1,
        employEnvName: '',
        employEnvDesc: ''
      }
      this.showDialog.addEnv = true
    },
    addEnvSubmit () {
      if (!this.addEnvData.employEnvName || !this.addEnvData.employEnvDesc) {
        this.$message.error('请填全信息')
        return
      }
      this.loading.addEnv = true
      this.$service.addEnv(this.addEnvData).then(() => {
        this.$message.success('环境新增成功')
        this.showDialog.addEnv = false
        this.getEnvInfo()
      }).finally(() => {
        this.loading.addEnv = false
      })
    },
    // 删除
    handleDel (item) {
      this.$msgbox.confirm('确认删除此环境?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.delEnv({ envId: item.employEnv }).then(() => {
          this.$message.success('删除成功')
          this.getEnvInfo()
        })
      })
    },
    // 修改
    handleEdit (item) {
      this.editEnvData = {
        id: item.employEnv,
        employEnvType: item.envType,
        employEnvName: item.envName,
        employEnvDesc: item.envDesc
      }
      this.showDialog.editEnv = true
    },
    editEnvSubmit () {
      if (!this.editEnvData.employEnvName || !this.editEnvData.employEnvDesc) {
        this.$message.error('请填全信息')
        return
      }
      this.loading.editEnv = true
      this.$service.updateEnv(this.editEnvData).then(() => {
        this.$message.success('环境修改成功')
        this.showDialog.editEnv = false
        this.getEnvInfo()
      }).finally(() => {
        this.loading.editEnv = false
      })
    },
    // 查看事件
    showEvent (row) {
      this.eventType = ''
      this.eventTableData = []
      this.employId = row.id
      this.loading.event = true
      this.showDialog.event = true
      this.$nextTick(() => {
        this.eventTableHeight = this.$refs['event-table-box'].offsetHeight
      })
      this.searchEvent()
    },
    searchEvent () {
      this.eventTableLoading = true
      this.$service.getEmployEnvRecordList({
        employId: this.employId,
        recordType: this.eventType,
      }).then(res => {
        this.eventTableData = res.data
      }).finally(() => {
        this.loading.event = false
        this.eventTableLoading = false
      })
    },
    fatEventType (row) {
      let item = this.eventTypeArray.find((item) => item.id === row.eventType)
      return item == undefined ? '' : item.name
    },
    // 查看占用记录
    viewRecord () {
      this.recordSearchData = {
        keywords: '',
        env: '',
        page: 1,
        pageSize: 20
      }
      this.recordTableData = []
      this.loading.record = true
      this.showDialog.record = true
      this.$nextTick(() => {
        this.recordTableHeight = this.$refs['record-table-box'].offsetHeight
      })
      this.getRecordList()
    },
    searchRecord () {
      this.recordSearchData.page = 1
      this.getRecordList()
    },
    getRecordList () {
      let params = JSON.parse(JSON.stringify(this.recordSearchData))
      params.size = params.pageSize
      delete params.pageSize
      this.recordTableLoading = true
      this.$service.getEmployList(params).then(res => {
        this.recordTableData = res.data.data
        this.total = res.data.total
      }).finally(() => {
        this.loading.record = false
        this.recordTableLoading = false
      })
    },
    // 切换每页条数
    handleSizeChange (value) {
      this.recordSearchData.pageSize = value
      this.recordSearchData.page = 1
      this.getRecordList()
    },
    // 切换页码
    handleCurrentChange (value) {
      this.recordSearchData.page = value
      this.getRecordList()
    },
    // 催一催
    sendWxMsg (item, index) {
      this.msgIndex = index
      this.loading.msg = true
      this.$service.sendEmployWxMsg({
        userId: item.userId,
        env: item.employEnv
      }).then(() => {
        this.$message.success('催一催成功，请耐心等待或者直接去企业微信联系')
        this.getEnvInfo()
      }).finally(() => {
        this.loading.msg = false
      })
    },
    // 执行脚本
    execShell (item) {
      this.execDialogData = {
        employEnvListId: item.id,
        serverId: '',
        shellId: '',
        params: ''
      }
      this.$service.getSelectServer({ envId: item.employEnv }).then(res => {
        this.employServerList = res.data
      })
      this.showDialog.exec = true
    },
    execServerChange (id) {
      this.execDialogData.shellId = ''
      this.execShellInfo = {}
      this.$service.getSelectShell({ serverId: id }).then(res => {
        this.shellArray = res.data
      })
    },
    execShellChange (id) {
      this.execShellInfo = this.shellArray.find(item => item.id === id)
    },
    execSubmit () {
      if(this.execDialogData.serverId === '' || this.execDialogData.shellId === ''){
        this.$message.error('请填写必要信息')
        return
      }
      this.loading.exec = true
        this.$service.execEmployShell(this.execDialogData).then(res => {
        this.$message.success(this.execShellInfo.isAsync == '0' ? res.data : '执行脚本成功')
        this.showDialog.exec = false
        this.getEnvInfo()
      }).finally(() => {
        this.loading.exec = false
      })
    },
    // 查看时间
    execViewTime (item) {
      this.$service.getSelectServer({ envId: item.employEnv }).then(res => {
        this.employServerList = res.data
      })
      this.execViewTimeData = {
        serverId: '',
        envId: item.employEnv
      }
      this.showDialog.execViewTime = true
    },
    execViewTimeSubmit () {
      if(!this.execViewTimeData.serverId){
        this.$message.error('请选择服务')
        return
      }
      this.loading.execViewTime = true
      this.$service.employEnvGetDate(this.execViewTimeData).then(res => {
        this.$message.success(res.data)
        this.showDialog.execViewTime = false
        this.getEnvInfo()
      }).finally(() => {
        this.loading.execViewTime = false
      })
    },
    // 占用申请
    showEmployDialog (item) {
      this.employDialogData = {
        employEnv: item.employEnv,
        envName: item.envName,
        selectEmployTime: '',
        employDesc: ''
      }
      let now = new Date()
      let h = now.getHours()
      let m = now.getMinutes()
      this.startTime = h + ':' + this.pad(m + 2)
      this.endTime = h + 4 > 23 ? '23:59' : h + 4 + ':' + m
      this.showDialog.employ = true
    },
    employSubmit () {
      let params = JSON.parse(JSON.stringify(this.employDialogData))
      delete params.envName
      this.loading.employ = true
      this.$service.addEmployEnv(params).then(() => {
        this.$message.success('占用环境申请成功,立即生效')
        this.showDialog.employ = false
        this.getEnvInfo()
      }).finally(() => {
        this.loading.employ = false
      })
    },
    // 放弃占用
    giveUpEnv (item) {
      this.$msgbox.confirm('即将放弃占用' + item.envName + '环境, 是否继续?', '提示', {
        type: 'warning',
        center: true
      }).then(() => {
        this.$service.giveUpEmployEnv({ employId: item.id }).then(() => {
          this.$message.success('取消占用环境,立即生效')
          this.getEnvInfo()
        })
      })
    },
    // 计算动态卡片宽度
    calcCardWidth () {
      let cardNum = Math.floor(document.querySelector('.page-employTke').clientWidth / 500)
      this.cardWidth = `calc(${100 / cardNum}% - 20px)`
    },
    // 开始倒计时
    startCountDown() {
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.envInfoList.forEach(item => {
            if (item.useEndTime) {
              let now = (new Date()).getTime()
              let end = (new Date(item.useEndTime)).getTime()
              let leftTime = end - now
              let h, m, s
              if (leftTime > 0) {
                h = this.pad(Math.floor(leftTime / 1000 / 60 / 60 % 24))
                m = this.pad(Math.floor(leftTime / 1000 / 60 % 60))
                s = this.pad(Math.floor(leftTime / 1000 % 60))
                item.convertCountDownTime = `${h}:${m}:${s}`
              } else {
                this.getEnvInfo()
              }
            }
          })
        }, 1000)
      }
    },
    pad(n) {
      return (n < 10 ? '0' : '') + n
    },
    getEnvInfo () {
      this.pageLoading = true
      this.$service.getEmployEnv().then(res => {
        this.envInfoList = res.data.envInfoList
        if (res.data.envInfoList.length) {
          this.startCountDown()
        }
      }).finally(() => {
        this.pageLoading = false
      })
    }
  }
}
</script>