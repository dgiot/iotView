import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import Cookies from 'js-cookie'
import { getNavigation } from '@/api/Navigation'
import { Roletree } from '@/api/User/index'
import { postCookie } from '@/api/Dashboard/index'
import VueRouter from 'vue-router'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // console.log('路由拦截',hasToken);
  console.error('to.query', to.query)
  if (to.query.username) {
    // http://192.168.2.132:3333/#/dashboard?username=ailiandata&password=fJYjEFg59H
    // https://work.dgiotcloud.com/#/dashboard?username=ailiandata&password=fJYjEFg59H
    // https://work.dgiotcloud.com/#/amis/View/f864c8f234?username=ailiandata&password=fJYjEFg59H
    await store.dispatch('user/login', {
      username: to.query.username || '',
      password: to.query.password || ''
    })
      .then(async() => {
        Vue.prototype.$FileServe = Cookies.get('fileServer') || ''
        const res = await getNavigation()
        console.log('路由', res)
        const list = []
        const item = {
          path: '/',
          url: '/',
          // component: Layout,
          redirect: '/dashboard',
          meta: {
            title: '首页',
            icon: 'dashboard',
            hidden: false
          },
          children: [
            {
              path: '/dashboard',
              url: '/dashboard',
              name: 'Dashboard',
              // component: () => import("@/views/dashboard/index"),
              meta: { title: '首页', icon: 'el-icon-s-home', hidden: false }
            }
          ]
        }
        list.push(item)
        res.results.forEach((item) => {
          if (item.url != '/' && item.url != '/roles') {
            list.push(item)
          }
        })
        store.dispatch('user/initRoutes', list).then(res => {
          const routelist = []
          // 过滤admin 中的路由
          res.forEach((element, index) => {
            if (element.children) {
              if (
                element.children[0].url.indexOf('amis') >= 0 ||
                        element.children[0].name.indexOf('Dashboard') >= 0
              ) {
                routelist.push(element)
              }
            } else {
              routelist.push(element)
            }
          })
          localStorage.setItem('routes', JSON.stringify(routelist)) // 路由列表
        })
        const roletree = await Roletree()
        localStorage.setItem(
          'dgiotroletree',
          JSON.stringify(roletree.results)
        )
        // 设置使用什么地图
        const data = {
          UserSession: getToken() || '',
          cookie: {
            mapType: 'baidu'
          }
        }
        await postCookie(data)
      })
  }
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        next()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/
    // next(`/login?redirect=${to.path}`)
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
