<template>
  <div class="modules">
    <NavHeader></NavHeader>
    <div class="modules-placeholder"></div>
    <div class="modules-main-wrapper">
      <div class="modules-top modules-links text-center float-container">
        <router-link class="modules-inner modules-pole" to="/pole">
          <div class="modules-icon pole"></div>
          <div class="modules-title">综合杆管理</div>
          <div class="modules-subtitle">Comprehensive management</div>
          <div class="enter"></div>
        </router-link>
        <router-link class="modules-inner modules-vehicle" to="/vehicle">
          <div class="modules-icon vehicle"></div>
          <div class="modules-title">智慧交通</div>
          <div class="modules-subtitle">Intelligent transportation</div>
          <div class="enter"></div>
        </router-link>
        <router-link class="modules-inner modules-municipal" to="/municipal">
          <div class="modules-icon municipal"></div>
          <div class="modules-title">智慧市政</div>
          <div class="modules-subtitle">Smart municipal</div>
          <div class="enter"></div>
        </router-link>
        <router-link class="modules-inner modules-pipe" to="/pipe">
          <div class="modules-icon pipe"></div>
          <div class="modules-title">智慧管网</div>
          <div class="modules-subtitle">Smart pipe network</div>
          <div class="enter"></div>
        </router-link>
      </div>
      <!--<div
        class="modules-main"
        :class="{ active }"
        @mouseout="reset($event)"
        @mouseover="showAni($event)"
        @click="showAni($event)"
      >
        <img src="./img/modules-bg.png" alt="" />
        <div class="modules-main-title">综合杆管理</div>
        <div class="modules-main-subtitle">Comprehensive management</div>
        <div class="modules-main-enter text-center float-container">
          <div class="enter-text float-left">进入</div>
          <div class="enter-img float-left" v-show="active">
            <img src="./img/modules-icon-right.png" alt="" />
            <img src="./img/modules-icon-right.png" alt="" />
            <img src="./img/modules-icon-right.png" alt="" />
          </div>
        </div>
      </div>-->
    </div>
    <div class="modules-links text-center float-container">
      <router-link class="modules-inner" to="/shadow">
        <div class="modules-icon shadow"></div>
        <div class="modules-title">智慧光影</div>
        <div class="modules-subtitle">Wisdom light and shadow</div>
        <div class="enter"></div>
      </router-link>
      <router-link class="modules-inner" to="/safety">
        <div class="modules-icon safety"></div>
        <div class="modules-title">综合安防</div>
        <div class="modules-subtitle">Comprehensive security</div>
        <div class="enter"></div>
      </router-link>
      <router-link class="modules-inner" to="/operation">
        <div class="modules-icon operation"></div>
        <div class="modules-title">运营服务</div>
        <div class="modules-subtitle">Operational services</div>
        <div class="enter"></div>
      </router-link>
      <router-link class="modules-inner" to="/operater">
        <div class="modules-icon maintain"></div>
        <div class="modules-title">智慧运维</div>
        <div class="modules-subtitle">operation and maintenance</div>
        <div class="enter"></div>
      </router-link>
      <router-link class="modules-inner" to="/data">
        <div class="modules-icon data"></div>
        <div class="modules-title">数据中心</div>
        <div class="modules-subtitle">Data center</div>
        <div class="enter"></div>
      </router-link>
      <router-link class="modules-inner" to="/resource">
        <div class="modules-icon resource"></div>
        <div class="modules-title">资源中心</div>
        <div class="modules-subtitle">Resource Center</div>
        <div class="enter"></div>
      </router-link>
      <router-link class="modules-inner" to="/system">
        <div class="modules-icon system"></div>
        <div class="modules-title">系统设置</div>
        <div class="modules-subtitle">System Setting</div>
        <div class="enter"></div>
      </router-link>
      <router-link class="modules-inner" to="/screen">
        <div class="modules-icon screen"></div>
        <div class="modules-title">大屏展示</div>
        <div class="modules-subtitle">Large screen display</div>
        <div class="enter"></div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { removeNavs } from '@/utils/remove';
import NavHeader from '@/components/layout/NavHeader.vue';

