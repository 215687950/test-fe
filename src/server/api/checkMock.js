import Axios from '../axios'

/*****************  日志  *******************/
/**
 * 获取任务列表
 */
export const mockCompareGetLogTaskList = data => {
  return Axios({
      url: '/mockCompare/getLogTaskList',
      data
  })
}

/**
 * 获取检测模块
 */
export const mockCompareGetProjAndSubs = data => {
  return Axios({
      url: '/mockCompare/getProjAndSubs',
      data
  })
}

/**
 * 新增
 */
export const saveLogCompareTask = data => {
  return Axios({
      method: 'post',
      url: '/mockCompare/saveLogCompareTask',
      data
  })
}

/**
 * 获取报告列表
 */
export const mockCompareGetLogResultList = data => {
  return Axios({
      url: '/mockCompare/getLogResultList',
      data
  })
}

/*****************  路径  *******************/
/**
 * 获取任务列表
 */
export const mockCompareGetTaskList = data => {
  return Axios({
      url: '/mockCompare/getTaskList',
      data
  })
}

/**
 * 获取报告列表
 */
export const mockCompareGetResultList = data => {
  return Axios({
      url: '/mockCompare/getResultList',
      data
  })
}
