import request from '@/axios'

export const getListApi = (params: any) => {
  return request.get({ url: 'api/roleInfo', params })
}
export const deleteApi = (params: any) => {
  return request.delete({ url: '/roleInfo', params })
}
export const editApi = (params: any) => {
  return request.put({ url: '/roleInfo', params })
}
export const addApi = (params: any) => {
  return request.post({
    url: '/api/roleInfo',
    data: params,
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}
