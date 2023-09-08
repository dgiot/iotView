import request from '@/utils/request'

export function queryView(params) {
  return request({
    url: `classes/View`,
    method: 'get',
    params
  })
}
export function getView(objectId, params = {}) {
  return request({
    url: `amis/View/${objectId}`,
    method: 'get',
    params
  })
}
export function getTopo(params) {
  return request({
    url: `/topo`,
    method: 'get',
    params
  })
}
export function postAmis(params, data) {
  return request({
    url: `/amis`,
    method: 'post',
    params,
    data
  })
}

export function postBatchAmis(data) {
  return request({
    url: `/batch_amis`,
    method: 'post',
    data
  })
}

