import Vue from 'vue'
import Cookies from 'js-cookie'
import { Base64 } from "js-base64";
import md5 from "js-md5";
import 'normalize.css/normalize.css' // A modern alternative to CSS resets



import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import VCharts from 'v-charts'

import '@/icons' // icon
import '@/permission' // permission control

import '@dgiot/dgiot-component'

// import 'amis/lib/themes/cxd.css'
// import 'amis/lib/themes/ang.css'
// import 'amis/lib/themes/default.css'
// import 'amis/lib/helper.css'
// import 'amis/sdk/sdk.css'
// import "amis/lib/themes/antd.css";

// import 'amis-editor/dist/style.css'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}
Vue.prototype.$md5 = md5
Vue.prototype.$_ = require("lodash")
Vue.prototype.$Cookies = Cookies
Vue.prototype.$Base64 = Base64
window.Base64 = Vue.prototype.$Base64
Vue.prototype.$dgiotBus = new Vue();
window.dgiotBus = Vue.prototype.$dgiotBus
Vue.prototype.$FileServe = ''
window.Vue = Vue

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)
Vue.use(VCharts)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
