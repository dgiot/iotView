import request from '@/utils/request'

export function queryRelation(params) {
  return request({
    url: `/relation`,
    method: 'get',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    params: params,
  })
}

