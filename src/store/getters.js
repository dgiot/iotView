const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  objectId: state => state.objectId,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  departmentToken: state => state.departmentToken,
}
export default getters
