import request from '@/utils/request'

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
