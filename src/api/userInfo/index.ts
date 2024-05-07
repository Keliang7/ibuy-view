import request from '@/axios'

export const getListApi = (params: any) => {
  return request.get({ url: 'api/userInfo/getListByPage', params })
}
export const deleteApi = (params: any) => {
  return request.delete({ url: 'api/userInfo', data: params })
}
export const editApi = (params: any) => {
  return request.put({ url: '/userInfo', params })
}
export const addApi = (params: any) => {
  return request.post({
    url: '/api/userInfo',
    data: params
  })
}
