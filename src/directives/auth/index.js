import Vue from 'vue';
import Auth from './authority';

const install = Vue => {
  Vue.directive('auth', Auth);
};

if (window.Vue) {
  window.Auth = Auth;
  Vue.use(install);
}

Auth.install = install;
export default Auth;
