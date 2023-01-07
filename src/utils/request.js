import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken, setToken } from '@/utils/auth'
import route from '../router/index'
// import router from '../router/index'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 1000 * 60 * 3 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['sessionToken'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log('错误', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response
    // route.replace({path:'/login'})
    //  route.push({ path: "/login" });
    // console.log('response', res);
    // if the custom code is not 20000, it is judged as an error.
    if (res.status != 200) {
      // Message({
      //   message: res.statusText || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.status === 403) {
        // to re-login
        Message({
          message: '暂无权限',
          type: 'error',
          duration: 5 * 1000
        })

      } else if (res.status === 401) {
        Message({
          message: '登录失效',
          type: 'error',
          duration: 5 * 1000
        })

        // MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        //   confirmButtonText: 'Re-Login',
        //   cancelButtonText: 'Cancel',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   })
        // })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res.data
    }
  },
  error => {

    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    if (error.message.indexOf('401') >= 0) {
      // console.log('异常错误', error.message) // for debug
      setToken()
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
      // router.push({
      //   path: '/login',
      //   replace: true,
      // })
      // window.location.href = 'login'
      // history.push("/login");
      // router.push({ path: '/login' })
      // route.replace({ path: "/login" });
      // router.push({ path: "/login" });
    }
    return Promise.reject(error)
  }
)

export default service
