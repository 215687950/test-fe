import Axios from '../axios'

/*****************  测试报告  *******************/

/**
 * 获取测试报告列表
 */
export const getReportList = data => {
  return Axios({
      url: 'testcase/report/getReportList',
      method: 'post',
      data
  })
}

/**
 * 删除测试报告
 */
export const delReport = data => {
  return Axios({
      url: 'testcase/report/deleteById',
      data
  })
}

/**
 * 测试报告详情
 */
export const getReportDetail = data => {
  return Axios({
      url: 'testcase/report/getDetailById',
      data
  })
}

/**
 * 更新测试报告
 */
export const updateReport = data => {
  return Axios({
      url: 'testcase/report/updateReport',
      method: 'post',
      data
  })
}

/*****************  测试用例  *******************/
/**
 * 获取用例库列表
 * @param {获取用例库列表} data
 */
export const getCaseLibraryList = data => {
  return Axios({
      url: '/testcase/product/getProductList',
      data
  })
}

/**
 * 新增/修改用例库
 * @param {新增用例库} data
 */
export const addOrUpdateCaseLibrary = (type, data) => {
  let url = ''
  if (type === 'add') {
    url = '/testcase/product/addProduct'
  } else {
    url = '/testcase/product/updateProduct'
  }
  return Axios({
      url,
      method: 'post',
      data
  })
}

/**
 * 删除用例库
 * @param {删除用例库} data
 */
export const delCaseLibraryList = data => {
  return Axios({
      url: '/testcase/product/deleteById',
      data
  })
}

/**
 * 获取用例库下所有分组和用例
 * @param {获取用例库下所有分组和用例} data
 */
export const getCaseTree = data => {
  return Axios({
      url: '/testcase/sections/getSectionAndCaseByProductId',
      data
  })
}

/**
 * 获取用例库下所有分组
 * @param {获取用例库下所有分组} data
 */
export const getTreeByProductId = data => {
  return Axios({
      url: '/testcase/sections/getTreeByProductId',
      data
  })
}


/**
 * 拖动排序
 */
export const sortSection = data => {
  return Axios({
      url: '/testcase/sections/sortSection',
      method: 'post',
      data
  })
}

/**
 * 新增用例集
 * @param {新增用例集} data
 */
export const addGroup = data => {
  return Axios({
      url: '/testcase/sections/addSection',
      method: 'post',
      data
  })
}

/**
 * 修改用例集
 * @param {修改用例集} data
 */
export const updateGroup = data => {
  return Axios({
      url: '/testcase/sections/updateSection',
      method: 'post',
      data
  })
}

/**
* 删除用例集
* @param {删除用例集} data
*/
export const deleteGroup = data => {
 return Axios({
     url: '/testcase/sections/deleteById',
     data
 })
}

/**
 * 复制用例集
 * @param { id, parentId }
 */
export const copyGroup = data => {
  return Axios({
      url: '/testcase/sections/copySection',
      data
  })
}

/**
 * 搜索用例
 * @param {  }
 */
export const filtrationCase = data => {
  return Axios({
      url: '/testcase/sections/filtrationCase',
      method: 'post',
      data
  })
}
/**
 * 获取用例详情
 * @param {  }
 */
export const getCaseDetail = data => {
  return Axios({
      url: '/testcase/case/getDetailById',
      data
  })
}

/**
 * 新增用例
 * @param {  }
 */
export const addCase = data => {
  return Axios({
      url: '/testcase/case/addCase',
      method: 'post',
      data
  })
}

/**
 * 修改用例
 * @param {  }
 */
export const updateCase = data => {
  return Axios({
      url: '/testcase/case/updateCase',
      method: 'post',
      data
  })
}

/**
 * 批量修改用例
 * @param {
 *   operatorType: 操作类型 1 维护人, 2 用例等级 3 移动 4 复制
 * }
 */
export const bathOperatorCase = data => {
  return Axios({
      url: '/testcase/case/bathOperatorCase',
      method: 'post',
      data
  })
}

/**
 * 批量删除用例
 * @param {}
 */
export const bathDeleteCase = data => {
  return Axios({
      url: '/testcase/case/bathDeleteCase',
      method: 'post',
      data
  })
}

/**
 * 检查csv文件
 * @param {}
*/
export const checkCsv = data => {
  return Axios({
      url: '/testcase/transport/checkCsv',
      method: 'post',
      data
  })
}

