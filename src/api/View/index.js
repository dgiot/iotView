import request from '@/utils/request'
// export async function getView(ObjectId) {
//   return get_object('View', ObjectId)
// }
export function getView(objectId) {
  return request({
    url: `classes/View/${objectId}`,
    method: 'get',
  })
}


