<template>
  <div class="road-scene" id="roadScene">
    <!-- 地图 -->
    <div id="aMap"></div>
  </div>
</template>

<script>
// import AMap from 'AMap';
// import AMapUI from 'AMapUI';
export default {
  data() {
    return {
      personList: [],
      map: null,
      boundLngLat: {},
      mass: null,
      initKey: true,
      deviceList: []
    };
  },
  // props: {
  //     personList: [],
  //     map: null,
  //     boundLngLat: {}
  // },
  methods: {
    // 获取初始数据
    getData() {
      this.personList = require('./data.json').personList;
    },
    /** 获取人物头像位置 */
    getPersonLocation() {
      this.personList.forEach((item, index) => {
        let marker = null;
        // let src = require(`${item.url}`);
        console.log(item.url);
        //  let src = require('../../../assets/basic/person1-1.jpg');
        const src = require(`../../../assets/basic/${item.url}`);
        marker = new AMap.Marker({
          position: new AMap.LngLat(item.lnglat[0], item.lnglat[1]),
          // 将 html 传给 content
          content: `<div class="person-box status${item.type}">
                            <div class="img-box">
                                <img src="${src}" />
                            </div>
                            <div class="person-direction" style="transform:rotate(${item.deg}deg)"></div>
                        </div>`,
          // 以 icon 的 [center bottom] 为原点
          size: new AMap.Size(52, 52),
          offset: new AMap.Pixel(-24, -24)
        });

        // 将 markers 添加到地图
        this.map.add(marker);
      });
    },
    // 清空所有点
    clearMassMarks() {
      const layers = this.map.getLayers() || [];
      const clearLayers = layers.filter(item => {
        return String(item['CLASS_NAME']) === 'AMap.MassMarks';
      });
      this.map.remove(clearLayers);
    },
    /** 获取道路地图界面设备 */
    getRoadDevice() {
      this.deviceList = [];

      this.deviceList = require('./data.json').deviceList;
      if (!this.initKey) {
        this.deviceList = this.deviceList.filter(item => {
          if (this.typeList.includes(item.type) && this.statusList.includes(item.status)) {
            return true;
          }
        });
      }
      this.newDrawPointer();
    },
    newDrawPointer() {
      // 清空所有点
      this.clearMassMarks();
      var style = [
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/1-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/1-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/1-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/1-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/1-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/2-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/2-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/2-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/2-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/2-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/3-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/3-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/3-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/3-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/3-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/4-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/4-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/4-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/4-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/4-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/5-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/5-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/5-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/5-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/5-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/6-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/6-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/6-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/6-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/6-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/7-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/7-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/7-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/7-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/7-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/8-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/8-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/8-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/8-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/8-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/9-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/9-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/9-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/9-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/9-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/10-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/10-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/10-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/10-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/10-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/11-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/11-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/11-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/11-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/11-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/12-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/12-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/12-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/12-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/12-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/13-1.png',
          anchor: new AMap.Pixel(7, 20),
          size: new AMap.Size(14, 20)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/13-2.png',
          anchor: new AMap.Pixel(7, 20),
          size: new AMap.Size(14, 20)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/13-3.png',
          anchor: new AMap.Pixel(7, 20),
          size: new AMap.Size(14, 20)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/13-4.png',
          anchor: new AMap.Pixel(7, 20),
          size: new AMap.Size(14, 20)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/13-5.png',
          anchor: new AMap.Pixel(7, 20),
          size: new AMap.Size(14, 20)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/14-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/14-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/14-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/14-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/14-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/15-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/15-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/15-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/15-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/15-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/16-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/16-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/16-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/16-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/16-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: '',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: '',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: '',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: '',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: '',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/18-1.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/18-2.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/18-3.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/18-4.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        },
        {
          url: 'https://hoolink-web.obs.cn-north-1.myhwclouds.com/cloud/images/roadScene/device-icon-new/18-5.png',
          anchor: new AMap.Pixel(12, 20),
          size: new AMap.Size(25, 25)
        }
      ];

      this.mass = new AMap.MassMarks(this.deviceList, {
        opacity: 0.8,
        zIndex: 111,
        cursor: 'pointer',
        zooms: [12, 20],
        // zooms: [16, 20],
        alwaysRender: true, // 拖拽时是否重绘 超过1万的数据时 设置为 false
        style: style
      });

      var marker = new AMap.Marker({ content: ' ', map: this.map });

      this.mass.on('mouseover', e => {
        marker.show();
        marker.setPosition(e.data.lnglat);
        if (!e.data.name) e.data.name = '';
        if (!e.data.typeName) e.data.typeName = '';
        if (!e.data.installAddress) e.data.installAddress = '';
        marker.setLabel({
          content:
            '<p class="p-info">' +
            e.data.name +
            '</p><p style="margin:.5rem 0;"><span>类型：</span>' +
            e.data.typeName +
            '</p><p><span>地址：</span>' +
            e.data.installAddress +
            '</p>'
        });
      });
      this.mass.on('mouseout', e => {
        marker.hide();
      });

      this.mass.on('click', e => {
        const panByWidth = document.body.clientWidth / 3.3;
        marker.hide();
        this.map.setZoom(20);
        this.map.panTo([e.data.lnglat.lng, e.data.lnglat.lat]);
        this.map.panBy(-panByWidth, 0);
        this.detailId = e.data.id;
        this.locationModal = true;
        // this.$emit("showRoadDeviceDetail", e.data.id);
      });
      this.mass.setMap(this.map);
    },
    // 人物头像过滤
    onPersonCheck(data) {
      const personInitList = require('./data.json').personList;
      this.personList = personInitList.filter(item => {
        return data.includes(item.type);
      });
      this.map.clearMap();
      this.getPersonLocation();
    },
    // 地图
    drawMap() {
      this.map = new AMap.Map('aMap', {
        center: this.projectPoint,
        resizeEnable: true,
        zoom: 14,
        expandZoomRange: true,
        zooms: [12, 20],
        // zooms: [16, 20],
        mapStyle: 'amap://styles/whitesmoke'
      });
      this.map.on('zoomchange', () => {
        // northeast:[this.map.getBounds().northeast.lng,this.map.getBounds().northeast.lat],
        // southwest:[this.map.getBounds().southwest.lng,this.map.getBounds().southwest.lat],
        this.boundLngLat = [
          {
            longitude: this.map.getBounds().northeast.lng,
            latitude: this.map.getBounds().northeast.lat
          },
          {
            longitude: this.map.getBounds().southwest.lng,
            latitude: this.map.getBounds().southwest.lat
          }
        ];
        this.getRoadDevice();
      });
      /** 地图移动结束后触发，包括平移，以及中心点变化的缩放。如地图有拖拽缓动效果，则在缓动结束后触发 */
      this.map.on('moveend', () => {
        this.boundLngLat = [
          {
            longitude: this.map.getBounds().northeast.lng,
            latitude: this.map.getBounds().northeast.lat
          },
          {
            longitude: this.map.getBounds().southwest.lng,
            latitude: this.map.getBounds().southwest.lat
          }
        ];
        this.getRoadDevice();
      });

      this.boundLngLat = [
        {
          longitude: this.map.getBounds().northeast.lng,
          latitude: this.map.getBounds().northeast.lat
        },
        {
          longitude: this.map.getBounds().southwest.lng,
          latitude: this.map.getBounds().southwest.lat
        }
      ];

      // 点击地图获取经纬度
      this.map.on('click', e => {
        var value = e.lnglat.getLng() + ',' + e.lnglat.getLat();
        console.log(value);
      });

      this.getPersonLocation();
    }
  },
  mounted() {
    this.getData();

    // 根据浏览器定位
    AMap.plugin(['AMap.Geolocation'], () => {
      const geolocation = new AMap.Geolocation({
        enableHighAccuracy: true, // 是否使用高精度定位，默认:true
        timeout: 5000, // 超过10秒后停止定位，默认：5s
        zoomToAccuracy: true // 定位成功后是否自动调整地图视野到定位点
      });
      // this.map.addControl(geolocation);
      geolocation.getCurrentPosition((status, result) => {
        if (status == 'complete') {
          this.projectPoint = [result.position.lng, result.position.lat];
          this.map.setCenter(this.projectPoint);
        } else {
          this.projectPoint = [120, 30];
        }
      });
    });
    // }
    this.drawMap();
    /** 获取云视角设备类型 */
    // this.readDeviceType();

    // 下拉框点击其他区域收起
    document.addEventListener('click', e => {
      const screenDown = this.$refs.screenDown;
      if (screenDown) {
        if (!screenDown.contains(e.target)) {
          this.showScreen = false;
        }
      }
      const statusDown = this.$refs.statusDown;
      if (statusDown) {
        if (!statusDown.contains(e.target)) {
          this.showStatus = false;
        }
      }
      const toolkitDown = this.$refs.toolkitDown;
      if (toolkitDown) {
        if (!toolkitDown.contains(e.target)) {
          this.showToolkit = false;
        }
      }
    });
  }
};
</script>

