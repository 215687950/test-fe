import Axios from '../axios'

/*****************  Mock配置  *******************/
/**
 * 获取表格数据
 */
export const listMockConf = data => {
  return Axios({
    url: '/mockConf/listMockConf',
    data
  })
}

/**
 * 新增
 */
export const addMockConf = data => {
  return Axios({
    url: '/mockConf/addMockConf',
    method: 'post',
    data
  })
}

/**
 * 修改
 */
export const editMockConf = data => {
  return Axios({
    url: '/mockConf/editMockConf',
    method: 'post',
    data
  })
}

/*****************  物流信息  *******************/
/**
 * 物流列表
 */
export const listExpressOrder = data => {
  return Axios({
    url: '/expressOrder/listExpressOrder',
    data
  })
}

/**
 * 开关mock
 */
export const changedMockStatus = data => {
  return Axios({
    url: '/expressOrder/changedMockStatus',
    data
  })
}

/**
 * 业务单号
 */
export const getShowApiOrderList = data => {
  return Axios({
    url: '/expressOrder/getShowApiCreateList',
    data
  })
}

/**
 * 下单提交
 */
export const mockExpress = data => {
  return Axios({
    url: '/expressOrder/mockExpress',
    method: 'post',
    data
  })
}

/**
 * 查看物流详情
 */
export const selectExpressDetail = data => {
  return Axios({
    url: '/expressOrder/selectExpressDetail',
    data
  })
}

/*****************  微信物流助手  *******************/
/**
 * 微信物流助手
 */
export const selectExpressInfoList = data => {
  return Axios({
    url: '/expressOrder/listExpressOrder',
    data
  })
}

/**
 * 微信平台创建订单mock开/关
 */
export const changedWechatMock = data => {
  return Axios({
    url: '/expressOrder/changedWechatMock',
    method: 'post',
    data
  })
}

/**
 * 触发
 */
export const mockUpdatePathStart = data => {
  return Axios({
    url: '/expressOrder/mockUpdatePathStart',
    data
  })
}

/**
 * 物流轨迹回调
 */
export const mockWechatUpdatePath = data => {
  return Axios({
    url: '/expressOrder/mockWechatUpdatePath',
    method: 'post',
    data
  })
}

/*****************  微信物流账号  *******************/
/**
 * 微信物流账号
 */
export const listWechatBind = data => {
  return Axios({
    url: '/wechatBindAccount/listWechatBind',
    data
  })
}

/**
 * changeMockStatus
 */
export const changeBindMockStatus = data => {
  return Axios({
    url: '/wechatBindAccount/changeMockStatus',
    data
  })
}

/**
 * mockResult
 */
export const mockResult = data => {
  return Axios({
    url: '/wechatBindAccount/mockResult',
    method: 'post',
    data
  })
}

/**
 * mockBindCallBack
 */
export const mockBindCallBack = data => {
  return Axios({
    url: '/wechatBindAccount/mockCallBack',
    data
  })
}

/**
 * getBindMockData
 */
export const getBindMockData = data => {
  return Axios({
    url: '/wechatBindAccount/getMockData',
    data
  })
}

/**
 * saveMockData
 */
export const saveBindMockData = data => {
  return Axios({
    url: '/wechatBindAccount/saveMockData',
    method: 'post',
    data
  })
}

/*****************  虚拟账号管理[START]  *******************/

/**
 * 虚拟账号list
 */
export const listVriAccount = data => {
  return Axios({
    url: '/testAccount/listVriAccount',
    data
  })
}

/**
 * 新增账号
 */
export const addVriAccount = data => {
  return Axios({
    url: '/testAccount/addVriAccount',
    method: 'post',
    data
  })
}

/**
 * 查询所属人
 */
export const quertOwner = data => {
  return Axios({
    url: '/testAccount/getOwnerInfo',
    data
  })
}

/**
 * 绑定真实号
 */
export const bindAccount = data => {
  return Axios({
    url: '/testAccount/bindMobile',
    method: 'post',
    data
  })
}

/**
 * 解绑真实号
 */
export const unbindMobile = data => {
  return Axios({
    url: '/testAccount/unbindMobile',
    data
  })
}

/**
 * 修改虚拟号状态
 */
export const editAccountStatus = data => {
  return Axios({
    url: '/testAccount/editAccountStatus',
    data
  })
}

/**
 * 修改虚拟号状态
 */
export const updateAccount = data => {
  return Axios({
    url: '/testAccount/updateVriAccount',
    method: 'post',
    data
  })
}

/**
 * 同步账号
 */
export const syncAccount = data => {
  return Axios({
    url: '/testAccount/syncAccount',
    data
  })
}

/**
 * 查询绑定账号列表
 */
export const getBindList = data => {
  return Axios({
    url: '/testAccount/getBindList',
    data
  })
}

/**
 * 查询验证码
 */
export const getVcode = data => {
  return Axios({
    url: '/testAccount/selectVCode',
    data
  })
}

/**
 * 修改绑定信息
 */
export const editBindInfo = data => {
  return Axios({
    url: '/testAccount/editBindInfo',
    method: 'post',
    data
  })
}

/**
 * 删除绑定信息
 */
export const delBindInfo = data => {
  return Axios({
    url: '/testAccount/delBindInfo',
    data
  })
}



/*****************  虚拟账号管理[END]  *******************/
