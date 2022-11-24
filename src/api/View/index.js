import request from '@/utils/request'
// export async function getView(ObjectId) {
//   return get_object('View', ObjectId)
// }
export function queryView(params) {
  return request({
    url: `classes/View`,
    method: 'get',
    params
  })
}
export function getView(objectId) {
  return request({
    url: `classes/View/${objectId}`,
    method: 'get',
  })
}
export function getTopo(params) {
  return request({
    url: `topo`,
    method: 'get',
    params
  })
}




