import request from '@/utils/request'

export function getNavigation() {
  return request({
    url: `/classes/Navigation`,
    method: 'get',
  })
}

