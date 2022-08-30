<template>
  <div class="order-view-fix-look order-content-account order-content-look" v-if="typeInfoFix == 3">
    <div class="order-header">
      <h1>查看故障</h1>
      <div class="btn-box">
        <el-button type="primary" @click="backList" class="btnc text-center back">返回</el-button>
      </div>
    </div>

    <div class="order-detail">
      <div class="order-map">
        <div class="map-equipment" id="aMap"></div>
        <div class="hover-mes" id="map-img">
          <swiper
            v-if="faultDetailData.attachmentList"
            class="swiper swiper-map"
            style="width:640px;height:110px;"
            :options="swiperOption"
          >
            <swiper-slide
              ref="myswiper"
              @click-slide="handleClickSlide"
              v-for="(img, id) in faultDetailData.attachmentList"
              :key="id"
            >
              <div
                @click="swiperTo(img, id)"
                class="output"
                v-if="img.attachmentType != 'IMAGE'"
                style="width: 110px; height: 110px; display:inline-block;cursor: pointer;"
              >
                <img src="../../../../../assets/button/video-icon.png" class="video-icon" alt="" />
                <video
                  class="video"
                  controls="controls"
                  style="width: 110px; height: 110px; display:inline-block;"
                  v-show="false"
                >
                  <source :src="img.attachmentUrl" type="video/mp4" />
                </video>
              </div>
              <img
                :preview="9588"
                @click="swiperTo(img, id)"
                v-if="img.attachmentType == 'IMAGE'"
                :src="img.attachmentUrl"
                style="width: 110px; height: 110px; display:inline-block;cursor: pointer;"
              />
            </swiper-slide>
            <div class="swiper-button-next nav-right" slot="button-next">
              <span>
                <img src="../../../../../assets/button/btn-next.png" />
              </span>
            </div>
          </swiper>
          <div class="errordes">
            <h5>故障描述</h5>
            <p>{{ faultDetailData.faultDesc }}</p>
          </div>
          <div class="equipType">
            <h3>
              {{ faultDetailData.deviceTypeName }}
              <span class="level" v-if="faultDetailData.priorityLevel == 'COMMON'">优先级：普通</span>
              <span class="level" v-if="faultDetailData.priorityLevel == 'URGENT'">优先级：紧急</span>
              <span class="level" v-if="faultDetailData.priorityLevel == 'UNUSUALLY_URGENT'">优先级：特级</span>
              <span class="type">设备故障类型:{{ faultDetailData.faultTypeName }}</span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AMap from 'AMap';

