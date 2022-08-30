import { Store } from '@silen/store';

const TokenKey = 'access_token';

export function getToken() {
  return JSON.parse(Store.get(TokenKey));
}

export function setToken(access_token) {
  Store.set(TokenKey, access_token);
}

export function removeToken() {
  return Store.remove(TokenKey);
}

export function getUserInfo() {
  const token = getToken();
  if (!token) return;
  const Authorization = token.Authorization;
  if (!Authorization) return;
  const info = token[Authorization];
  if (!info) return;
  const { userInfo } = info;
  return userInfo;
}

// ----------------------------------------------------------
// GT20201103-128
const CenterKey = 'user_info';

export function getUser() {
  return JSON.parse(Store.get(CenterKey));
}

export function setUser(access_token) {
  Store.set(CenterKey, access_token);
}

export function removeUser() {
  return Store.remove(CenterKey);
}
