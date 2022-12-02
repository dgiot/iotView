import request from '@/utils/request'
// export async function getView(ObjectId) {
//   return get_object('View', ObjectId)
// }
export function querycompanyDevice(params) {
  return request({
    url: `/classes/Device`,
    method: 'get',
    params
  })
}

export function getDevice(objectId) {
  return request({
    url: `/classes/Device/${objectId}`,
    method: 'get',
  })
}
export function putDevice(objectId, data) {
  return request({
    url: `/classes/Device/${objectId}`,
    method: 'put',
    data
  })
}
export function getDeviceRealCard(objectId) {
  return request({
    url: `/devicecard/${objectId}`,
    method: 'get',
  })
}


