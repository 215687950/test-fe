import Axios from '../axios'

/**
 * 验证token
 */
export const veriToken = data => {
  return Axios({
      url: '/login/veriToken',
      data
  })
}

/**
 * 登出请求
 */
export const logout = () => {
  return Axios({
      url: '/vueLogout'
  })
}

/**
 * 获取菜单树
 */
export const getMenuTree = data => {
  return Axios({
      // url: '/menu/getAllMenuByRole',
      url: '/auth/mypower',
      data
  })
}


/**
 * 查询是否拥有某种权限
 */
// export const checkMenuPermission = data => {
//   return Axios({
//       url: '/menu/checkMenuPermission',
//        data
//   })
// }

/**
 * 获取字典
 */
export const getAllEnum = () => {
  return Axios({
      url: '/enum/getAllEnum'
  })
}

/**
 * 获取维护人
 */
export const getUserByName = (data) => {
  return Axios({
      url: '/testcase/staff/getUserByName',
      data
  })
}

/**
 * git
 */
export const gitTest = (data) => {
  return Axios({
      url: '/git/test',
      data
  })
}
