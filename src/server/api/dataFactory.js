import Axios from '../axios'

/*****************  用户  *******************/
/**
 * 获取用户模块页信息
 */
export const factoryGetInfo = data => {
  return Axios({
    url: '/factory/user/getInfo',
    data
  })
}

/**
 * 获取用户信息
 */
export const factoryGetUserInfo = data => {
  return Axios({
    url: '/factory/user/getUserInfo',
    method: 'post',
    data
  })
}

/**
 * 更新用户信息
 */
export const factorySetUserValue = data => {
  return Axios({
    url: '/factory/user/setUserValue',
    method: 'post',
    data
  })
}

/**
 * 清用户为新用户
 */
export const factoryClearUserNew = data => {
  return Axios({
    url: '/factory/user/clearUserNew',
    method: 'post',
    data
  })
}

/**
 * 清用户缓存
 */
export const factoryClearCache = data => {
  return Axios({
    url: '/factory/user/clearCache',
    method: 'post',
    data
  })
}

/*****************  商家  *******************
/**
 * 获取商家模块页信息
 */
export const shopGetInfo = data => {
  return Axios({
    url: '/factory/shop/getInfo',
    data
  })
}

/**
 * 修改商家信息
 */
export const setShop = data => {
  return Axios({
    url: '/factory/shop/setShop',
    method: 'post',
    data
  })
}

/**
 * 查询商家信息
 */
export const getShopInfo = data => {
  return Axios({
    url: '/factory/shop/getShopInfo',
    method: 'post',
    data
  })
}
/*****************  拍品  *******************
/**
 * 获取拍品模块页信息
 */
export const saleGetInfo = data => {
  return Axios({
    url: '/factory/sale/getInfo',
    data
  })
}

/**
 * 提交
 */
export const salePublish = data => {
  return Axios({
    url: '/factory/sale/publish',
    method: 'post',
    data
  })
}

/**
 * 获取拍品记录
 */
export const getSaleRecords = data => {
  return Axios({
    url: '/factory/sale/getRecords',
    data
  })
}

/*****************  订单  *******************
/**
 * 获取订单模块页信息
 */
export const orderGetInfo = data => {
  return Axios({
    url: '/factory/order/getInfo',
    data
  })
}

/**
 * 提交
 */
export const orderCreate = data => {
  return Axios({
    url: '/factory/order/create',
    method: 'post',
    data
  })
}

/**
 * 获取订单记录
 */
export const getOrderRecords = data => {
  return Axios({
    url: '/factory/order/getRecords',
    data
  })
}