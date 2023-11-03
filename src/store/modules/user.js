import { login, logout, getInfo, verifyCode } from '@/api/User/index'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'
import store from '@/store'

const getDefaultState = () => {
  return {
    token: getToken(),
    departmentToken: Cookies.get('departmentToken') || '',
    name: localStorage.getItem('name') || '',
    avatar: '',
    objectId: localStorage.getItem('objectId') || '',
    routes: []
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_OBJECTID: (state, objectId) => {
    console.log('objectId', objectId)
    state.objectId = objectId
  },
  setRoutes: (state, routes) => {
    console.log('routes', routes)
    state.routes = routes
  }
}

const actions = {
  // user login
  codelogin({ commit }, userInfo) {
    const { username, password, phone, code } = userInfo
    return new Promise((resolve, reject) => {
      verifyCode(phone, code, username, password).then(res => {
        console.log('response', res)
        const { sessionToken, name, tag, objectId, roles, nick } = res
        if (tag.userinfo && tag.userinfo.parse_deviceid) {
          localStorage.setItem('parse_deviceid', tag.userinfo.parse_deviceid)
        } else {
          localStorage.removeItem('parse_deviceid')
        }
        localStorage.setItem('avatar', tag.userinfo.avatar)
        commit('SET_NAME', name)
        localStorage.setItem('name', name)
        localStorage.setItem('nick', nick)
        commit('SET_OBJECTID', objectId) // 用户唯一标识
        localStorage.setItem('objectId', objectId)
        localStorage.setItem('deptId', roles[0].objectId)
        localStorage.setItem('rolename', roles[0].name)
        commit('SET_AVATAR', tag.userinfo.avatar)
        commit('SET_TOKEN', sessionToken)
        setToken(sessionToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(res => {
        console.log('response', res)
        const { sessionToken, name, tag, objectId, roles, nick } = res
        if (tag.userinfo && tag.userinfo.parse_deviceid) {
          localStorage.setItem('parse_deviceid', tag.userinfo.parse_deviceid)
        } else {
          localStorage.removeItem('parse_deviceid')
        }
        localStorage.setItem('avatar', tag.userinfo.avatar)
        commit('SET_NAME', name)
        localStorage.setItem('name', name)
        localStorage.setItem('nick', nick)
        commit('SET_OBJECTID', objectId) // 用户唯一标识
        localStorage.setItem('objectId', objectId)
        localStorage.setItem('deptId', roles[0].objectId)
        localStorage.setItem('rolename', roles[0].name)
        commit('SET_AVATAR', tag.userinfo.avatar)
        commit('SET_TOKEN', sessionToken)
        setToken(sessionToken)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  initRoutes({ commit }, routes) {
    // console.error('routes', routes)
    return new Promise((resolve, reject) => {
      routes.forEach((item, i) => {
        item.path = item.url
        if (item.children) {
          store.dispatch('user/initRoutes', item.children)
        }
        if (item.meta && item.meta.icon.indexOf('dgiot_file') < 0) {
          if (item.meta.title.indexOf('云') >= 0) {
            item.meta.icon = 'el-icon-cloudy'
          }
          if (item.meta.title.indexOf('管理') >= 0) {
            item.meta.icon = 'el-icon-s-management'
          }

          if (item.meta.title.indexOf('设备管理') >= 0) {
            item.meta.icon = 'el-icon-monitor'
          }
          if (
            item.meta.title.indexOf('运维') >= 0 ||
              item.meta.title.indexOf('设置') >= 0
          ) {
            item.meta.icon = 'el-icon-setting'
          }
          if (item.meta.title.indexOf('工单') >= 0) {
            item.meta.icon = 'el-icon-s-order'
          }
          if (item.meta.title.indexOf('系统') >= 0) {
            item.meta.icon = 'el-icon-s-help'
          }
          if (item.meta.title.indexOf('告警') >= 0) {
            item.meta.icon = 'el-icon-bell'
          }
          // if (item.meta.title.indexOf("数据") >= 0) {
          //   item.meta.icon = "el-icon-s-data";
          // }
          if (item.meta.title.indexOf('日志') >= 0) {
            item.meta.icon = 'el-icon-notebook-1'
          }
          if (
            item.meta.title.indexOf('园区') >= 0 ||
              item.meta.title.indexOf('建筑') >= 0
          ) {
            item.meta.icon = 'el-icon-office-building'
          }

          if (item.meta.title.indexOf('工厂') >= 0) {
            item.meta.icon = 'el-icon-school'
          }
          if (
            item.meta.title.indexOf('人') >= 0 ||
              item.meta.title.indexOf('员工') >= 0
          ) {
            item.meta.icon = 'el-icon-user-solid'
          } else if (item.meta.title.indexOf('工序') >= 0) {
            item.meta.icon = 'el-icon-s-operation'
          } else if (item.meta.title.indexOf('场景') >= 0) {
            item.meta.icon = 'el-icon-picture-outline'
          } else if (item.meta.title.indexOf('质检') >= 0) {
            item.meta.icon = 'el-icon-circle-check'
          } else if (item.meta.title.indexOf('监控') >= 0) {
            item.meta.icon = 'el-icon-camera'
          } else if (item.meta.title.indexOf('票') >= 0) {
            item.meta.icon = 'el-icon-s-ticket'
          } else if (item.meta.title.indexOf('信息') >= 0) {
            item.meta.icon = 'el-icon-info'
          } else if (item.meta.title.indexOf('系统') >= 0) {
            item.meta.icon = 'el-icon-data-analysis'
          } else if (item.meta.title.indexOf('控制') >= 0) {
            item.meta.icon = 'el-icon-eleme'
          } else if (
            item.meta.title.indexOf('光') >= 0 ||
              item.meta.title.indexOf('支路') >= 0
          ) {
            item.meta.icon = 'el-icon-cpu'
          } else if (item.meta.title.indexOf('照明') >= 0) {
            item.meta.icon = 'el-icon-s-opportunity'
          } else if (item.meta.title.indexOf('空调') >= 0) {
            item.meta.icon = 'el-icon-receiving'
          } else if (item.meta.title.indexOf('能耗') >= 0) {
            item.meta.icon = 'el-icon-magic-stick'
          } else if (item.meta.title.indexOf('机械') >= 0) {
            item.meta.icon = 'material'
          } else if (item.meta.title.indexOf('停车') >= 0) {
            item.meta.icon = 'stop'
          }
          if (item.meta.title.indexOf('对战') >= 0) {
            item.meta.icon = 'fight'
          } else if (item.meta.title.indexOf('射击') >= 0) {
            item.meta.icon = 'shooting'
          } else if (item.meta.title.indexOf('跑') >= 0) {
            item.meta.icon = 'run'
          } else if (item.meta.title.indexOf('跳') >= 0) {
            item.meta.icon = 'jump'
          } else if (item.meta.title.indexOf('投') >= 0) {
            item.meta.icon = 'throw'
          }

          // console.log("mata", item.meta);
          // el-icon-cloudy
        }
      })
      // console.log('routes', routes)
      resolve(routes)
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    // return new Promise((resolve, reject) => {
    // logout(state.token).then(() => {
    removeToken() // must remove  token  first
    resetRouter()
    commit('RESET_STATE')
    // resolve()
    // }).catch(error => {
    //   reject(error)
    // })
    // })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

