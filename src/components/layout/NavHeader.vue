<template>
  <GlobalActionWrapper class="top-header float-container">
    <router-link to="/modules" class="float-left top-logo">
      <img src="../../assets/layout/top-logo.png" alt="" />
    </router-link>
    <!--<div class="top-nav-list float-container" @click="select">-->
    <div v-show="$route.path !== '/modules'" class="top-nav-list float-container">
      <router-link
        :to="item.path"
        :id="item.id"
        v-for="(item, index) in topRoutes"
        :key="index"
        class="top-nav-list-item float-left"
      >
        {{ item.name }}
      </router-link>
    </div>
    <div class="float-right top-toolbar">
      <div class="badge-container">
        <el-badge
          :value="count"
          class="badge-item"
          :class="{ active: /^\/message/.test($route.path) }"
          @click.native="to('/message/center')"
        >
          <div class="nav-item-wrapper">
            <div class="nav-item-inner">
              <img src="../../assets/layout/nav-envelop@2.png" alt="" style="width: 24px; height: 24px;" />
            </div>
          </div>
        </el-badge>
        <!-- 和左侧菜单的系统设置是一样的功能 -->
        <!--<el-badge class="badge-item" :class="{ active: /^\/system/.test($route.path) }" @click.native="toSystem">
          <div class="nav-item-wrapper">
            <div class="nav-item-inner">
              <img src="../../assets/layout/setting.png" alt="" />
            </div>
          </div>
        </el-badge>-->
        <el-badge class="badge-item" @click.native="logout">
          <img src="../../assets/layout/close@2.png" alt="" />
        </el-badge>
        <el-badge style="margin-right: 20px;">
          <el-tooltip class="item" effect="dark" :content="decodeURIComponent(user_info.name)" placement="bottom">
            <div class="username-wrapper show-dot">
              <span class="username">{{ decodeURIComponent(user_info.name) }}</span>
            </div>
          </el-tooltip>
        </el-badge>
        <el-badge>
          <div
            @click="to('/personal/info')"
            class="user-icon"
            :style="{
              background: `url(${user_info.headPortraitUrl || defaultsHeadPortraitUrl}) center/cover no-repeat`
            }"
          ></div>
        </el-badge>
      </div>
    </div>
  </GlobalActionWrapper>
</template>

<script>
// import { getToken } from '@/storage/auth';
import { mapGetters } from 'vuex';
import { removeTopNav, setSubNav } from '@/storage/nav';
import GlobalActionWrapper from '@/components/action/GlobalActionWrapper.vue';
import StaticRouteMap from '@/constants/StaticRouteMap';
// import { staffQueryById } from '@/api/rbac';

