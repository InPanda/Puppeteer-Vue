// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import message from "./utils/message.js";

Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.prototype.$message = message;
/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App)
});
