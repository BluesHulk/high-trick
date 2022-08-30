import http from '@/utils/http';
// factory
export function getFactoryQuery(params) {
  return http({
    url: '/resource/config/deviceFactory/query',
    method: 'get',
    params
  });
}

export function getFactoryAdd(data) {
  return http({
    url: '/resource/config/deviceFactory/add',
    method: 'post',
    data
  });
}
// category
export function getCategoryQuery(params) {
  return http({
    url: '/resource/config/category/query',
    method: 'get',
    params
  });
}

export function queryByCategoryId(params) {
  return http({
    url: '/resource/config/attribute/queryByCategoryId',
    method: 'get',
    params
  });
}

export function categoryAdd(data) {
  return http({
    url: '/resource/config/category/add',
    method: 'post',
    contentType: 'application/json',
    data
  });
}

export function categoryUpdate(data) {
  return http({
    url: '/resource/config/category/update',
    method: 'post',
    contentType: 'application/json',
    data
  });
}
// group
export function getGroupQuery(params) {
  return http({
    url: '/resource/config/attributeGroup/query',
    method: 'get',
    params
  });
}

export function groupAdd(data) {
  return http({
    url: '/resource/config/attributeGroup/add',
    method: 'post',
    data
  });
}

export function groupUpdate(data) {
  return http({
    url: '/resource/config/attributeGroup/update',
    method: 'post',
    data
  });
}
// space
export function getSpaceData(params) {
  return http({
    url: '/resource/spaceData/query',
    method: 'get',
    params
  });
}
export function getSpaceDetail(params) {
  return http({
    url: '/resource/spaceData/queryById',
    method: 'get',
    params
  });
}
export function spaceAdd(data) {
  return http({
    url: '/resource/spaceData/add',
    method: 'post',
    contentType: 'application/json',
    data
  });
}
export function spaceUpdate(data) {
  return http({
    url: '/resource/spaceData/update',
    method: 'post',
    contentType: 'application/json',
    data
  });
}
// device
export function getDeviceData(params) {
  return http({
    url: '/resource/deviceData/query',
    method: 'get',
    params
  });
}
export function deviceAdd(data) {
  return http({
    url: '/resource/deviceData/add',
    method: 'post',
    contentType: 'application/json',
    data
  });
}
export function deviceUpdate(data) {
  return http({
    url: '/resource/deviceData/update',
    method: 'post',
    contentType: 'application/json',
    data
  });
}
// project
export function getProjectData(params) {
  return http({
    url: '/resource/projectData/query',
    method: 'get',
    params
  });
}
export function getProjectDetail(params) {
  return http({
    url: '/resource/projectData/queryById',
    method: 'get',
    params
  });
}
export function projectAdd(data) {
  return http({
    url: '/resource/projectData/add',
    method: 'post',
    contentType: 'application/json',
    data
  });
}
export function projectUpdate(data) {
  return http({
    url: '/resource/projectData/update',
    method: 'post',
    contentType: 'application/json',
    data
  });
}
// other
export function getXAssetData(params) {
  return http({
    url: '/resource/xAssetData/query',
    method: 'get',
    params
  });
}
export function assetAdd(data) {
  return http({
    url: '/resource/xAssetData/add',
    method: 'post',
    contentType: 'application/json',
    data
  });
}
export function assetUpdate(data) {
  return http({
    url: '/resource/xAssetData/update',
    method: 'post',
    contentType: 'application/json',
    data
  });
}
// 关联设备（id,type,categoryId,nameOrCode）
export function queryDeviceWithTree(params) {
  return http({
    url: '/resource/deviceData/queryDeviceWithTree',
    method: 'get',
    params
  });
}
// 已关联设备（id,type）
export function queryRelationDevice(params) {
  return http({
    url: '/resource/association/queryRelationDevice',
    method: 'get',
    params
  });
}
// 关联资产（id,type,categoryId）
export function queryXasset(params) {
  return http({
    url: '/resource/xAssetData/queryDeviceWithTree',
    method: 'get',
    params
  });
}
// 已关联资产（id,type）
export function queryRelationXasset(params) {
  return http({
    url: '/resource/association/queryRelationXasset',
    method: 'get',
    params
  });
}
// 关联空间
export function querySpaceUnbound(params) {
  return http({
    url: '/resource/spaceData/querySpaceUnbound',
    method: 'get',
    params
  });
}
// 已关联空间
export function queryRelationSpace(params) {
  return http({
    url: '/resource/association/queryRelationSpace',
    method: 'get',
    params
  });
}
// 项目列表
export function attachQuery(params) {
  return http({
    url: '/resource/attach/query',
    method: 'get',
    params
  });
}
// 项目文件上传
export function attachAdd(data) {
  return http({
    url: '/resource/attach/add',
    method: 'post',
    data
  });
}
// 项目资料删除
export function attachDelete(data) {
  return http({
    url: '/resource/attach/delete',
    method: 'post',
    data
  });
}
//  关联人员
export function queryRelatePersons(params) {
  return http({
    url: '/resource/projectData/queryRelatePersons',
    method: 'get',
    params
  });
}