import { faultDetail } from '@/api/order';
let vm = null;
export default {
  name: 'opa-project',
  watch: {
    typeInfoFix() {
      if (this.typeInfoFix == 3) {
        this.$nextTick(function() {
          // this.proEquipment();
          // this.drawMap(this.equipmentData[0]);
          this.video();
          const orderId = this.$route.query.id;
          this.faultDetail(orderId);
        });
      }
    }
  },
  props: ['typeInfoFix', 'fixsort'],
  computed: {},
  data() {
    return {
      map: null, // 地图
      projectPoint: [120, 30], // 项目位置
      faultDetailData: {},
      swiperOption: {
        slidesPerView: 5,
        slidesPerGroup: 5,
        loopFillGroupWithBlank: true,
        pagination: {
          clickable: true
        },
        on: {
          tap() {
            const { realIndex } = this;
            vm.handleClickSlide(realIndex);
          }
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      }
    };
  },
  methods: {
    faultDetail(id) {
      const ordRes = faultDetail(id);
      return Promise.all([ordRes]).then(res => {
        const respon = res[0];
        const { code, object } = respon;
        if (code === 200 && object) {
          this.faultDetailData = object;
          this.drawMap(object);
        }
      });
    },

    getImgAudioList(list) {
      console.log(list);
    },
    handleClickSlide(index, reallyIndex) {
      console.log('Click slide!', index, reallyIndex);
    },
    backList() {
      this.$router.go(-1);
    },
    swiperTo(item, index) {
      console.log(index, item);
      this.hideImg = true;
    },
    drawMap(item) {
      // 地图绘制
      const faultTypeIcon = require('../../../../../assets/button/smock.png');
      var markerContent =
        '' +
        '<div class="custom-content-marker">' +
        ' <div class="jumper"><div></div><div></div><div></div></div><img  src=' +
        faultTypeIcon +
        '>' +
        '</div>';
      this.map = new AMap.Map('aMap', {
        center: [item.longitude, item.latitude],
        resizeEnable: true,
        zoom: 14,
        expandZoomRange: true,
        zooms: [12, 20],
        mapStyle: 'amap://styles/whitesmoke' // 设置地图的显示样式
      });
      var marker = new AMap.Marker({
        position: [item.longitude, item.latitude],
        // 将 html 传给 content
        content: markerContent,
        // 以 icon 的 [center bottom] 为原点
        offset: new AMap.Pixel(-13, -30)
      });

      // 将 markers 添加到地图
      this.map.add(marker);
      this.map.panBy(0, 200);
    },
    video(id) {
      this.$nextTick(() => {
        // var mapImg = document.getElementById('map-img');
        // var leftSwiper = document.getElementById('left-swiper');
        var output = document.getElementsByClassName('output');
        var video = document.getElementsByClassName('video');

        for (let i = 0; i < video.length; i++) {
          video[i].addEventListener('loadeddata', function(e) {
            console.log(video);
            var canvas = document.createElement('canvas'); // 创建一个画布
            canvas.width = 110;
            canvas.height = 110;
            canvas.getContext('2d').drawImage(video[i], 0, 0, canvas.width, canvas.height); // getContext:设置画布环境；drawImage:画画

            var img = document.createElement('img');
            img.src = canvas.toDataURL('image/jpeg'); // 获取图片的url
            output[i].appendChild(img);
          });
        }
      });
    }
  },
  created() {
    vm = this;
  },
  mounted() {
    if (this.typeInfoFix == 3) {
      // this.proEquipment();
      // this.drawMap(this.equipmentData[0]);
    }
    this.$nextTick(function() {
      this.video();
    });
  },
  updated: function() {}
};
</script>

<style lang="scss">
.order-content-look {
  position: absolute;
  bottom: 0;
  top: 0;
  right: 0;
  left: 0;
}

.resizeNone {
  .el-textarea__inner {
    resize: none;
  }
}

.el-dialog__body {
  padding: 30px 26px 40px 26px;
}

// .el-tooltip__popper {
//   border: none !important;
//   width: 148px;
//   height: 110px;
//   background: #ffffff;
//   box-shadow: 0px 0px 20px -3px rgba(16, 25, 74, 0.18);
//   border-radius: 6px;

//   .popper__arrow {
//     display: none;
//   }
// }

.order-view-fix-look {
  overflow: hidden;

  .order-header {
    width: 100%;
    height: 100px;
    border-bottom: 1px solid rgba(229, 233, 243, 0.49);
    position: relative;

    h1 {
      font-size: 20px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #0f1736;
      padding: 30px 0 0 30px;
    }

    .btn-box {
      position: absolute;
      right: 30px;
      top: 30px;

      .btnc {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        width: 100px;
        height: 42px;
        border: none;
        border-radius: 24px;
        box-shadow: 0px 10px 20px -4px rgba(16, 25, 74, 0.18);
      }

      .back {
        color: #c6cada;
        border: 1px solid rgba(210, 218, 234, 0.59);
        background: #ffffff;
      }
    }
  }

  .order-detail {
    display: flex;
    height: calc(100% - 101px);

    .order-map {
      flex: 1;
      position: relative;

      .hover-mes {
        width: 682px;
        position: absolute;
        left: 50%;
        bottom: 195px;
        margin-left: -341px;
        background: #ffffff;
        box-shadow: 0px 10px 20px -4px rgba(23, 20, 69, 0.18);
        border-radius: 21px;
        /* overflow: hidden; */
        padding: 0 10px;
        &:after {
          position: absolute;
          left: 50%;
          bottom: -30px;
          content: '';
          width: 0;
          height: 0;
          border-left: 30px solid transparent;
          border-right: 30px solid transparent;
          border-top: 30px solid #ffffff;
          margin-left: -30px;
        }
        .swiper-map {
          margin-top: 20px;

          .output {
            position: relative;

            .video-icon {
              position: absolute;
              width: 34px;
              height: 34px;
              left: 0;
              top: 0;
              right: 0;
              bottom: 0;
              margin: auto;
            }
          }
        }

        .nav-right {
          position: absolute;
          right: 0px;
          top: 22px;
          width: 42px;
          height: 110px;
          background: #ffffff;

          span {
            width: 20px;
            height: 110px;
            background: #ffffff;
            box-shadow: 0px 2px 6px 0px rgba(48, 69, 177, 0.15);
            border-radius: 4px;
            margin-left: 20px;
            display: inline-block;

            img {
              margin-top: 42px;
              margin-left: 3px;
            }
          }
        }

        .nav-left {
          position: absolute;
          left: 0px;
          top: 0;
          z-index: 88;
          width: 42px;
          height: 100px;
          background: linear-gradient(90deg, #f6f8fc 0%, #f6f8fc 100%);

          span {
            width: 20px;
            height: 100px;
            background: #ffffff;
            box-shadow: 0px 2px 6px 0px rgba(48, 69, 177, 0.15);
            border-radius: 4px; // margin-left: 20px;
            display: inline-block;

            img {
              margin-top: 42px;
              margin-left: 3px;
            }
          }
        }

        .errordes {
          padding: 10px 20px;

          h5 {
            font-size: 14px;
            font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
            font-weight: 500;
            color: #aeb4c6;
            padding-bottom: 10px;
          }

          p {
            font-size: 16px;
            font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
            font-weight: 400;
            color: #0f1736;
            line-height: 21px;
          }
        }

        .equipType {
          border-top: 1px solid rgba(229, 233, 243, 0.49);
          height: 64px;
          line-height: 65px;

          h3 {
            padding: 0 20px;
            font-size: 18px;
            font-family: 'SourceHanSansCN-Bold, SourceHanSansCN';
            font-weight: bold;
            color: #0f1736;

            .type {
              float: right;
              margin-right: 20px;
            }

            .level {
              height: 24px;
              background: rgba(255, 72, 7, 0.1);
              border-radius: 12px;
              font-size: 12px;
              font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
              font-weight: 400;
              color: #ff4807;
              padding: 5px 20px;
              float: right;
              line-height: 24px;
              margin-top: 15px;
            }
          }
        }

        .mapBox {
          height: 100px;
          overflow: hidden;
          position: relative;
          margin-top: 20px;

          .demo-image__preview-map {
            position: relative;
          }
        }
      }
    }
  }
}

#aMap {
  width: 100%;
  height: 100%;
}
.custom-content-marker {
  position: relative;
  width: 25px;
  height: 34px;
  img {
    width: 48px;
    height: 48px;
    position: relative;
    z-index: 2;
  }
}

.swiper-button-next {
  &:after {
    content: '';
  }
}

.dialog-end-order {
  .fixPre {
    .demonstration {
      height: 14px;
      font-size: 14px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: #747aa5;
      padding: 0 0 20px 0;
      display: flex;

      img {
        margin-left: 4px;
      }
    }
  }
}

.jumper {
  display: block;
  position: absolute;
  left: -22px;
  top: 12px;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 90px;
  height: 90px;
}
.jumper > div {
  background-color: #dc1d1d;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  margin: 2px;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  position: absolute;
  left: 0px;
  top: 0px;
  opacity: 0;
  margin: 0;
  width: 90px;
  height: 90px;
  -webkit-animation: jumper 2s 0s linear infinite;
  animation: jumper 2s 0s linear infinite;
}
.jumper > div:nth-child(2) {
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}
.jumper > div:nth-child(3) {
  -webkit-animation-delay: 1.2s;
  animation-delay: 1.2s;
}
@-webkit-keyframes jumper {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    opacity: 0;
  }
  5% {
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    opacity: 0;
  }
}
</style>
