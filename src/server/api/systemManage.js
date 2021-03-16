import Axios from '../axios'
import qs from 'qs'

/*****************  用户管理  *******************/
/**
 * 获取用户列表
 */
export const getUserList = data => {
  return Axios({
      url: '/mgr/listUser',
      data
  })
}

/**
 * 获取角色
 */
export const getAllRoles = (data) => {
  return Axios({
      url: '/role/getAllRole',
      data
  })
}

/**
 * 新增用户
 */
export const addUser = data => {
  return Axios({
      url: '/mgr/addVueUser',
      method: 'post',
      data
  })
}


/**
 * 编辑用户
 */
export const editUser = data => {
  return Axios({
      url: '/mgr/editVueUser',
      method: 'post',
      data
  })
}

/**
 * 删除用户
 */
export const delUser = data => {
  return Axios({
      url: '/mgr/delete',
      data
  })
}

/**
 * 分配角色
 */
export const setRole = data => {
  return Axios({
      url: '/mgr/setRole',
      data
  })
}

/**
 * 模糊查询部门列表
 */
export const fuzzyDeptList = data => {
  return Axios({
      url: '/dept/fuzzyDeptList',
      data
  })
}

/**
 * id查询部门
 */
export const getDeptById = id => {
  return Axios({
      url: `/dept/detail/${id}`
  })
}

/*****************  角色管理  *******************/

/**
 * 获取角色列表
 */
export const getRoleList = data => {
  return Axios({
      url: '/role/getRoleList',
      data
  })
}

/**
 * 关键字搜索获取角色列表
 */
export const getFuzzyRoleList = data => {
  return Axios({
      url: '/role/getFuzzyRoleList',
      data
  })
}

/**
 * 新增角色
 */
export const addRole = data => {
  return Axios({
      url: '/role/add',
      data
  })
}

/**
 * 修改角色
 */
export const editRole = data => {
  return Axios({
      url: '/role/edit',
      data
  })
}

/**
 * 删除角色
 */
export const delRole = data => {
  return Axios({
      url: '/role/remove',
      data
  })
}

/**
 * 获取权限树
 */
export const getPermissionTree = data => {
  return Axios({
      url: '/menu/getAllMenuByRole',
      data
  })
}

/**
 * 查询角色下权限
 */
export const getRolePermission = data => {
  return Axios({
      url: '/role/selectMenuByRole',
      data
  })
}

/**
 * 分配角色权限
 */
export const setAuthority = data => {
  return Axios({
      url: '/role/setAuthority',
      data
  })
}

/*****************  部门管理  *******************/

/**
 * 部门列表分页
 */
export const listDept = data => {
  return Axios({
      url: '/dept/listDept',
      data
  })
}

/**
 * 新增部门
 */
export const addDept = data => {
  return Axios({
      url: '/dept/addVueDept',
      method: 'post',
      data
  })
}

/**
 * 更新部门
 */
export const updateDept = data => {
  return Axios({
      url: '/dept/updateVueDept',
      method: 'post',
      data
  })
}

/**
 * 删除部门
 */
export const deleteDept = data => {
  return Axios({
      url: '/dept/deleteVueDept',
      data
  })
}

/*****************  菜单管理  *******************/

/**
 * 新增菜单
 */
export const addMenu = data => {
  return Axios({
      url: '/menu/addVueMenu',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded'
      },
      method: 'post',
      data: qs.stringify(data)
  })
}

/**
 * 更新菜单
 */
export const editMenu = data => {
  return Axios({
      url: '/menu/vueEditMenu',
      method: 'post',
      data
  })
}

/**
 * 删除菜单
 */
export const delMenu = data => {
  return Axios({
      url: '/menu/removeVueMenu',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded'
      },
      method: 'post',
      data: qs.stringify(data)
  })
}

/**
 * 模糊查询menu列表
 */
export const fuzzyMenuList = data => {
  return Axios({
      url: '/menu/fuzzyMenuList',
      data
  })
}

/**
 * code查询Menu
 */
export const getMenuByCode = data => {
  return Axios({
      url: '/menu/selectMenuByCode',
      data
  })
}