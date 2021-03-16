import Axios from '../axios'

/*****************  迭代关联埋点  *******************/
/**
 * 新增
 */
export const addIterationPointConf = data => {
  return Axios({
    url: '/report/addConf',
    method: 'post',
    data
  })
}

/**
 * 获取详情
 */
export const selectInfoById = data => {
  return Axios({
    url: '/report/selectInfoById',
    data
  })
}

/**
 * 修改
 */
export const editIterationPointConf = data => {
  return Axios({
    url: '/report/editConf',
    method: 'post',
    data
  })
};

/**
 * 删除prd
 */
export const delPrdById = data => {
  return Axios({
    url: '/report/delPrdById',
    data
  })
}

/**
 * selectPrdByDpId
 */
export const selectPrdByDpId = data => {
  return Axios({
    url: '/report/selectPrdByDpId',
    data
  })
}

/**
 * selectDataTypeByDpId
 */
export const selectDataTypeByDpId = data => {
  return Axios({
    url: '/report/selectDataTypeByDpId',
    data
  })
}

/**
 * selectRecordByDpId
 */
export const selectRecordByDpId = data => {
  return Axios({
    url: '/report/selectRecordByDpId',
    data
  })
}

/**
 * 删除埋点配置
 */
export const delDataTypeById = data => {
  return Axios({
    url: '/report/delDataTypeById',
    data
  })
}

/**
 * 删除埋点记录
 */
export const delRecordById = data => {
  return Axios({
    url: '/report/delRecordById',
    data
  })
}

/**
 * 获取迭代列表
 */
export const getConfIterationList = data => {
  return Axios({
    url: '/report/fuzzyProject',
    data
  })
}

/**
 * 获取埋点列表
 */
export const selectDataPoint = data => {
  return Axios({
    url: '/report/selectDataPoint',
    data
  })
}

/*****************  迭代埋点列表  *******************/
/**
 * 获取项目迭代列表
 */
export const getIterationPoint = data => {
  return Axios({
    url: '/report/listProject',
    data
  })
}

/**
 * 根据id删除迭代
 */
export const delIterationPoint = data => {
  return Axios({
    url: '/report/deleteById',
    data
  })
}

/**
 * 根据id获取迭代详情
 */
export const getIterationDetail = data => {
  return Axios({
    url: '/report/getProjectById',
    data
  })
}

/*****************  埋点上报列表  *******************/

/**
 * 获取迭代列表
 */
export const getIterationList = data => {
  return Axios({
    url: '/report/fuzzyDataPoint',
    data
  })
}

/**
 * 获取表格数据
 */
export const listReportData = data => {
  return Axios({
    url: '/reportData/listReportData',
    data
  })
}

/**
 * 报告数据
 */
export const selectReportInfo = data => {
  return Axios({
    url: '/reportData/selectReportInfo',
    data
  })
}


/**
 * 获取表格数据
 */
export const listReportData2 = data => {
  return Axios({
    url: '/reportData/listReportData2',
    data
  })
}
/**
 * 新的上报数据
 */
export const selectRecordInfo = data => {
  return Axios({
    url: '/reportData/selectRecordInfo',
    data
  })
}

/**
 * 重复上报数据
 */
export const listRepeatData = data => {
  return Axios({
    url: '/reportData/listRepeatData',
    method: 'post',
    data
  })
}
