import request from '@/utils/request'
// export async function getView(ObjectId) {
//   return get_object('View', ObjectId)
// }
export function getDlinkJson(params) {
  return request({
    url: `/dlinkjson`,
    method: 'get',
    params
  })
}
export function Startdashboard(dashboardId,data) {
  return request({
    url: `/dashboard?dashboardId=${dashboardId}`,
    method: 'post',
    data
  })
}
