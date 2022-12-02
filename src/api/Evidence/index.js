import request from '@/utils/request'
// export async function getView(ObjectId) {
//   return get_object('View', ObjectId)
// }

export function queryEvidence(params) {
  return request({
    url: `/classes/Evidence`,
    method: 'get',
    params
  })
}
export function postBatch(data) {
  return request({
    url: `/batch`,
    method: 'post',
    data
  })
}
export async function postEvidence(id, params) {
  return request({
    url: `/evidence?id=${id}`,
    method: 'post',
    data: params,
  })
}
export async function generatereport(id) {
  return request({
    url: `/generatereport?id=${id}`,
    method: 'post',
  })
}
export async function delEvidence(ObjectId) {
  return request({
    url: `/classes/Evidence/${ObjectId}`,
    method: 'delete',
  })
}
export async function putEvidence(ObjectId, data) {
  return request({
    url: `/classes/Evidence/${ObjectId}`,
    method: 'put',
    data
  })
}


