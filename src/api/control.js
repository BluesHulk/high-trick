import http from '@/utils/http';

export class Control {
  static command(data) {
    return http({
      url: '/ener-datadapter/platform/command',
      method: 'post',
      data
    });
  }
}
