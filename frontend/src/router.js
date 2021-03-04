import Vue from 'vue'
import Router from 'vue-router'
import homePage from './views/homePage.vue'
import userProfile from './views/userProfile'
import userSignUp from './views/userSignUp'
import userDashboard from './views/userDashboard'
import notFound from './views/404'
import course from './views/course'
import userReset from './views/userPasswordReset'
import moduleContent from './components/moduleContent'
import courseCatalog from './views/courseCatalog'
import forum from './views/forum'

Vue.use(Router)

const routes = [

  { path: '/', component: homePage, name: 'homePage' },
  { path: '/moduleContent', component: moduleContent, name: 'moduleContent' },
  { path: '/userProfile', component: userProfile, name: 'userProfile' },
  { path: '/userSignUp', component: userSignUp, name: 'userSignUp' },
  { path: '/userDashboard', component: userDashboard, name: 'userDashboard' },
  { path: '/course/:courseID/:sectionID?/:moduleID?/:contentID?', component: course, name: 'course', params: true },
  { path: '/course/:courseID/stats', component: course, name: 'courseStats', params: true },
  { path: '*', component: notFound },
  { path: '/reset/:token', component: userReset, name: 'userReset', params: true },
  { path: '/courseCatalog', component: courseCatalog, name: 'courseCatalog' },
  { path: '/forum/:courseID/:threadID?', component: forum, name: 'forum', params: true }
]

export default new Router({
  mode: 'history',
  routes
})