/**
 * csv文件导入测试用例
 * @param {}
*/
export const csvToCase = data => {
  return Axios({
      url: '/testcase/transport/csvToCase',
      method: 'post',
      data
  })
}

/**
 * 检查xmind文件
 * @param {}
*/
export const checkXmind = data => {
  return Axios({
      url: '/testcase/transport/checkXmind',
      method: 'post',
      data
  })
}

/**
 * xmind文件导入测试用例
 * @param {}
*/
export const xmindToCase = data => {
  return Axios({
      url: '/testcase/transport/xmindToCase',
      method: 'post',
      data
  })
}

/**
 * 导出csv文件
 * @param {}
*/
export const exportCsv = data => {
  return Axios({
      url: '/testcase/transport/exportCsv',
      data
  })
}

/**
 * 导出xmind文件
 * @param {}
*/
export const exportXmind = data => {
  return Axios({
      url: '/testcase/transport/exportXmind',
      data
  })
}

/*****************  测试计划  *******************/

/**
 * 获取测试计划列表
 * @param {}
 */
export const getPlanList = data => {
  return Axios({
      url: '/testcase/execution/getPlanList',
      method: 'post',
      data
  })
}

/**
 * 获取迭代
 * @param {}
 */
export const getIterationByKeyword = data => {
  return Axios({
      url: '/testcase/iteration/getIterationByKeyword',
      data
  })
}

/**
 * 获取禅道产品id
 * @param {}
 */
export const getProductList = data => {
  return Axios({
      url: '/testcase/zt/getProductList',
      data
  })
}

/**
 * 新增测试计划
 * @param {}
 */
export const addPlan = data => {
  return Axios({
      url: '/testcase/execution/addPlan',
      method: 'post',
      data
  })
}


/**
 * 更新测试计划
 * @param {}
 */
export const updatePlan = data => {
  return Axios({
      url: '/testcase/execution/updatePlan',
      method: 'post',
      data
  })
}

/**
 * 同步至用例库
 * @param {}
 */
export const syncToProduct = data => {
  return Axios({
      url: '/testcase/execution/syncToProduct',
      data
  })
}

/**
 * 复制计划
 * @param {}
 */
export const copyPlan = data => {
  return Axios({
      url: '/testcase/execution/copyPlan',
      data
  })
}

/**
 * 删除计划
 * @param {}
 */
export const deleteById = data => {
  return Axios({
      url: '/testcase/execution/deleteById',
      data
  })
}

/**
 * 获取测试计划数据
 * @param {}
 */
export const getPlanInfo = data => {
  return Axios({
      url: '/testcase/execution/getInfoBeforeEdit',
      data
  })
}

/**
 * 获取测试计划数据
 * @param {}
 */
export const getInfoById = data => {
  return Axios({
      url: '/testcase/execution/getInfoById',
      data
  })
}

/**
 * 获取测试计划用例列表
 * @param {}
 */
export const getCaseListByPlanId = data => {
  return Axios({
      url: '/testcase/execution/getCaseListByPlanId',
      method: 'post',
      data
  })
}

/**
 * 获取测试计划用例列表
 * @param {}
 */
export const getExecutionCaseDetail = data => {
  return Axios({
      url: '/testcase/executionCase/getDetailById',
      data
  })
}

/**
 * 更新执行用例
 * @param {}
 */
export const updateExecutionCase = data => {
  return Axios({
      url: '/testcase/executionCase/updateCase',
      method: 'post',
      data
  })
}

/**
 * 更新执行用例步骤
 * @param {}
 */
export const updateStep = data => {
  return Axios({
      url: '/testcase/executionCase/updateStep',
      method: 'post',
      data
  })
}

/**
 * 获取执行用例的结果记录
 * @param {}
 */
export const getExecutionRecord = data => {
  return Axios({
      url: '/testcase/executionCase/getExecutionRecord',
      data
  })
}

/**
 * 记录结果
 * @param {}
 */
export const recordExecutionCase = data => {
  return Axios({
      url: '/testcase/executionCase/recordExecutionCase',
      method: 'post',
      data
  })
}

/**
 * 批量修改执行用例的执行人
 * @param {}
 */
export const bathUpdateCaseComply = data => {
  return Axios({
      url: '/testcase/executionCase/bathOperatorCase',
      method: 'post',
      data
  })
}

/**
 * 测试进度
 * @param {}
 */
export const getPlanTestProgress = data => {
  return Axios({
      url: '/testcase/report/getPlanTestProgress',
      data
  })
}