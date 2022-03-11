import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VueClipboard from 'vue-clipboard2';
import http from "./utils/http";
import "../src/assets/css/init.css";
import { Message } from 'element-ui';

Vue.config.productionTip = false;
Vue.use(VueClipboard);
Vue.prototype.$message = Message;
Vue.prototype.$http = http;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
