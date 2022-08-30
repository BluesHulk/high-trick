<template>
  <div class="page-layout float-container">
    <div class="float-left page-sidebar scrollbar scrollbar-y scrollbar-light">
      <div class="side-logo"></div>
      <Sidebar></Sidebar>
    </div>
    <div class="page-main">
      <NavHeader></NavHeader>
      <SubNavs v-if="subRoutes.length"></SubNavs>
      <router-view class="page-views"></router-view>
    </div>
  </div>
</template>

<script>
import Sidebar from '@/components/layout/Sidebar.vue';
import NavHeader from '@/components/layout/NavHeader.vue';
import SubNavs from '@/components/layout/SubNavs.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'layout',
  components: {
    Sidebar,
    NavHeader,
    SubNavs
  },
  computed: {
    ...mapGetters(['subRoutes'])
  },
  data() {
    return {
      routerConfig: [],
      loading: null
    };
  },
  created() {
    // GT20201103-128
    this.$store.dispatch('refreshUserInfo');
  }
};
</script>

<style lang="scss">
@import '@/styles/ui-theme';
.page-layout {
  min-width: 1412px;
  overflow: hidden;
  height: 100vh;
}
.page-sidebar {
  background-color: #fff;
  box-shadow: 0 10px 20px -4px rgba(16, 25, 74, 0.18);
  width: 100px;
  height: 100vh;
  position: relative;
  z-index: 1;
  .side-logo {
    padding-top: 29px;
    width: 34px;
    height: 33px;
    margin: 0 auto 18px;
    background: url(img/side-logo.png) center 29px no-repeat;
  }
}
.page-main {
  width: calc(100% - 100px);
  height: calc(100vh - 24px);
  margin-left: 100px;
  padding-bottom: 24px;
  background: $--bg-main;
  .page-sidebar {
  }
  .router-bar {
    margin-bottom: 8px;
  }
  .page-views {
    margin-left: 20px;
    margin-right: 20px;
    //background-color: $--bg-light;
    -webkit-border-radius: 8px;
    -moz-border-radius: 8px;
    border-radius: 8px;
    min-height: calc(100vh - 166px);
    //padding: 24px;
  }
  .page-sidebar,
  .page-views {
  }
  .page-face {
    background-color: $--bg-separator;
    padding: 4px;
    min-height: calc(100% - 125px);
  }
  .page-urgent {
    background-color: #ddd;
    padding: 0;
    min-height: calc(100% - 125px);
  }
}
</style>
