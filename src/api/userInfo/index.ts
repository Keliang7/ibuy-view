import request from '@/axios'

export const getListApi = (params: any) => {
  return request.get({ url: 'api/userInfo', params })
}
export const deleteApi = (params: any) => {
  return request.delete({ url: '/api/userInfo', data: params })
}
export const editApi = (data: any) => {
  return request.put({ url: 'api/userInfo', data })
}
export const addApi = (params: any): Promise<IResponse<string[]>> => {
  return request.post({
    url: '/api/userInfo',
    data: params
  })
}
