import Vue from 'vue'
import createPersistedState from 'vuex-persistedstate'
import Vuex from 'vuex'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({ storage: window.sessionStorage })],
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
  },
  modules: {
    user
  }
})
