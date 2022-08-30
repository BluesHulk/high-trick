module.exports = {
  '/': {
    target: 'http://192.168.30.12:19101', // 开发环境
    // target: 'http://192.168.30.17:29101', // 提测预览环境
    // target: 'http://192.168.30.17:39101', // 演示环境
    ws: false,
    changeOrigin: true
  }
};
