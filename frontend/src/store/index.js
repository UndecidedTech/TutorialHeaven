import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'
import Vuex from 'vuex'
import user from './user'
import courses from './courses'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
  },
  mutations: {
  },
  actions: {
    signOut ({ commit }) {
      commit('user/REM_USER')
      commit('user/REM_TOKEN')
      commit('courses/SET_SELECTEDMODULE', null)
      console.log('Logged Out')
      router.push({ name: 'homePage' })
    }
  },
  getters: {
  },
  modules: {
    user,
    courses
  }
})
