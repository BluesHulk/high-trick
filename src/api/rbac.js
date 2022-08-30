import http from '@/utils/http';
import { getUserInfo } from '@/storage/auth';

export function login(data) {
  return http({
    url: '/rbac/login',
    method: 'post',
    data
  });
}

export function logout() {
  return http({
    url: '/rbac/logout',
    method: 'post',
    contentType: 'application/json'
  });
}

export function changePassword(data) {
  return http({
    url: '/rbac/changePassword',
    method: 'post',
    data
  });
}

export function userChangePassword(data) {
  return http({
    url: '/rbac/user/changePassword',
    method: 'post',
    data
  });
}

export function organizeQueryFuzzy(params) {
  return http({
    url: '/rbac/organize/query/fuzzy',
    method: 'get',
    params
  });
}

export function organizeQueryFuncTree(params) {
  return http({
    url: '/rbac/organize/query/funcTree',
    method: 'get',
    params
  });
}

export function organizeSaveOrgAndStaff(data) {
  return http({
    url: '/rbac/organize/save/orgAndStaff',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function organizeQuery(id) {
  return http({
    url: '/rbac/organize/query/' + id,
    method: 'get'
  });
}

export function organizeQueryNodeContainStaff(params) {
  return http({
    url: '/rbac/organize/query/nodeContainStaff',
    method: 'get',
    params
  });
}

export function organizeUpdate(data) {
  return http({
    url: '/rbac/organize/update',
    method: 'post',
    data
  });
}

export function organizeUpload(data) {
  return http({
    url: '/rbac/organize/inport',
    method: 'post',
    data
  });
}

export function organizeDelete(id) {
  return http({
    url: '/rbac/organize/delete/' + id,
    method: 'delete'
  });
}

export function organizeAdd(data) {
  return http({
    url: '/rbac/organize/add',
    method: 'post',
    data
  });
}

export function organizeDownload() {
  return http({
    url: '/rbac/organize/export',
    method: 'get',
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
}

export function staffDelete(id) {
  return http({
    url: '/rbac/staff/delete/' + id,
    method: 'delete'
  });
}

export function staffUpload(data) {
  // data.append('id', getUserInfo().staffId);
  return http({
    url: '/rbac/staff/inport',
    method: 'post',
    data
  });
}

export function staffAdd(data) {
  return http({
    url: '/rbac/staff/add',
    method: 'post',
    data
  });
}

export function staffQueryFuzzy(params) {
  return http({
    url: '/rbac/staff/query/fuzzy',
    method: 'get',
    params
  });
}

export function staffQueryPage(data) {
  return http({
    lazy: true,
    url: '/rbac/staff/query/page',
    method: 'get',
    data
  });
}

export function staffQueryById(id) {
  return http({
    url: '/rbac/staff/query/' + id,
    method: 'get'
  });
}

export function staffUpdate(data) {
  return http({
    url: '/rbac/staff/update',
    method: 'post',
    data
  });
}

// 日志
export function operateLogQueryPage(params) {
  return http({
    url: '/rbac/operateLog/query/page',
    method: 'get',
    params
  });
}

export function operateLogQueryStatus() {
  return http({
    url: '/rbac/operateLog/query/status',
    method: 'get'
  });
}

export function operateLogQueryOperate(params) {
  return http({
    url: '/rbac/operateLog/query/operate',
    method: 'get',
    params
  });
}

// 角色
export function roleQueryBatch(params) {
  return http({
    url: '/rbac/role/query/batch',
    method: 'get',
    params
  });
}

export function roleQueryPage(params) {
  return http({
    lazy: true,
    url: '/rbac/role/query/page',
    method: 'get',
    params
  });
}

export function roleAdd(data) {
  return http({
    url: '/rbac/role/add',
    method: 'post',
    data
  });
}

export function roleDelete(id) {
  return http({
    url: '/rbac/role/delete/' + id,
    method: 'delete'
  });
}

export function roleUpdate(data) {
  return http({
    url: '/rbac/role/update',
    method: 'post',
    data
  });
}

// 角色
export function userQueryFuzzy(params) {
  return http({
    url: '/rbac/user/query/fuzzy',
    method: 'get',
    params
  });
}

export function userQueryById(id) {
  return http({
    url: '/rbac/user/query/' + id,
    method: 'get'
  });
}

export function userQueryPage(params) {
  return http({
    lazy: true,
    url: '/rbac/user/query/page',
    method: 'get',
    params
  });
}

export function userAdd(data) {
  return http({
    url: '/rbac/user/add',
    method: 'post',
    data
  });
}

export function createAccount(params) {
  return http({
    url: '/rbac/user/create/account',
    method: 'get',
    params
  });
}

export function userUpdate(data) {
  return http({
    url: '/rbac/user/update',
    method: 'post',
    data
  });
}

export function userDelete(id) {
  return http({
    url: '/rbac/user/delete/' + id,
    method: 'delete'
  });
}

export function funcQueryFuncTree(params, lazy = false) {
  return http({
    lazy,
    url: '/rbac/func/query/funcTree',
    method: 'get',
    params
  });
}

// 权限 - 返回值包含：路由权限控制、菜单权限控制、按钮权限控制
export function frontQueryFrontTree(params) {
  return http({
    url: '/rbac/front/query/frontTree',
    method: 'get',
    params
  });
}

export function dataAuthQuery() {
  const userInfo = getUserInfo();
  const { id } = userInfo;
  return http({
    url: '/rbac/dataAuth/query/' + id,
    method: 'get'
  });
}

export function dataAuthUpdate(data) {
  return http({
    url: '/rbac/dataAuth/update',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function dataDomainQueryDomainDetail() {
  return http({
    url: '/rbac/dataDomain/query/domainDetail',
    method: 'get'
  });
}

export function dataAuthQueryById(id) {
  return http({
    url: '/rbac/dataAuth/query/' + id,
    method: 'get'
  });
}
