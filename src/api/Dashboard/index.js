import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'


const server = 'http://192.168.100.3'

export function getDlinkJson(data) {
  return request({
    url: `/dlinkjson`,
    method: 'get',
    params: {
      type: data
    }
  })
}
export async function Startdashboard(dashboardId, data) {
  // console.log('window', window.location.origin);
  let ip = window.location.origin
  if (ip.indexOf('localhost') >= 0) {
    ip = server
  }
  return axios({
    url: `${ip}/iotapi/dashboard`,
    method: 'post',
    data: data,
    params: {
      dashboardId: dashboardId
    },
    headers: {
      "sessionToken": getToken()
    }
  })
}
// export async function sendTopic(data) {
//   // console.log('window', window.location.origin);
//   let ip = window.location.origin
//   if (ip.indexOf('localhost') >= 0) {
//     ip = server
//   }
//   return axios({
//     url: `${ip}/iotapi/topic`,
//     method: 'post',
//     data: data,
//     headers: {
//       "sessionToken": getToken()
//     }
//   })
// }
export function sendTopic(data) {
  return request({
    url: `/topic`,
    method: 'post',
    data
  })
}
export function postCookie(data) {
  return request({
    url: `/cookie`,
    method: 'post',
    data
  })
}
