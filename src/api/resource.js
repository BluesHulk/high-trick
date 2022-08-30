import http from '@/utils/http';

export function resourceDeviceDataQueryDeviceList(params) {
  return http({
    url: '/resource/deviceData/queryDeviceList',
    method: 'get',
    params
  });
}

export function resourceProjectDataQueryProjectList() {
  return http({
    url: '/resource/projectData/queryProjectList',
    method: 'get'
  });
}

export function resourceSpaceDataQuerySpaceList(params) {
  return http({
    url: '/resource/spaceData/querySpaceList',
    method: 'get',
    params
  });
}

export function resourceConfigCategoryQuery(params) {
  return http({
    url: '/resource/config/category/query',
    method: 'get',
    params
  });
}

export function resourceXAssetDataQueryXassetList(params) {
  return http({
    url: '/resource/xAssetData/queryXassetList',
    method: 'get',
    params
  });
}
