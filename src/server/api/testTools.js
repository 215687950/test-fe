import Axios from '../axios'

/*****************  机器人配置  *******************/
/**
* 获取列表分页数据
*/
export const listRobotProject = data => {
  return Axios({
    url: '/wechatRobot/listRobotProject',
    data
  })
}

/**
* 新增项目
*/
export const addRobotProject = data => {
  return Axios({
    url: '/wechatRobot/addProject',
    method: 'post',
    data
  })
}

/**
* 删除项目
*/
export const delRobotProject = data => {
  return Axios({
    url: 'robotSetting/delRobotProject',
    data
  })
}

/**
* 更新项目
*/
export const updateRobotProject = data => {
  return Axios({
    url: '/wechatRobot/updateProject',
    method: 'post',
    data
  })
}

/**
* 获取所有的机器人
*/
export const getAllRobot = data => {
  return Axios({
    url: '/wechatRobot/listRobot',
    data
  })
}

/**
* 新增机器人
*/
export const addRobot = data => {
  return Axios({
    url: '/wechatRobot/addRobot',
    method: 'post',
    data
  })
}

/**
* 更新机器人
*/
export const updateRobot = data => {
  return Axios({
    url: '/wechatRobot/updateRobot',
    method: 'post',
    data
  })
}

/**
* 获取项目下的机器人
*/
export const getRobotByProject = data => {
  return Axios({
    url: '/robotSetting/getRobotByProject',
    data
  })
}

/**
* 项目关联机器人
*/
export const relRobot = data => {
  return Axios({
    url: '/robotSetting/relRobot',
    method: 'post',
    data
  })
}

/*****************  部门任务  *******************/
export const testGroupTask = data => {
  return Axios({
    url: '/zt/testGroupTask',
    data
  })
}

/*****************  信息归档  *******************/

/**
* 获取列表分页数据
*/
export const listInfoArchive = data => {
  return Axios({
    url: '/infoArchiving/listInfoArchive',
    data
  })
};

/**
* 新增信息
*/
export const addInfoArchive = data => {
  return Axios({
    url: '/infoArchiving/addInfoArchive',
    method: 'post',
    data
  })
};

/**
 * 编辑信息
 */
export const editInfoArchive = data => {
  return Axios({
    url: '/infoArchiving/editInfoArchive',
    method: 'post',
    data
  })
};

/*****************  脚本自动化  *******************/

/** 获取执行记录列表 */
export const jenkinsTaksList = data => {
  return Axios({
    url: '/task/list',
    data
  })
};
/** Jenkins列表 */
export const getJenkinsData = data => {
  return Axios({
    // url: '/task/jenkins',
    url: '/task/addPage',
    data
  })
};

export const getJenkinsNotifer = data => {
  return Axios({
    url: '/task/notifier',
    data
  })
};

export const addJenkinsTask = data => {
  return Axios({
    url: '/task/add',
    method: 'post',
    data
  })
};


/*****************  脚本自动化配置  *******************/

/** 获取列表数据 */
export const testngConfigList = data => {
  return Axios({
    url: '/testngConfig/listConfig',
    data
  })
};

/**
 * 获取环境数据
 * @param {*} data 
 */
export const selectAllConfigEnv = data => {
  return Axios({
    url: "/syncEnvConfig/selectAllConfigEnv",
    data
  });
};

/** 查询testng配置 */
export const selectConfigInfoByConfig = data => {
  return Axios({
    url: '/testngConfig/selectInfoByConfig',
    data
  })
};
/** 新增testng配置 */
export const addTestngConfig = data => {
  return Axios({
    url: '/testngConfig/addConfigAndInfo',
    method: 'post',
    data
  })
};

/** 更新testng配置*/
export const updateTestngConfigInfo = data => {
  return Axios({
    url: '/testngConfig/updateConfigInfo',
    method: 'post',
    data
  })
};

/*****************  Json数据规则校验  *******************/

/**
 * 校验json
 * @param {} data
 */
export const checkJsonValidate = data => {
  return Axios({
    url: '/jsonSchema/validateBySchema',
    method: 'post',
    data
  });
}

/**
 * 获取schema列表
 * @param {} data
 */
export const selectSchemaByNameAndType = data => {
  return Axios({
    url: '/report/selectSchemaByNameAndType',
    data
  });
}


/*****************  远程脚本执行  *******************/

/**
 * 获取列表数据
 * @param {listExecRecord} data
 */
export const listExecRecord = data => {
  return Axios({
    url: '/consoleRecord/listExecRecord',
    data
  })
};

/**
 * 执行命令
 * @param {*} data 
 */
export const execCommand = data => {
  return Axios({
    url: '/consoleRecord/execCommand',
    method: 'post',
    data
  })
};



/*****************  优惠券  *******************/

/**
 * 获取优惠券列表
 * @param {*} data 
 */
export const getCouponList = data => {
  return Axios({
    url: '/coupon/getCouponList',
    data
  })
};
