import request from '@/utils/request'
// export async function getView(ObjectId) {
//   return get_object('View', ObjectId)
// }
export function queryNotification(params) {
  return request({
    url: `/amis/Notification`,
    method: 'get',
    params
  })
}

export function getNotification(params) {
  return request({
    url: `/classes/Notification`,
    method: 'get',
    params
  })
}


