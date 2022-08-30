<template>
  <div
    id="previewWnd"
    ref="previewWnd"
    style="width: 100%; height: 100%; color: #ccc; line-height: 25px; text-indent: 10px"
  ></div>
</template>

<script>
import $ from 'jquery';
import { getStyle, postDownLoadExe } from '@/utils/utils';
import { getVideoPlugin } from '@/api/monitor';

export default {
  name: 'preview',
  props: {
    nodeData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      appkey: '',
      secret: '',
      enableHTTPS: 0,
      ip: '',
      port: 30080,
      cameraId: '',
      pubKey: '',
      oWebControl: null,
      initCount: 0,
      playMode: 0,
      encryptedFields: ['secret'],
      snapDir: 'D:\\SnapDir',
      videoDir: 'D:\\VideoDir',
      layout: '1x1',
      streamMode: 0,
      transMode: 1,
      gpuMode: 0,
      playType: -1,
      loading: {}
    };
  },
  watch: {
    nodeData(newVal, oldVal) {
      if (oldVal.appKey) {
        if (
          newVal.ip != oldVal.ip ||
          newVal.port != oldVal.port ||
          newVal.appSecret != oldVal.appSecret ||
          newVal.appKey != oldVal.appKey
        ) {
          this.appkey = oldVal.appKey;
          this.secret = oldVal.appSecret;
          this.enableHTTPS = oldVal.enableHttps;
          this.ip = oldVal.ip;
          this.port = parseInt(oldVal.port);
          this.cameraId = newVal.cameraUuid;
          this.reInit();
        } else {
          this.cameraId = newVal.cameraUuid;
          this.startPreview();
        }
      } else {
        this.getQueryData();
      }
    }
  },
  mounted() {
    // this.getQueryData();
  },
  beforeDestroy() {
    if (this.oWebControl) {
      this.uninit();
    }
  },
  methods: {
    getQueryData() {
      this.appkey = this.nodeData.appKey;
      this.secret = this.nodeData.appSecret;
      this.enableHTTPS = this.nodeData.enableHttps;
      this.ip = this.nodeData.ip;
      this.port = parseInt(this.nodeData.port);
      this.cameraId = this.nodeData.cameraUuid;
      this.initPlugin();
    },
    setEncrypt(value) {
      var encrypt = new JSEncrypt();
      encrypt.setPublicKey(this.pubKey);
      return encrypt.encrypt(value);
    },
    setCallbacks() {
      this.oWebControl &&
        this.oWebControl.JS_SetWindowControlCallback({
          cbIntegrationCallBack: this.cbIntegrationCallBack
        });
    },
    cbIntegrationCallBack(oData) {
      this.showCBInfo(JSON.stringify(oData.responseMsg));
    },
    showCBInfo(szInfo, type) {
      if (type === 'error') {
        // console.log(this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss') + ' ' + szInfo);
      } else {
        // console.info(this.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss') + ' ' + szInfo);
      }
    },
    dateFormat(oDate, fmt) {
      var o = {
        'M+': oDate.getMonth() + 1, // 月份
        'd+': oDate.getDate(), // 日
        'h+': oDate.getHours(), // 小时
        'm+': oDate.getMinutes(), // 分
        's+': oDate.getSeconds(), // 秒
        'q+': Math.floor((oDate.getMonth() + 3) / 3), // 季度
        S: oDate.getMilliseconds() // 毫秒
      };
      if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp('(' + k + ')').test(fmt)) {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }
      return fmt;
    },
    initPlugin() {
      this.oWebControl = new WebControl({
        szPluginContainer: 'previewWnd',
        iServicePortStart: 15900,
        iServicePortEnd: 15909,
        cbConnectSuccess: () => {
          this.setCallbacks();

          this.oWebControl &&
            this.oWebControl
              .JS_StartService('window', {
                dllPath: './VideoPluginConnect.dll'
              })
              .then(
                () => {
                  const size = this.getSize();
                  this.oWebControl.JS_CreateWnd('previewWnd', size.width, size.height).then(() => {
                    this.init();
                  });
                },
                () => {}
              );
        },
        cbConnectError: () => {
          this.oWebControl = null;
          $('#previewWnd').html('插件未启动，正在尝试启动，请稍候...');
          WebControl.JS_WakeUp('VideoWebPlugin://');
          this.initCount++;
          if (this.initCount < 3) {
            setTimeout(() => {
              this.initPlugin();
            }, 3000);
          } else {
            $('#previewWnd').html(
              '启动失败，请检查安装插件！<br/><div id="downloadVideo" style="text-decoration:underline;cursor:pointer">点击下载插件</div>'
            );
            // $('#previewWnd').html('启动失败，请检查安装插件！');
            this.getVideoPlugin();
          }
          // 2019-7-23 下载插件
        },
        cbConnectClose: () => {
          this.oWebControl = null;
        }
      });
      this.setSize();
      $(window).resize(this.setSize);
      $(window).scroll(this.setSize);
      $(window).focus(() => this.oWebControl && this.oWebControl.JS_ShowWnd);
      $(window).blur(() => this.oWebControl && this.oWebControl.JS_HideWnd);
    },
    getSize() {
      const previewWnd = document.getElementById('previewWnd');
      if (!previewWnd) return;
      const entranceView = previewWnd.parentNode;
      if (!entranceView) {
        $(window).unbind('resize', this.setSize);
        return;
      }
      const width = parseInt(getStyle(entranceView, 'width'), 10) || 0;
      const height = parseInt(getStyle(entranceView, 'height'), 10) || 0;
      return { width, height };
    },
    setSize() {
      const size = this.getSize();
      if (this.oWebControl) {
        this.oWebControl.JS_Resize(size.width, size.height);
      }
    },
    getVideoPlugin() {
      const that = this;
      $('#downloadVideo').click(function() {
        const loading = that.$loading({
          lock: true,
          text: '插件下载中，请稍候......',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.3)'
        });
        getVideoPlugin()
          .then(res => {
            loading.close();
            that.$message.success('插件下载成功,请安装！');
            postDownLoadExe(res, 'VideoWebPlugin');
          })
          .catch(e => {
            loading.close();
            that.$message.error('插件下载失败,请重试！');
          });
      });
    },
    init() {
      this.getPubKey(() => {
        if (!this.appkey) {
          this.showCBInfo('appkey不能为空！', 'error');
          return;
        }
        if (!this.secret) {
          this.showCBInfo('secret不能为空！', 'error');
          return;
        }
        if (!this.ip) {
          this.showCBInfo('ip不能为空！', 'error');
          return;
        }
        if (!this.port) {
          this.showCBInfo('端口不能为空！', 'error');
          return;
        } else if (!/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/.test(this.port)) {
          this.showCBInfo('端口填写有误！', 'error');
          return;
        }
        if (this.setLayout) {
          // 设置预览宫格
          this.layout = this.setLayout;
        }

        this.oWebControl
          .JS_RequestInterface({
            funcName: 'init',
            argument: JSON.stringify({
              appkey: this.appkey,
              secret: this.setEncrypt(this.secret)
                .replace(/(^\s*)/g, '')
                .replace(/(\s*$)/g, ''),
              ip: this.ip,
              playMode: this.playMode,
              port: this.port,
              snapDir: this.snapDir,
              videoDir: this.videoDir,
              layout: this.layout,
              enableHTTPS: this.enableHTTPS,
              encryptedFields: this.encryptedFields.join(',')
            })
          })
          .then(oData => {
            this.showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''));
            this.startPreview();
          });
      });
    },
    uninit() {
      this.oWebControl && this.oWebControl.JS_HideWnd();
      this.oWebControl &&
        this.oWebControl.JS_Disconnect().then(
          function() {},
          function() {}
        );
    },
    reInit() {
      // 反初始化
      this.oWebControl
        .JS_RequestInterface({
          funcName: 'uninit'
        })
        .then(oData => {
          this.showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''));
          this.init();
        });
    },
    startPreview() {
      const cameraIndexCode = this.cameraId.replace(/(^\s*)/g, '').replace(/(\s*$)/g, '');
      let wndId = -1;
      if (this.playType === 2) {
        wndId = 1;
      } else if (this.playType === 1) {
        wndId = 0;
      }
      if (!cameraIndexCode) {
        this.showCBInfo('监控点编号不能为空！', 'error');
        return;
      }
      try {
        this.oWebControl
          .JS_RequestInterface({
            funcName: 'startPreview',
            argument: JSON.stringify({
              cameraIndexCode: cameraIndexCode,
              streamMode: this.streamMode,
              transMode: this.transMode,
              gpuMode: this.gpuMode,
              wndId: wndId
            })
          })
          .then(oData => {
            this.showCBInfo(JSON.stringify(oData ? oData.responseMsg : ''));
          });
      } catch (e) {}
    },
    getPubKey(callback) {
      this.oWebControl
        .JS_RequestInterface({
          funcName: 'getRSAPubKey',
          argument: JSON.stringify({
            keyLength: 1024
          })
        })
        .then(oData => {
          if (oData.responseMsg.data) {
            this.pubKey = oData.responseMsg.data;
            callback();
          }
        });
    }
  }
};
</script>

<style scoped lang="scss"></style>
