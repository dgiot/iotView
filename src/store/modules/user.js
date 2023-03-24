import { login, logout, getInfo, verifyCode } from '@/api/User/index'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import Cookies from 'js-cookie'

const getDefaultState = () => {
  return {
    token: getToken(),
    departmentToken: Cookies.get('departmentToken') || '',
    name: localStorage.getItem('name') || '',
    avatar: '',
    objectId: localStorage.getItem('objectId') || '',
    routes: [],
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
    console.log('objectId', objectId);
    state.objectId = objectId
  },
  setRoutes: (state, routes) => {
    console.log('routes', routes);
    state.routes = routes
  }
}

const actions = {
  // user login
  codelogin({ commit }, userInfo) {
    const { username, password, phone, code } = userInfo
    return new Promise((resolve, reject) => {
      verifyCode(phone, code, username, password).then(res => {
        console.log('response', res);
        const { sessionToken, name, tag, objectId, roles } = res
        if (tag.userinfo && tag.userinfo.parse_deviceid) {
          localStorage.setItem('parse_deviceid', tag.userinfo.parse_deviceid)
        } else {
          localStorage.removeItem('parse_deviceid')
        }
        localStorage.setItem('avatar', tag.userinfo.avatar)
        commit('SET_NAME', name)
        localStorage.setItem('name', name)
        commit('SET_OBJECTID', objectId)  //用户唯一标识
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
        console.log('response', res);
        const { sessionToken, name, tag, objectId, roles } = res
        if (tag.userinfo && tag.userinfo.parse_deviceid) {
          localStorage.setItem('parse_deviceid', tag.userinfo.parse_deviceid)
        } else {
          localStorage.removeItem('parse_deviceid')
        }
        localStorage.setItem('avatar', tag.userinfo.avatar)
        commit('SET_NAME', name)
        localStorage.setItem('name', name)
        commit('SET_OBJECTID', objectId)  //用户唯一标识
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

