import request from '@/utils/request'
import axios from 'axios'
import { getToken } from '@/utils/auth'
// export async function getView(ObjectId) {
//   return get_object('View', ObjectId)
// }
export function getDlinkJson(data) {
  return request({
    url: `/dlinkjson`,
    method: 'get',
    params: {
      type: data
    }
  })
}
export async function Startdashboard(dashboardId,data) {
  // console.log('window',window.location.origin);
  let ip = window.location.origin
  if(ip.indexOf('localhost'>=0)){
    ip = 'http://dev.iotn2n.com'
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
