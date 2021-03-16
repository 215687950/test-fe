import Axios from '../axios'

/*****************  报销申请  *******************/
/**
 * 获取列表
 */
export const getAllReimApply = data => {
  return Axios({
    url: '/reimapply/getAllReimApply',
    data
  })
}

/**
 * 批量更新报销信息
 */
export const batchUpdateRemark = data => {
  return Axios({
    url: '/reimcheck/batchUpdateRemark',
    method: 'post',
    data
  })
}

/**
 * 新增
 */
export const reimapplyAdd = data => {
  return Axios({
    url: '/reimapply/applyAdd',
    method: 'post',
    data
  })
}

/**
 * 修改
 */
export const reimapplyUpdate = data => {
  return Axios({
    url: '/reimapply/update',
    method: 'post',
    data
  })
}

/**
 * 删除
 */
export const reimapplyDel = data => {
  return Axios({
    url: '/reimapply/delete',
    data
  })
}

/**
 * 修改备注
 */
export const updateReimRemark = data => {
  return Axios({
    url: '/reimcheck/updateRemark',
    data
  })
}

/**
 * 保存图片
 */
export const reimUpdateImages = data => {
  return Axios({
    url: '/reimapply/newUpdateImages',
    method: 'post',
    data
  })
}

/*****************  报销审核 *******************/
/**
 * 报销审核列表
 */
export const reimCheckList = data => {
  return Axios({
    url: '/reimcheck/getAllReimCheck',
    data
  })
}

/**
 * 修改金额
 */
export const updateActAmount = data => {
  return Axios({
    url: '/reimcheck/updateActAmount',
    data
  })
}

/**
 * 是否通过
 */
export const checkpass = data => {
  return Axios({
    url: '/reimcheck/checkpass',
    data
  })
}

/**
 * 提交财务
 */
export const commitCw = data => {
  return Axios({
    url: '/reimcheck/commitCw',
    data
  })
}

/*****************  财务审核  *******************/
/**
 * 获取表格数据
 */
export const getAllReimCheckCw = data => {
  return Axios({
    url: '/cwcheck/getAllReimCheckCw',
    data
  })
}

/**
 * 获取财务excel数据
 */
export const getExcelDataByCW = data => {
  return Axios({
    url: '/cwcheck/getExcelDataCW',
    data
  })
}

/**
 * 设置阈值
 */
export const changeWarnValue = data => {
  return Axios({
    url: '/cwcheck/changeWarnValue',
    data
  })
}

/**
 * 驳回
 */
export const cwCheckUnpass = data => {
  return Axios({
    url: '/cwcheck/unpass',
    data
  })
}

/**
 * 核销
 */
export const updateVerification = data => {
  return Axios({
    url: '/cwcheck/updateVerification',
    data
  })
}

/*****************  核销列表  *******************/
/**
 * 获取表格数据
 */
export const getAllReimVeri = data => {
  return Axios({
    url: '/reimveri/getAllReimVeri',
    data
  })
}

/**
 * 全部完成
 */
export const reimveriAllComplete = data => {
  return Axios({
    url: '/reimveri/updateComplete',
    data
  })
}

/**
 * 获取核销列表excel数据
 */
export const getExcelDataVeri = data => {
  return Axios({
    url: '/reimveri/getExcelDataVeri',
    data
  })
}

/*****************  已报销列表  *******************/
/**
 * 已报销列表
 */
export const getAllReimComplete = data => {
  return Axios({
    url: '/reimcomplete/getAllReimComplete',
    data
  })
}

/**
 * 获取已完成excel数据
 */
export const getExcelDataComplete = data => {
  return Axios({
    url: '/reimcomplete/getExcelDataComplete',
    data
  })
}

/**
 * 打款
 */
export const completeRemit = data => {
  return Axios({
    url: '/reimcomplete/remit',
    data
  })
}