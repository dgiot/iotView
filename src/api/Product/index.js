import request from '@/utils/request'
// export async function getView(ObjectId) {
//   return get_object('View', ObjectId)
// }
export function queryProduct(params) {
  return request({
    url: `/classes/Product`,
    method: 'get',
    params
  })
}

// export function getDevice(objectId) {
//   return request({
//     url: `/classes/Device/${objectId}`,
//     method: 'get',
//   })
// }
