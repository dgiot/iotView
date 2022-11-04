import Cookies from 'js-cookie'

const state = {
  _product_count:Cookies.get('_product_count') || 0, //产品总数
  _dev_count: Cookies.get('_dev_count') || 0, //设备总数
  _dev_online_count: Cookies.get('_dev_online_count') || 0, //在线
  _dev_off_count: Cookies.get('_dev_off_count') || 0, //离线
}

const mutations = {
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  set_product_count: (state, _product_count) => {
    state._product_count = _product_count
  },
  set_dev_count: (state, _dev_count) => {
    state._dev_count = _dev_count
  },
  set_dev_online_count: (state, _dev_online_count) => {
    state._dev_online_count = _dev_online_count
  },
  set_dev_off_count: (state, _dev_off_count) => {
    state._dev_off_count = _dev_off_count
  },
}

const actions = {
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
