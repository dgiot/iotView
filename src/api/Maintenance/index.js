import request from '@/utils/request'
// export async function getView(ObjectId) {
//   return get_object('View', ObjectId)
// }
export function getMaintenance(params) {
  return request({
    url: `/classes/Maintenance`,
    method: 'get',
    params
  })
}

