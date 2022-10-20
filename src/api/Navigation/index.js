import request from '@/utils/request'
// export async function getView(ObjectId) {
//   return get_object('View', ObjectId)
// }
export function getNavigation() {
  return request({
    url: `/classes/Navigation`,
    method: 'get',
  })
}

