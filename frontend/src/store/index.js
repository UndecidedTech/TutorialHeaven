import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'
import Vuex from 'vuex'
import user from './user'
import courses from './courses'
import forum from './forum'
import statistics from './statistics'
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
      commit('user/SET_USER', null)
      commit('user/SET_TOKEN', null)
      commit('courses/SET_SELECTEDMODULE', { type: '', index: null })
      commit('user/SET_COURSES', [])
      console.log('Logged Out')
      router.push({ name: 'homePage' })
    }
  },
  getters: {
  },
  modules: {
    user,
    courses,
    forum,
    statistics
  }
})
