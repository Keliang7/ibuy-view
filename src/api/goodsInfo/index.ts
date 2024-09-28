import request from '@/axios'

export const getListApi = (params: any) => {
  return request.get({ url: 'api/goodsInfo', params })
}
export const deleteApi = (data: any) => {
  return request.delete({ url: 'api/goodsInfo', data })
}
export const editApi = (data: any) => {
  return request.put({
    url: 'api/goodsInfo',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const addApi = (data: any) => {
  return request.post({
    url: '/api/goodsInfo',
    data,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
