import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data,
    headers: {
      "Content-Type": "text/plain"
    }
  })
}
export function Roletree() {
  return request({
    url: '/roletree',
    method: 'get',
  })
}
export function getToken(params) {
  return request({
    url: '/token',
    method: 'get',
    params
  })
}

export function putUserInfo(objectId, data) {
  return request({
    url: `/amis/_User/${objectId}`,
    method: "put",
    data
  })
}




export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
