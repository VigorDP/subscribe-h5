import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./assets/common.scss";
import Alert from "vue-alert-component";
Vue.use(Alert);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
