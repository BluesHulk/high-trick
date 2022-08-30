import 'babel-polyfill';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import Auth from './directives/auth';
import permission from './directives/permission';
import ElementUI from 'element-ui';
import './styles/el-theme.scss';
import 'font-awesome/css/font-awesome.css';
import ATree from '@silen/level-tree';
import '@silen/level-tree/lib/theme-chalk/index.css';

import infiniteScroll from 'vue-infinite-scroll';

import 'normalize.css/normalize.css';
import './styles/reset.scss';
import './styles/common.scss';

import './prototype';
import './router/guard';
import VueAwesomeSwiper from 'vue-awesome-swiper';
import preview from 'vue-photo-preview';
import moment from 'moment'; // 时间
import 'vue-photo-preview/dist/skin.css';
import 'viewerjs/dist/viewer.css';

// import style (>= Swiper 6.x)
import 'swiper/swiper-bundle.css';

// import style (<= Swiper 5.x)
// import 'swiper/css/swiper.css'

import elTableInfiniteScroll from 'el-table-infinite-scroll';
import VTooltip from 'v-tooltip';

Vue.use(VTooltip);
Vue.use(elTableInfiniteScroll);

Vue.use(VueAwesomeSwiper /* { default options with global component } */);
Vue.config.productionTip = false;
// 定义时间格式全局过滤器
Vue.filter('dateFormat', function(daraStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
  return moment(daraStr).format(pattern);
});
//  <h5>{{ orderDetailData.createTime | dateFormat('YYYY-MM-DD HH:mm:ss')}}</h5>
Vue.use(ElementUI);
Vue.use(ATree);
Vue.use(Auth);
Vue.use(permission);
// Vue.use(Viewer)
Vue.use(preview);
Vue.prototype.moment = moment;
Vue.use(infiniteScroll);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