export default {
  name: 'nav-header',
  components: {
    GlobalActionWrapper
  },
  data() {
    return {
      // topNav: [],
      // current: getTopNav(),
      // user_info: {},
      count: 0,
      title: ''
    };
  },
  computed: {
    ...mapGetters(['topRoutes', 'user_info', 'WsMessage', 'messageCount', 'defaultsHeadPortraitUrl'])
  },
  watch: {
    WsMessage(data) {
      this.listenMessage(data);
    },
    messageCount() {
      this.count = this.messageCount;
    }
  },
  created() {
    this.initWs();
    this.setCount();
    // this.$router.afterEach(() => {
    //   this.setCount();
    // });
    this.refreshRoutes();
    // this.$store.dispatch('refreshUserInfo');
    // this.getUserInfo();
  },
  methods: {
    setCount() {
      this.$store.dispatch('RefreshMessageCount').then(res => {
        this.count = res;
      });
    },
    initWs() {
      const data = {
        host: null,
        port: null
      };
      this.$store.dispatch('initWsMessage', data);
    },
    // common
    // select(event) {
    //   const { target } = event;
    //   const id = target.id;
    //   const els = document.querySelectorAll('.top-nav-list-item');
    //   Array.prototype.forEach.call(els, el => {
    //     el.classList.remove('selected');
    //   });
    //   const tag = document.getElementById(id);
    //   if (tag) {
    //     tag.classList.add('selected');
    //     setTopNav(id);
    //     this.$store.dispatch('SetSubRoutes');
    //   }
    // },
    listenMessage(msg) {
      console.log(msg.unreadCount, 129);
      this.count = msg.unreadCount;
    },
    to(path) {
      if (this.$route.path === path) return;
      this.$store.dispatch('RefreshTopRoutes', {
        type: 'TOP_ROUTES',
        routes: [
          // {
          //   hidden: true,
          //   path: '/personal/info',
          //   id: 1007,
          //   name: 'personal',
          //   parentId: null,
          //   module: 'personal'
          // }
        ]
      });
      const routes = StaticRouteMap[path];
      this.$store.dispatch('RefreshTopRoutes', {
        type: 'SUB_ROUTES',
        routes
      });
      setSubNav(routes[0].id);
      this.$store.dispatch('SetSubId', routes[0].id);
      this.$router.push(path, null, null);
    },
    refreshRoutes() {
      const list = ['/personal/info', '/message/center'];
      if (list.includes(this.$route.path)) {
        removeTopNav();
        this.$store.dispatch('RefreshTopRoutes', {
          type: 'SUB_ROUTES',
          routes: [...StaticRouteMap[this.$route.path]]
        });
      }
    },
    // toSystem() {
    //   if (this.$route.path !== '/system/basic/org') {
    //     this.$router.push('/system/basic/org', null, null);
    //   }
    // },
    // toCenter() {
    //   if (this.$route.path !== '/personal/info') return;
    //   this.$store.dispatch('RefreshTopRoutes', {
    //     type: 'TOP_ROUTES',
    //     routes: [
    //       // {
    //       //   hidden: true,
    //       //   path: '/personal/info',
    //       //   id: 1007,
    //       //   name: 'personal',
    //       //   parentId: null,
    //       //   module: 'personal'
    //       // }
    //     ]
    //   });
    //   const routes = StaticRouteMap['/personal/info'];
    //   this.$store.dispatch('RefreshTopRoutes', {
    //     type: 'SUB_ROUTES',
    //     routes
    //   });
    //   setSubNav(routes[0].id);
    //   this.$store.dispatch('SetSubId', routes[0].id);
    //   this.$router.push('/personal/info', null, null);
    // },
    // getUserInfo() {
    //   const data = getToken();
    //   if (!data) return;
    //   const Authorization = data.Authorization;
    //   if (!Authorization) return;
    //   const info = data[Authorization];
    //   if (!info) return;
    //   const { user_info } = info;
    //   if (!user_info) return;
    //   staffQueryById(user_info.staffId).then(res => {
    //     const { code, object } = res;
    //     if (code === 200) {
    //       this.user_info = object || {};
    //     }
    //   });
    // },
    // unreadCount() {
    //   unreadCount().then(res => {
    //     const { code, object } = res;
    //     if (code === 200) {
    //       this.count = object;
    //     }
    //   });
    // },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        this.$router.push('/login', null, null);
      });
    }
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.top-header {
  position: relative;
  height: 80px;
  padding: 0 20px;
  background: $--color-light;
  .top-logo {
    height: 80px;
    line-height: 90px;
    width: 223px;
    img {
      width: 223px;
      height: 29px;
    }
  }
  .top-toolbar {
    height: 80px;
    //line-height: 90px;
    .badge-container {
      position: relative;
      top: 50%;
      -webkit-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      transform: translateY(-50%);
      .badge-item {
        cursor: pointer;
        margin-right: 40px;
        width: 24px;
        height: 24px;
      }
    }
    .username {
      //width: 84px;
      font-size: 14px;
      font-family: PingFang-SC-Heavy, PingFang-SC;
      font-weight: 800;
      color: $--color-username;
      line-height: 20px;
    }
    .username-wrapper {
      max-width: 84px;
    }
    .user-icon {
      cursor: pointer;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      width: 50px;
      height: 50px;
      box-shadow: 0 4px 8px -4px rgba(16, 13, 66, 0.6);
      border: 1px solid $--color-light;
      //background: url(../../assets/layout/safety-hover.png) center no-repeat;
    }
  }
  .top-nav-list {
    height: 80px;
    line-height: 80px;
    position: absolute;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    &-item {
      cursor: pointer;
      margin-left: 47px;
      height: 77px;
      padding: 0 17px 0 16px;
      border-bottom: 3px solid transparent;
      font-size: 18px;
      font-family: 'SourceHanSansCN-Medium, SourceHanSansCN';
      font-weight: 500;
      color: $--color-username;
      text-decoration: none;
    }
    &-item:first-child {
      margin-left: 0;
    }
    .router-link-exact-active,
    .router-link-active,
    .selected {
      border-color: $-primary-color;
      color: $-primary-color;
    }
  }
  .nav-item-wrapper {
    width: 66px;
    height: 66px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    -webkit-transform: translate(-50%, -50%);
    -moz-transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
    -o-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    display: inline-block;
    .nav-item-inner {
      width: 46px;
      height: 46px;
      -webkit-border-radius: 50%;
      -moz-border-radius: 50%;
      border-radius: 50%;
      position: absolute;
      left: 50%;
      top: 50%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      text-align: center;
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        -webkit-transform: translate(-50%, -50%);
        -moz-transform: translate(-50%, -50%);
        -ms-transform: translate(-50%, -50%);
        -o-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        text-align: center;
      }
    }
  }
  .badge-item {
    &.active {
      .nav-item-wrapper {
        background-color: $--bg-line-selected;

        .nav-item-inner {
          background-color: rgba(29, 66, 234, 0.08);
        }
      }
    }
    img {
      width: 24px;
      height: 24px;
    }
  }
  .el-badge__content.is-fixed {
    top: 5px;
  }
}
</style>
