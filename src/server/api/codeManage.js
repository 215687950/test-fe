import Axios from '../axios'
/*****************  PHP扫描配置  *******************/
/**
 * 获取配置列表
 */
export const listPhpScanConfList = data => {
  return Axios({
    url: '/phpObject/listPhpObject',
    data
  })
};

/**
 * 新增扫描配置
  */
export const insertPhpConf = data => {
  return Axios({
    url: '/phpObject/insertPhpObjConf',
    method: 'post',
    data
  })
};

/**
 * 更新扫描配置
  */
export const updatePhpConf = data => {
  return Axios({
    url: '/phpObject/updatePhpObjConf',
    method: 'post',
    data
  })
};

/*****************  PHP任务列表  *******************/

/**
 * listPhpTask
 * @param {listPhpTask} data
 */
export const listPhpTask = data => {
  return Axios({
    url: '/phpTask/listTask',
    data
  })
};

/*****************  PHP扫描结果  *******************/
export const phpMergeReqList = data => {
  return Axios({
    url: '/gitlabManage/phpMergeReqList',
    data
  })
};

/**
 * php merge request detail list
 * @param {php merge request detail list} data
 */
export const phpMergeReqDetailList = data => {
  return Axios({
    url: '/gitlabManage/phpMergeReqDetailList',
    data
  })
};

/**
 * 文件详情list
 * @param {data} data
 */
export const fileInfoList = data => {
  return Axios({
    url: '/gitlabManage/fileInfoList',
    data
  })
};
