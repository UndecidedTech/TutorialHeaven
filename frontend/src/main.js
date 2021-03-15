import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.css'
import store from './store/index'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faUserSecret)
Vue.component('font-awesome-icon', FontAwesomeIcon)

// axios.defaults.withCredentials = true
Vue.config.productionTip = false
Vue.prototype.$globalValue = ''

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
