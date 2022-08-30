import http from '@/utils/http';
import { mergeData } from '@/utils/utils';

export function queryByType(params) {
  return http({
    url: '/message/template/queryByType',
    method: 'get',
    params
  });
}

export function templateAdd(data) {
  return http({
    url: '/message/template/add',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function templateUpdate(data) {
  return http({
    url: '/message/template/update',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function templateEnableFlag(data, id) {
  return http({
    url: '/message/template/enableFlag/' + id,
    method: 'post',
    data
  });
}

export function templateDelete(data) {
  return http({
    url: '/message/template/delete',
    method: 'post',
    data
  });
}

export function templateVariables(params) {
  return http({
    url: '/message/template/variables',
    method: 'get',
    params
  });
}

export function templateTypes(params) {
  return http({
    url: '/message/template/types',
    method: 'get',
    params
  });
}

export function systemMessage(params) {
  return http({
    url: '/message/msgData/systemMessage',
    method: 'get',
    params
  });
}

export function generateSysMessage(data) {
  return http({
    url: '/message/msgData/generateSysMessage',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function msgDataUpdate(data) {
  return http({
    url: '/message/msgData/update',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function msgDelete(id) {
  return http({
    url: '/message/msgData/delete/' + id,
    method: 'post',
    contentType: 'application/json'
  });
}

export function sendSysMessage(data) {
  return http({
    url: '/message/msgData/sendSysMessage',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function msgUserLogDelete(data) {
  mergeData(data, 'userId');
  return http({
    url: '/message/msgUserLog/delete',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function msgUserLogHasRead(data) {
  mergeData(data, 'userId');
  return http({
    url: '/message/msgUserLog/hasRead',
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function queryAllWebInfo(query, data) {
  return http({
    url: '/message/msgUserLog/queryAllWebInfo' + query,
    method: 'post',
    data,
    contentType: 'application/json'
  });
}

export function unreadCount(userId) {
  return http({
    url: '/message/msgUserLog/unreadCount/' + userId,
    method: 'get'
  });
}
