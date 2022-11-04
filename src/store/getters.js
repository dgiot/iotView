const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  objectId: state => state.objectId,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  departmentToken: state => state.departmentToken,
  _product_count:state => state.dashboard._product_count, //产品总数
  _dev_count: state => state.dashboard._dev_count, //设备总数
  _dev_online_count: state => state.dashboard._dev_online_count, //在线
  _dev_off_count: state => state.dashboard._dev_off_count, //离线
}
export default getters
