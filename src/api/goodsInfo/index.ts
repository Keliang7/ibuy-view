import request from '@/axios'

export const getListApi = (params: any) => {
  return request.get({ url: 'api/goodsInfo/getListByPage', params })
}
export const deleteApi = (params: any) => {
  return request.delete({ url: 'api/goodsInfo', data: params })
}
export const editApi = (params: any) => {
  return request.put({
    url: 'api/goodsInfo',
    data: params,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
export const addApi = (params: any) => {
  return request.post({
    url: '/api/goodsInfo',
    data: params,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
