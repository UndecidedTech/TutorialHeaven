import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import store from "./store/index";

// axios.defaults.withCredentials = true
Vue.config.productionTip = false;
Vue.prototype.$globalValue = ""

new Vue({
  router,
  store,
  "render": (h) => h(App)
}).$mount("#app");
