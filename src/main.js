// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import store from './vuex/store';
import App from './App';
import router from './router';
import VueLazyLoad from 'vue-lazyload';
import YDUI from 'vue-ydui';
import axios from 'axios'

import $ from 'jquery';
import 'lib-flexible/flexible';
import "./assets/css/common/common.css";
import 'vue-ydui/dist/ydui.rem.css';

// 全局数据存储相关
// 导入localStorageTool中的方法

// 基于Vue的组件，需要使用Vue.use(xxx)
Vue.use(YDUI);
Vue.use(router);
Vue.use(VueLazyLoad, {
  preLoad: 1,
  loading: require('../src/assets/image/loading.gif'),
  attempt: 5
});

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

// 不是基于Vue的插件，如果想绑定到Vue上面
Vue.prototype.$axios = axios;
// 设置请求头

function getQueryString (name) { 
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
  var r = window.location.search.substr(1).match(reg); 
  if (r != null) return unescape(r[2]); 
  return null;
}
// http request 拦截器
axios.interceptors.request.use(function (config) {
  //将URL的token信息配置到接口请求中
  config.headers.token = getQueryString("token");
  return config;
}, function (error) {
  return Promise.reject(error);
});

// axios.defaults.headers.token = uri.match(/token=(\S*)/)[1];
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//axios.defaults.baseURL = "http://fz.gate.szqqkj.cn/api/shop";  //正式外网接口
//axios.defaults.baseURL = "http://test.gate.szqqkj.cn/api/shop"; //测试服务器接口
axios.defaults.baseURL = "http://192.168.11.127:2222/api/shop/";  //某人本地接口
// axios.defaults.headers.token = GetQueryString("token");

// 在跨域的时候，允许访问服务器带上cookies
// axios.defaults.withCredentials = true

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

