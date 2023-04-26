import request from '@/utils/request'

export async function postHead(data) {
  return request({
    url: '/head',
    method: 'post',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
    },
    data: data,
  })
}