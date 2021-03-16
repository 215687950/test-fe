import axios from 'axios'
import { Message } from 'element-ui'

let instance = axios.create()
instance.defaults.headers.post['Content-Type'] = 'application/json'

/****** request拦截器==>对请求参数做处理 ******/
instance.interceptors.request.use(
  config => {
    // config.headers['wechatToken'] = localStorage.getItem('wechatToken')
    config.headers['domain'] = document.domain
    return config
  },
  error => {
    return Promise.reject(error)
})

/****** respone拦截器==>对响应做处理 ******/
instance.interceptors.response.use(
  res => {
    // 部分接口没有code
    if (res.config.url.includes('/vueApi/dept/detail')) {
      return res
    }
    if (res.data.code === 200) {
      return res
    } else {
      Message.error(res.data.message)
      return Promise.reject()
    }
  },
  error => {
    if (error.response.status === 401) {
      Message.error("未授权,请重新登录")
      window.location.href = 'https://login.weipaitang.com/wechatLogin?loginUrl=http://' + window.location.host
    } else {
      Message.error('服务器错误')
    }
    return Promise.reject(error)
  }
)

const Axios = (opts) => {
  let defaultOpts = {
    method: opts.method || 'get',
    baseURL: process.env.VUE_APP_BASE_LOC + process.env.VUE_APP_BASE_API,
    url: opts.url,
    params: opts.data || {},
    data: opts.data || {},
    headers: opts.headers || {},
    timeout: 20000,
    maxContentLength: Infinity
  }
  if (defaultOpts.method === 'get' || defaultOpts.method === 'delete') {
    delete defaultOpts.data
  } else {
    delete defaultOpts.params
  }
  let promise = new Promise((resolve, reject) => {
    instance(defaultOpts)
      .then(res => {
        resolve(res.data)
      })
      .catch(res => {
        reject(res)
      })
  })
  return promise
}

export default Axios
