import Vue from "vue";
import App from "./App.vue";
import VueRouter from 'vue-router'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import homepage from './components/homepage.vue'
import loginPage from './components/loginPage'
import TodoList from './components/TodoList'
import profile from './components/profile'
import ganttChart from './components/ganttchart'
Vue.config.productionTip = false;

Vue.use(VueRouter);
const routes = [
  { path:"/", component: homepage},
  { path: "/login", component: loginPage},
  { path: "/timeline", component: TodoList},
  { path: "/profile", component: profile},
  { path: "/chart", component: ganttChart}
];
Vue.prototype.$globalValue = ""

const router = new VueRouter({
  routes
})

new Vue({
  router,
  "render": (h) => h(App)
}).$mount("#app");
