import Vue from "vue";
import Router from "vue-router";
import homepage from './components/homepage.vue'
import loginPage from './components/loginPage'
import TodoList from './components/TodoList'
import profile from './components/profile'
import ganttChart from './components/ganttchart'

Vue.use(Router);

const routes = [
  { path:"/", component: homepage},
  { path: "/login", component: loginPage},
  { path: "/timeline", component: TodoList},
  { path: "/profile", component: profile},
  { path: "/chart", component: ganttChart}
];

export default new Router({
    routes
  })