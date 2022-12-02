import axios from 'axios'

export async function uppyUpload(
  url,
  params,
  headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json; charset=utf-8',
  }
) {
  return axios.post(url, params, headers)
}
