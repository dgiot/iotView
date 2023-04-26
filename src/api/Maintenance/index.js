import request from '@/utils/request'

export function getMaintenance(params) {
  return request({
    url: `/classes/Maintenance`,
    method: 'get',
    params
  })
}

