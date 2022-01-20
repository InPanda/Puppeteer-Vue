// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import message from "./utils/message.js";
import VueRouter from "vue-router";
import routes from "./router/index";

import dataV from '@jiaminghi/data-view';
// 引入全局css
import './assets/scss/style.scss';
// 按需引入vue-awesome图标
import Icon from 'vue-awesome/components/Icon';
import 'vue-awesome/icons/chart-bar.js';
import 'vue-awesome/icons/chart-area.js';
import 'vue-awesome/icons/chart-pie.js';
import 'vue-awesome/icons/chart-line.js';
import 'vue-awesome/icons/align-left.js';

//引入echart
//4.x 引用方式
import echarts from 'echarts'
//5.x 引用方式为按需引用
//希望使用5.x版本的话,需要在package.json中更新版本号,并切换引用方式
//import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
// 全局注册
Vue.component('icon', Icon);
Vue.use(dataV);

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueRouter);
const router = new VueRouter({
  routes
  // mode: 'history'
});

Vue.prototype.$message = message;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  render: h => h(App)
});
