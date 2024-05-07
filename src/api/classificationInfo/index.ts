import request from '@/axios'

export const getListApi = (params: any) => {
  return request.get({ url: 'api/goodsClassInfo', params })
}
