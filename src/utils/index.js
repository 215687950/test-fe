/**
 * 获取url中的参数
 */
export const getQueryVariable = variable => {
  var query = window.location.search.substring(1)
  var vars = query.split("&")
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=")
    if (pair[0] == variable) {
      return pair[1]
    }
  }
  return false
}

/**
 * 格式化时间
 */
export const formatTime = function (date) {
  var myyear = date.getFullYear()
  var mymonth = date.getMonth() + 1
  var myweekday = date.getDate()
  if (mymonth < 10) {
      mymonth = "0" + mymonth
  }
  if (myweekday < 10) {
      myweekday = "0" + myweekday
  }
  return (myyear + "-" + mymonth + "-" + myweekday)
}

/**
 * 格式化日期
 */
export const formatDate = (value, fmt = 'yyyy-MM-dd') => {
  if (!value) {
    return
  }
  value = Number(value)
  let date = new Date(value)
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'ms+': date.getMilliseconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      if (k === 'ms+') {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 2 ? str : padLeftZero(str))
      } else {
        fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str))
      }
    }
  }
  return fmt
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length)
}