<style lang="scss">
#roadScene {
  width: 100%;
  height: calc(100vh - 90px);
  position: relative;
  overflow: hidden;
  #aMap {
    width: 80%;
    height: calc(100vh - 180px);
    margin: 0 auto;
    .amap-maps {
      .person-box {
        position: relative;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 1px solid #009cf2;
        .img-box {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          img {
            position: relative;
            width: 100%;
          }
        }
        .person-direction {
          position: absolute;
          top: -1px;
          left: -1px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          &::before {
            content: '';
            position: absolute;
            top: -6px;
            left: 50%;
            -webkit-transform: translate(-50%, 0);
            transform: translate(-50%, 0);
            border: 0px solid transparent;
            border-width: 0 3px 5px 3px;
            border-bottom-color: #009cf2;
          }
        }
        &.status2 {
          border-color: #ff9500;
          & .person-direction {
            -webkit-transform: rotate(40deg);
            transform: rotate(40deg);
            &::before {
              border-bottom-color: #ff9500;
            }
          }
        }
        &.status3 {
          border-color: #00c853;
          .person-direction::before {
            border-bottom-color: #00c853;
          }
        }
        &.status4 {
          border-color: #1ec2d0;
          .person-direction::before {
            border-bottom-color: #1ec2d0;
          }
        }
      }
    }

    .amap-info-contentContainer {
      width: 39px;
      height: 10px;
      .amap-info-content.amap-info-outer {
        background-color: #666;
        border-radius: 4px;
        padding: 20px 16px;
      }
      .amap-info-content.amap-info-outer > p {
        font-size: 20px;
        color: #fff;
        max-width: 340px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &.p-info {
          font-weight: bold;
          padding-bottom: 10px;
          border-bottom: 1px solid #8f8f8f;
        }
      }
      .amap-info-content.amap-info-outer > a.amap-info-close {
        display: none;
      }
      .amap-info-sharp {
        border-right-color: #666;
      }
    }
    .amap-marker {
      .amap-marker-label {
        top: -32px !important;
        left: 36px !important;
        border: none;
        width: 390px;
        height: 80px;
        background-color: #666;
        border-radius: 4px;
        padding: 14px 20px 16px;
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
          left: -4px;
          width: 10px;
          height: 10px;
          background-color: #666;
          -webkit-transform: rotate(45deg);
          transform: rotate(45deg);
        }
        p {
          font-size: 14px;
          color: #fff;
          max-width: 340px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &.p-info {
            font-weight: bold;
            padding-bottom: 10px;
            border-bottom: 1px solid #8f8f8f;
          }
        }
      }
    }
    .my-scroll-bar {
      /*定义滚动条轨道 内阴影+圆角*/
      /*定义滑块 内阴影+圆角*/
    }
    .my-scroll-bar::-webkit-scrollbar {
      width: 6px !important;
      background-color: #f5f5f5;
    }
    .my-scroll-bar::-webkit-scrollbar-track {
      background-color: #f5f5f5;
    }
    .my-scroll-bar::-webkit-scrollbar-thumb {
      border-radius: 5px !important;
      background-color: #d3d3d3;
    }
  }
  .amap-simple-marker-label {
    color: transparent;
  }
}
</style>
