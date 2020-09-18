import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // "user": null
  },
  mutations: {
    // SET_USER_DATA (state, userData) {
    //   state.user = userData;
    //   localStorage.setItem("user", JSON.stringify(userData));
    //   axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`
    // }
  },
  actions: {
    // signUp ({ commit }, credentials) {
    //   return axios.post("//localhost:3000/signup", credentials)
    //     .then(({ data }) => {
    //       commit("SET_USER_DATA", data)
    //     })
    // },
    // login ({ commit }, credentials) {
    //   return axios.post("//localhost:3000/signin", credentials)
    //     .then(({ data }) => {
    //       commit("SET_USER_DATA", data)
    //     })
    // }
  },
  getters: {
    // loggedIn (state) {
    //   return !!state.user
    // }
  },
  modules: {
    auth
  }
})
