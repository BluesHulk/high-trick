import http from '@/utils/http';

export function getAddress() {
  return http({
    url: '/gateway/address',
    method: 'get'
  });
}
