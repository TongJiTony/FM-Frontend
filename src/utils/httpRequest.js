//这个文件主要用于创建和配置 axios 实例，并添加请求和响应拦截器，方便全局使用。
import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import { clearLoginInfo } from '@/utils'

/*
Vue：引入 Vue 实例。
axios：用于发送 HTTP 请求的库。
router：用于处理路由的实例。
qs：用于序列化对象为查询字符串。
merge：用于深度合并对象的 lodash 函数。
clearLoginInfo：清除登录信息的函数。 
*/

//创建 axios 实例
const http = axios.create({
  timeout: 1000 * 30, //timeout：请求超时时间为30秒。
  withCredentials: true, //withCredentials：表示跨域请求时是否需要使用凭证。
  headers: { //headers：默认的请求头，设置内容类型为 JSON。
    "Content-Type": "application/json; charset=utf-8",
  },
});

// 请求拦截器
http.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
  return config
}, error => {
  return Promise.reject(error)
})


/**响应拦截器
 * 在请求发送之前，拦截器会给请求头添加 token。
 * 如果请求发送失败，会返回一个被拒绝的 Promise。
 * 如果响应中包含 code 为 401 的数据（表示 token 失效），会清除登录信息并重定向到登录页面。
 * 如果响应处理失败，会返回一个被拒绝的 Promise。 
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    clearLoginInfo()
    router.push({ name: 'login' })
  }
  return response
}, error => {
  return Promise.reject(error)
})


//辅助方法
/**
 * 请求地址处理
 
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  // 根据环境配置请求地址。如果是非生产环境且开启代理，则使用 /proxyApi/ 作为前缀。
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截
  return (
    (process.env.NODE_ENV !== "production" && process.env.OPEN_PROXY
      ? "/proxyApi/"
      : window.SITE_CONFIG.baseUrl) + actionName
  );
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    t: new Date().getTime(), //添加默认参数 t（当前时间戳），用于避免缓存。
  };
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 * 添加默认数据 t（当前时间戳）。
 * 根据 contentType 选择序列化方式：json 或 x-www-form-urlencoded。
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

export default http
