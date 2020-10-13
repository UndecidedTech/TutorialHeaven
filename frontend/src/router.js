import Vue from 'vue'
import Router from 'vue-router'
import homePage from './views/homePage.vue'
import userProfile from './views/userProfile'
import userSignUp from './views/userSignUp'
import userDashboard from './views/userDashboard'
import notFound from './views/404'
import editCourse from './views/editCourse'
import userReset from './views/userPasswordReset'
import editCourseContent from './components/editCourseContent'

Vue.use(Router)

const routes = [

  { path: '/', component: homePage, name: 'homePage' },
  { path: '/test', component: editCourseContent, name: 'editCourseContent' },
  { path: '/userProfile', component: userProfile, name: 'userProfile' },
  { path: '/userSignUp', component: userSignUp, name: 'userSignUp' },
  { path: '/userDashboard', component: userDashboard, name: 'userDashboard' },
  { path: '/editCourse/:courseName/:courseID', component: editCourse, name: 'editCourse', params: true },
  { path: '*', component: notFound },
  { path: '/reset/:token', component: userReset, name: 'userReset', params: true }
]

export default new Router({
  mode: 'history',
  routes
})
