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

