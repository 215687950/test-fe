import Axios from '../axios'

/*****************  定时任务  *******************/

/**
 * 获取列表
 */
export const getScheduleList = data => {
  return Axios({
      url: '/schedule/listSchedule',
      data
  })
}

export const getTaskList = data => {
  return Axios({
      url: '/testngConfig/fuzzyTestngInfo',
      data
  })
}

/**
 * 新增
 */
export const addSchedule = data => {
  return Axios({
      url: '/schedule/addSchedule',
      method: 'post',
      data
  })
}

/**
 * 编辑
 */
export const editSchedule = data => {
  return Axios({
      url: '/schedule/editSchedule',
      method: 'post',
      data
  })
}

/**
 * 删除
 */
export const delSchedule = data => {
  return Axios({
      url: '/schedule/delSchedule',
      data
  })
}

/**
 * 获取xxx
 */
export const getScheduleInfo = data => {
  return Axios({
      url: '/testngConfig/selectInfoById',
      data
  })
}

/**
 * 启用禁用
 */
export const scheduleChangeStatus = data => {
  return Axios({
      url: '/schedule/changeStatus',
      data
  })
}


/**
 * 执行一次
 */
export const scheduleTrigger = data => {
  return Axios({
      url: '/schedule/trigger',
      data
  })
}