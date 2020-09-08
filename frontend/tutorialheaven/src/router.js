import Vue from "vue";
import Router from "vue-router";
import homePage from './components/homePage.vue';
import loginPage from './components/loginPage';
import TodoList from './components/TodoList';
import profile from './components/profile';
import ganttChart from './components/ganttchart';
import signUp from './views/signup';
import dashboard from './views/dashboard';


Vue.use(Router);

const routes = [
  { path:"/", component: homePage},
  { path: "/login", component: loginPage},
  { path: "/timeline", component: TodoList},
  { path: "/profile", component: profile},
  { path: "/chart", component: ganttChart},
  { path: "/signup", component: signUp},
  { path: "/dashboard", component: dashboard}
];

export default new Router({
    routes
  })