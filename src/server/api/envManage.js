import Axios from '../axios'

/*****************  环境问题记录  *******************/
/**
 * 新增
 */
export const addEtcdEnv = data => {
  return Axios({
    url: '/etcd/addEtcdEnv',
    method: 'post',
    data
  })
}

/**
 * 修改
 */
export const updateEtcdEnv = data => {
  return Axios({
    url: '/etcd/updateEtcdEnv',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export const deleteEtcdEnv = data => {
  return Axios({
    url: '/etcd/deleteEtcdEnv',
    data
  })
}

/**
 * 同步
 */
export const etcdTemplateSynchronization = data => {
  return Axios({
    url: '/etcdTemplate/synchronization',
    method: 'post',
    data
  })
}

/**
 * 数据备份
 */
export const getSettingFromEnv = data => {
  return Axios({
    url: '/etcd/getSettingFromEnv',
    data
  })
}

/**
 * 数据恢复
 */
export const rollBackFromDb = data => {
  return Axios({
    url: '/etcd/rollBackFromDb',
    data
  })
}

/**
 * 数据删除
 */
export const deleteEnvSetting = data => {
  return Axios({
    url: '/etcd/deleteEnvSetting',
    data
  })
}

/**
 * 同步新环境
 */
export const etcdTemplateCopy = data => {
  return Axios({
    url: '/etcdTemplate/copy',
    data
  })
}

/*****************  环境问题记录  *******************/

/**
 * 获取列表
 */
export const listProblemRecord = data => {
  return Axios({
    url: '/problem/listProblem',
    data
  })
}

/**
 * 新增记录
 */
export const addProblemRecord = data => {
  return Axios({
    url: '/problem/addProblem',
    method: 'post',
    data
  })
}

/**
 * 修改记录
 */
export const updateProblem = data => {
  return Axios({
    url: '/problem/updateProblem',
    method: 'post',
    data
  })
}

/*****************  Tke服务列表  *******************/

/**
 * 获取列表
 */
export const getServerStatusList = data => {
  return Axios({
    url: '/tkeStatus/getServerStatusList',
    data
  })
}

/*****************  Tke服务列表  *******************/

/**
 * 获取列表
 */
export const getTkeServerList = data => {
  return Axios({
    url: '/tkeStatus/getServerList',
    data
  })
}

/**
 * 新增服务
 */
export const addTkeProject = data => {
  return Axios({
    url: '/tkeStatus/insertProject',
    method: 'post',
    data
  })
}

/** 
 * 停用/启用/更新
 */
export const updateTkeProject = data => {
  return Axios({
    url: '/tkeStatus/updateServer',
    method: 'post',
    data
  })
}

/*****************  配置修改备案  *******************/

/**
 * 获取列表
 */
export const getRecordList = data => {
  return Axios({
    url: '/editRecord/getList',
    method: 'post',
    data
  })
}

/** 
 * 新增修改备案
 * */
export const addRecord = data => {
  return Axios({
    url: '/editRecord/addRecord',
    method: 'post',
    data
  })
}

/** 
 * 编辑修改备案
 * */
export const updateRecord = data => {
  return Axios({
    url: '/editRecord/updateRecord',
    method: 'post',
    data
  })
}

/** 
 * 获取备案详情
 * */
export const getRecordDetail = data => {
  return Axios({
    url: '/editRecord/getDetailById',
    data
  })
}

/**
 * 删除
 */
export const deleteRecord = data => {
  return Axios({
    url: '/editRecord/deleteById',
    data
  })
}

/*****************  环境部署记录  *******************/

/**
 * 获取表格数据
 */
export const listEmployRecord = data => {
  return Axios({
    url: '/employRecord/listEmployRecord',
    data
  })
}

/*****************  一键更新配置  *******************/

/**
 * 获取表格数据
 */
export const getSyncConfigList = data => {
  return Axios({
    url: '/syncEnvConfig/getConfigList',
    data
  })
}

/**
 * 同步服务
 */
export const syncServer = data => {
  return Axios({
    url: '/syncEnvConfig/syncServer',
    method: 'post',
    data
  })
}

/**
 * 启用/停用
 */
export const changedConfigStatus = data => {
  return Axios({
    url: '/syncEnvConfig/changeStatus',
    data
  })
}

/**
 * 新增环境
 */
export const addConfigEnv = data => {
  return Axios({
    url: '/syncEnvConfig/addConfigEnv',
    method: 'post',
    data
  })
}

/*****************  灰度白名单申请  *******************/

/**
 * 获取表格数据
 */
export const getGreyWhiteList = data => {
  return Axios({
    url: '/greyWhiteList/getList',
    data
  })
}

/**
 * 新增
 */
export const addGreyWhite = data => {
  return Axios({
    url: '/greyWhiteList/insertGreyWhite',
    method: 'post',
    data
  })
}

/**
 * 修改cookie
 */
export const saveCookie = data => {
  return Axios({
    url: '/greyWhiteList/saveCookie',
    data
  })
}

/**
 * 同步
 */
export const syncGrey = data => {
  return Axios({
    url: '/greyWhiteList/syncGrey',
    method: 'post',
    data
  })
}

/*****************  环境一键更新  *******************/

/**
 * 模糊查询用户
 */
export const loadUsers = data => {
  return Axios({
    url: '/mgr/queryUser',
    data
  })
}

/**
 * 获取表格数据
 */
export const getEnvTask = data => {
  return Axios({
    url: '/syncEnv/getEnvTask',
    data
  })
}

/**
 * 新增任务
 */
export const mergeEnv = data => {
  return Axios({
    url: '/syncEnv/mergeEnv',
    method: 'post',
    data
  })
}

/**
 * 获取服务列表
 */
export const getServerList = data => {
  return Axios({
    url: '/syncEnv/getServerList',
    data
  })
}

/**
 * 置为完成
 */
export const setTaskComplete = data => {
  return Axios({
    url: '/syncEnv/setTaskComplete',
    data
  })
}

/**
 * 任务详情
 */
export const getTaskDetail = data => {
  return Axios({
    url: '/syncEnv/getTaskDetail',
    data
  })
}

/**
 * 重试 deployStatus: -1
 */
export const deployServer = data => {
  return Axios({
    url: '/syncEnv/deployServer',
    data
  })
}

/**
 * 重试 deployStatus: 1、2
 */
export const updateDeployStatus = data => {
  return Axios({
    url: '/syncEnv/updateDeployStatus',
    data
  })
}

/**
 * 取消
 */
export const canceDeploylByProduct = data => {
  return Axios({
    url: '/syncEnv/cancelByProduct',
    data
  })
}

/*****************  环境占用申请  *******************/

/**
 * 服务列表
 */
export const getEnvServerList = data => {
  return Axios({
    url: '/employEnvSetting/listEnvServer',
    data
  })
}

/**
 * 新增服务
 */
export const addEnvServer = data => {
  return Axios({
    url: '/employEnvSetting/insertEnvServer',
    method: 'post',
    data
  })
}

/**
 * 修改服务
 */
export const editEnvServer = data => {
  return Axios({
    url: '/employEnvSetting/updateEmployServer',
    method: 'post',
    data
  })
}

/**
 * 删除服务
 */
export const delEnvServer = data => {
  return Axios({
    url: '/employEnvSetting/delEmployServer',
    data
  })
}

/**
 * 脚本列表
 */
export const getEnvShellList = data => {
  return Axios({
    url: '/employEnvSetting/listShellList',
    data
  })
}

/**
 * 新增脚本
 */
export const addEnvShell = data => {
  return Axios({
    url: '/employEnvSetting/insertServerShell',
    method: 'post',
    data
  })
}

/**
 * 修改脚本
 */
export const editEnvShell = data => {
  return Axios({
    url: '/employEnvSetting/updateEmployShell',
    method: 'post',
    data
  })
}


/**
 * 删除脚本
 */
export const delEnvShell = data => {
  return Axios({
    url: '/employEnvSetting/delEmployShell',
    data
  })
}

/**
 * 获取占用记录
 */
export const getEmployList = data => {
  return Axios({
    url: '/employEnv/getEmployList',
    data
  })
}

/**
 * 新增环境
 */
export const addEnv = data => {
  return Axios({
    url: '/employEnvSetting/insertEnv',
    method: 'post',
    data
  })
}

/**
 * 删除环境
 */
export const delEnv = data => {
  return Axios({
    url: '/employEnvSetting/delEnv',
    data
  })
}

/**
 * 编辑环境
 */
export const updateEnv = data => {
  return Axios({
    url: '/employEnvSetting/updateEnv',
    method: 'post',
    data
  })
}

/**
 * 获取环境下所有服务
 */
export const getSelectServer = data => {
  return Axios({
    url: '/employEnvSetting/getSelectServer',
    data
  })
}

/**
 * 配置服务
 */
export const relationServer = data => {
  return Axios({
    url: '/employEnvSetting/relationServer',
    method: 'post',
    data
  })
}

/**
 * 获取服务下的脚本
 */
export const getSelectShell = data => {
  return Axios({
    url: '/employEnvSetting/getSelectShell',
    data
  })
}

/**
 * 配置脚本
 */
export const relationShell = data => {
  return Axios({
    url: '/employEnvSetting/relationShell',
    method: 'post',
    data
  })
}

/**
 * 查看事件
 */
export const getEmployEnvRecordList = data => {
  return Axios({
    url: '/employEnv/getEmployRecordById',
    data
  })
}

/**
 * 获取环境
 */
export const getEmployEnv = data => {
  return Axios({
    url: '/employEnv/getInitData',
    data
  })
}

/**
 * 环境占用申请
 */
export const addEmployEnv = data => {
  return Axios({
    url: '/employEnv/addEmployEnv',
    method: 'post',
    data
  })
}

/**
 * 放弃占用
 */
export const giveUpEmployEnv = data => {
  return Axios({
    url: '/employEnv/giveUpEnv',
    data
  })
}

/**
 * 执行脚本
 */
export const execEmployShell = data => {
  return Axios({
    url: '/employEnv/execShell',
    method: 'post',
    data
  })
}

/**
 * 查看时间
 */
export const employEnvGetDate = data => {
  return Axios({
    url: '/employEnv/getEnvDate',
    data
  })
}

/**
 * 催一催
 */
export const sendEmployWxMsg = data => {
  return Axios({
    url: '/employEnv/sendWxMsg',
    data
  })
}

/*****************  环境部署状态  *******************/

/**
 * 获取环境列表
 */
export const selectAllConfigEnv = data => {
  return Axios({
    url: '/syncEnvConfig/selectAllConfigEnv',
    data
  })
}

/**
 * 获取部署状态列表
 */
export const getAllMoudleStatus = data => {
  return Axios({
    url: '/k8s/getAllMoudle',
    data
  })
}

/**
 * 服务对比
 */
export const showDiffStatus = data => {
  return Axios({
    url: '/k8s/checkModule',
    data
  })
}

/*****************  ETCD配置检查  *******************/

/**
 * 获取结果
 */
export const getResultByCheckId = data => {
  return Axios({
    url: '/etcd/getResultByCheckId',
    data
  })
}

/**
 * 获取key的列表
*/
export const getKeyList = data => {
  return Axios({
    url: '/etcd/getKeyList',
    data
  })
}

/**
 * 获取key的列表条数
*/
export const getCheckCount = data => {
  return Axios({
    url: '/etcd/getCheckCount',
    data
  })
}

/**
 * 检查
 */
export const check = data => {
  return Axios({
    url: '/etcd/check',
    method: 'post',
    data
  })
}

/**
 * 获取白名单
 */
export const getAllIgnore = data => {
  return Axios({
    url: '/etcd/getIgnoreList',
    data
  })
}

/**
 * 同步
*/
export const syncKey = data => {
  return Axios({
    url: '/etcd/syncKey',
    method: 'post',
    data
  })
}

/**
 * 添加/移除白名单
*/
export const changeKey = data => {
  return Axios({
    url: '/etcd/changeKey',
    method: 'post',
    data
  })
}

/**
 * 对比
 */
export const getByKeyAndEnv = data => {
  return Axios({
      url: '/etcd/getByKeyAndEnv',
      data
  })
}

/*****************  ETCD配置查看  *******************/
/**
 * 获取环境列表
 */
export const getEtcdEnv = data => {
  return Axios({
    url: '/etcd/getEnv',
    data
  })
}

/**
 * 根据env 获取etcd key name 的树形结构
 */
export const getKeyTreeByEnv = data => {
  return Axios({
    url: '/etcd/getKeyTreeByEnv',
    data
  })
}

/**
 * 获取配置内容
 */
export const getSettingByEnvAndKey = data => {
  return Axios({
    url: '/etcd/getSettingByEnvAndKey',
    data
  })
}

/**
 * 新增配置
 */
export const addKeyOnTree = data => {
  return Axios({
    url: '/etcd/addKeyOnTree',
    method: 'post',
    data
  })
}

/**
 * 更新配置
 */
export const updateKeyOnTree = data => {
  return Axios({
    url: '/etcd/updateKeyOnTree',
    method: 'post',
    data
  })
}

/*****************  模板配置（ETCD配置查看2）  *******************/
/**
 * 获取环境列表
 */
export const getTemplateEtcdEnv = data => {
  return Axios({
    url: '/etcdTemplate/getEnv',
    data
  })
}

/**
 * 根据env 获取etcd key name 的树形结构
 */
export const getTemplateKeyTreeByEnv = data => {
  return Axios({
    url: '/etcdTemplate/getKeyTreeByEnv',
    data
  })
}

/**
 * 获取配置内容
 */
export const getTemplateSettingByEnvAndKey = data => {
  return Axios({
    url: '/etcdTemplate/getSettingByEnvAndKey',
    data
  })
}

/**
 * 新增配置
 */
export const addTemplateKeyOnTree = data => {
  return Axios({
    url: '/etcdTemplate/addKeyOnTree',
    method: 'post',
    data
  })
}

/**
 * 更新配置
 */
export const updateTemplateKeyOnTree = data => {
  return Axios({
    url: '/etcdTemplate/updateKeyOnTree',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export const deleteTemplateKeyOnTree = data => {
  return Axios({
    url: '/etcdTemplate/deleteKeyOnTree',
    method: 'post',
    data
  })
}

/*****************  ETCD配置权限  *******************/
/**
 * 获取列表
 */
export const getEtcdPermList = data => {
  return Axios({
    url: '/etcdPermission/getList',
    data
  })
}

/**
 * 新增
 */
export const addEtcdPerm = data => {
  return Axios({
    url: '/etcdPermission/addConfig',
    method: 'post',
    data
  })
}

/**
 * 编辑
 */
export const editEtcdPerm = data => {
  return Axios({
    url: '/etcdPermission/editConfig',
    method: 'post',
    data
  })
}

/*****************  ETCD配置管理  *******************/

/**
 * 可搜索配置列表
 */
export const getEtcdKey = data => {
  return Axios({
    url: '/etcd/getEtcdKey',
    method: 'post',
    data
  })
}

/**
 * 新增配置
 */
export const addEtcdKey = data => {
  return Axios({
    url: '/etcd/addKey',
    method: 'post',
    data
  })
}

/**
 * 修改etcd配置路径
 */
export const copyKeyToPath = data => {
  return Axios({
    url: '/etcd/copyKeyToPath',
    method: 'post',
    data
  })
}

/**
 * 同步路径
 */
export const syncPathKeyToEnv = data => {
  return Axios({
    url: '/etcd/syncPathKeyToEnv',
    method: 'post',
    data
  })
}

/**
 * 修改测试白名单信息
 */
export const editTestWhiteList = data => {
  return Axios({
    url: '/etcd/editTestWhiteList',
    method: 'post',
    data
  })
}

/**
 * 从文件导入etcd配置
 */
export const importEtcdSetting = data => {
  return Axios({
    url: '/etcd/importSettingFromFile',
    method: 'post',
    data
  })
}

/**
 * 更新key
 */
export const updateEtcdKey = data => {
  return Axios({
    url: '/etcd/updateKey',
    method: 'post',
    data
  })
}

/**
 * 删除key
 */
export const deleteEtcdKey = data => {
  return Axios({
    url: '/etcd/deleteKey',
    method: 'post',
    data
  })
}

/*****************  ETCD操作列表  *******************/

/**
 * 获取操作列表
 */
export const listEtcdOperateRecord = data => {
  return Axios({
    url: '/etcdRecord/listOperateRecord',
    data
  })
}
/**
 * 操作回滚
 */
export const rollBackByRecord = data => {
  return Axios({
    url: '/etcdRecord/rollBackByRecord',
    data
  })
}
/**
 * 获取详情
 */
export const getRecordInfo = data => {
  return Axios({
    url: '/etcdRecord/getRecordInfo',
    data
  })
}