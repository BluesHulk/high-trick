const webpack = require('webpack');

require('events').EventEmitter.defaultMaxListeners = 15;

const config = {
  devServer: {
    hot: true,
    open: true,
    proxy: process.env.NODE_ENV === 'development' ? require('./proxy.conf') : {},
    overlay: {
      warnings: true,
      errors: true
    }
  },
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery'
      })
    ],
    externals: {
      AMap: 'AMap', // 高德地图配置
      AMapUI: 'AMapUI'
    }
  },
  lintOnSave: false
};

module.exports = config;