export default {
  name: 'modules',
  components: {
    NavHeader
  },
  data() {
    return {
      active: false
    };
  },
  created() {
    removeNavs();
    // GT20201103-128
    this.$store.dispatch('refreshUserInfo');
  },
  mounted() {
    this.initModuleEvent();
  },
  methods: {
    initModuleEvent() {
      document.addEventListener(
        'click',
        () => {
          this.active = false;
        },
        false
      );
    },
    reset(event) {
      this.active = false;
      document.all ? (event.cancelBubble = true) : event.stopPropagation();
    },
    showAni(event) {
      this.active = !this.active;
      document.all ? (event.cancelBubble = true) : event.stopPropagation();
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.ani-opacity {
  animation: 0.5s opacity2 0s ease-in-out;
  -webkit-animation: 0.5s opacity2 0s ease-in-out;
  -moz-animation: 0.5s opacity2 0s ease-in-out;
}
@keyframes opacity2 {
  0% {
    opacity: 0;
    bottom: -40px;
  }
  100% {
    opacity: 1;
    bottom: -20px;
  }
}
@-webkit-keyframes opacity2 {
  0% {
    opacity: 0;
    bottom: -40px;
  }
  100% {
    opacity: 1;
    bottom: -20px;
  }
}
@-moz-keyframes opacity2 {
  0% {
    opacity: 0;
    bottom: -40px;
  }
  100% {
    opacity: 1;
    bottom: -20px;
  }
}

.modules {
  background-color: $--bg-main;
  height: 100vh;
  min-width: 1580px;
  min-height: 1080px;
  overflow: hidden;
  &-placeholder {
    height: 47px;
  }
  &-main-wrapper {
    padding-top: 210px;
    height: 250px;
  }
  .modules-top {
    width: 1580px;
    .modules-inner {
      width: 380px;
    }
    .modules-inner + .modules-inner {
      margin-left: 20px;
    }
  }
  &-main {
    width: 1580px;
    height: 513px;
    margin: 0 auto;
    position: relative;
    -webkit-transition: all 0.3s;
    -moz-transition: all 0.3s;
    -o-transition: all 0.3s;
    transition: all 0.3s;
    &-title {
      position: absolute;
      top: 247px;
      left: 161px;
      height: 36px;
      font-size: 36px;
      font-family: 'SourceHanSansCN-Bold, SourceHanSansCN';
      font-weight: bold;
      color: $--color-light;
      line-height: 54px;
      margin-bottom: 20px;
    }
    &-subtitle {
      position: absolute;
      top: 303px;
      left: 161px;
      height: 16px;
      font-size: 16px;
      font-family: 'SourceHanSansCN-Regular, SourceHanSansCN';
      font-weight: 400;
      color: rgba(174, 180, 198, 1);
      line-height: 24px;
    }
    &-enter {
      position: absolute;
      top: 369px;
      left: 161px;
      width: 180px;
      height: 50px;
      line-height: 50px;
      background: $--bg-light;
      border-radius: 25px;
      font-size: 18px;
      font-family: 'SourceHanSansCN-Bold, SourceHanSansCN';
      font-weight: bold;
      color: $-primary-color;
      .enter-text {
        padding-left: 72px;
      }
      .enter-img {
        margin-left: 12px;
        img {
          width: 7px;
          height: 14px;
          margin-right: 1px;
        }
      }
    }
  }
  &-main.active {
    -webkit-transform: scale(1.1);
    -moz-transform: scale(1.1);
    -ms-transform: scale(1.1);
    -o-transform: scale(1.1);
    transform: scale(1.1);
  }
  &-links {
    width: 1580px;
    margin: 0 auto;
  }
  &-inner {
    float: left;
    width: 180px;
    height: 210px;
    background: $--bg-light;
    border-radius: 14px;
    text-decoration: none;
    position: relative;
    .enter {
      display: none;
      width: 150px;
      height: 58px;
      position: absolute;
      bottom: -40px;
      left: 50%;
      background: url(./img/enter.png) center no-repeat;
      -webkit-background-size: 150px 58px;
      background-size: 150px 58px;
      -webkit-transition: all 0.3s;
      -moz-transition: all 0.3s;
      -o-transition: all 0.3s;
      transition: all 0.3s;
      -webkit-transform: translateX(-50%);
      -moz-transform: translateX(-50%);
      -ms-transform: translateX(-50%);
      -o-transform: translateX(-50%);
      transform: translateX(-50%);
      @extend .ani-opacity;
    }
    &:hover {
      .enter {
        display: block;
        bottom: -20px;
      }
    }
  }
  &-inner + &-inner {
    margin-left: 20px;
  }
  &-icon {
    height: 136px;
    -webkit-background-size: 52px;
    background-size: 52px;
    background-repeat: no-repeat;
    background-position: center;
  }
  &-title {
    font-size: 18px;
    font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
    font-weight: 500;
    color: $--color-dark;
    line-height: 27px;
    margin-bottom: 13px;
  }
  &-subtitle {
    font-size: 12px;
    font-family: HelveticaNeueLT-Condensed, HelveticaNeueLT;
    font-weight: normal;
    color: rgba(195, 193, 208, 1);
    line-height: 14px;
    letter-spacing: -1px;
  }
  .shadow {
    background-image: url(./img/shadow.png);
  }
  .safety {
    background-image: url(./img/safety.png);
  }
  .operation {
    background-image: url(./img/operation.png);
  }
  .maintain {
    background-image: url(./img/maintain.png);
  }
  .data {
    background-image: url(./img/data.png);
  }
  .resource {
    background-image: url(./img/resource.png);
  }
  .screen {
    background-image: url(./img/screen.png);
  }
  .system {
    background-image: url(img/system.png);
  }
  .pole {
    background-image: url(img/pole.png);
  }
  .vehicle {
    background-image: url(img/vehicle.png);
  }
  .municipal {
    background-image: url(img/municipal.png);
  }
  .pipe {
    background-image: url(img/pipe.png);
  }
  .modules-pole {
    background: url(img/bg-pole.png) 0 0 no-repeat;
    -webkit-background-size: 380px 230px;
    background-size: 380px 230px;
  }
  .modules-vehicle {
    background: url(img/bg-vehicle.png) 0 0 no-repeat;
    -webkit-background-size: 380px 230px;
    background-size: 380px 230px;
  }
  .modules-municipal {
    background: url(img/bg-municipal.png) 0 0 no-repeat;
    -webkit-background-size: 380px 230px;
    background-size: 380px 230px;
  }
  .modules-pipe {
    background: url(img/bg-pipe.png) 0 0 no-repeat;
    -webkit-background-size: 380px 230px;
    background-size: 380px 230px;
  }
}
</style>
