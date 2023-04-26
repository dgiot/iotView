import axios from "axios";
import { getToken } from '@/utils/auth'
// import { MessageBox, Message } from "element-ui";
// import store from "@/store";
// import router from '@/router'
// import { getToken,removeToken } from "@/utils/auth";
// import { Toast } from "vant";
// axios.post
// create an axios instance
const service = axios.create({
  // baseURL: "https://test.hgjzt.com",   //https://test.hgjzt.com //"https://prod.dgiotcloud.com",  //https://shuukgold.ga  //http://45.40.194.29:28019 //process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 360000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // console.log("222",config.headers['Content-Type']);
    if(!config.headers['Content-Type']){
      // console.log("111");
      config.headers['Content-Type'] = 'application/json';
    }
      
      config.headers["sessionToken"] = getToken() || ''
    // }
    return config;
  },
  error => {
    console.log("111");
    // do something with request error
    // console.log("Hi, this is the ERROR in Request!!", error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    // console.log("response",response);
    const code = response.status
    if (code < 200 || (code > 300&&code<400)) {
      // Notification.error({
      //   title: response.message
      // })
      return Promise.reject('error')
    } else {
      return response.data
    }
  },
  error => {
    // console.log("error",error.response);
    let code = 0
    try {
      code = error.response.status
      console.log("code",code);
      if(code==401){
        // console.log("111");
        // Toast.fail("登录已失效");
        //  setTimeout(()=>{
        //   router.push({ path: '/login' })
        //   removeToken();
        //  },2000)
         
        // store.dispatch('/manage/login').then(() => {
        //   location.reload(true)
        // })
      }
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        // Notification.error({
        //   title: '网络请求超时',
        //   duration: 360000
        // })
        return Promise.reject(error)
      }
    }
    if (code) {
      // if(code==401 &&res.data.code==209)
      if (code === 401) {
        // removeToken();
        // router.push(`/login?redirect=${this.$route.fullPath}`);
        // removeToken()
        // store.dispatch('/login').then(() => {
        //   // 用户登录界面提示
        //   // Cookies.set('point', 401)
        //   location.reload()
        // })
      } else if (code === 403) {
        // router.push({ path: '/401' })
      } else {
        const errorMsg = error.response.data.message
        if (errorMsg !== undefined) {
          // Notification.error({
          //   title: errorMsg,
          //   duration: 360000
          // })
        }
      }
    } else {
      // Notification.error({
      //   title: '接口请求失败',
      //   duration: 360000
      // })
    }
    // console.log("测试",error);
    return Promise.reject(error)
  }
)

export default service;
