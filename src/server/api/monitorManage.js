import Axios from '../axios'

/*****************  监控服务  *******************/
/**
 * 获取用户列表
 */
export const test = data => {
  return Axios({
      url: '/mgr/listUser',
      data
  })
}

/**
 * 新增脚本
 */
export const addShell = data => {
  return Axios({
      // url: '/testStressInfo/runShell',
      url: '/arthur/exec',
      method: 'post',
      data
  })
}

/*****************  监控回溯  *******************/

/**
 * 监控回溯数据
 */
export const getAllScript = data => {
  return Axios({
      url: '/monitor/getScriptsByDate',
      data
  })
}

/**
 * 编辑脚本信息
 */
export const updateScriptInfo = data => {
  return Axios({
      url: '/monitor/updateScriptInfo',
      method: 'post',
      data
  })
}

/**
 * 查看监控图
 */
export const getMonitorImg = data => {
  return Axios({
    url: '/monitor/getMonitorImg',
    data
  })
}