import axios from 'axios'
import router from '../router'

axios.defaults.withCredentials = true

export default {
  namespaced: true,
  state: {
    token: null,
    user: null
  },

  getters: {
    authenticated (state) {
      return state.token && state.user
    },
    user (state) {
      return state.user
    }
  },

  mutations: {
    SET_TOKEN (state, token) {
      state.token = token
    },
    SET_USER (state, user) {
      state.user = user
    },
    SET_USER_AVI (state, avi) {
      state.user.avi = avi
    },
    REM_USER (state) {
      state.user = null
    },
    REM_TOKEN (state) {
      state.token = null
    }
  },

  actions: {
    async signIn ({ commit }, credentials) {
      const response = await axios.post('/api/users/signin', credentials)
      if (response.status === 200) {
        commit('SET_TOKEN', { token: response.data.token })
        delete response.data.token
        commit('SET_USER', response.data)
        return 'Success'
      }
    },
    async onUserUpload ({ commit }, event) {
      const fd = new FormData()
      fd.append('image', event.target.files[0], event.target.files[0].name)
      const res = await axios.post('/api/images/image-upload', fd)
      if (res.status === 200) {
        commit('SET_USER_AVI', res.data.imageUrl)
      }
    },
    async signUp ({ commit }, user) {
      const res = await axios.post('/api/users/signup', user)
      if (res.status === 200) {
        commit('SET_TOKEN', res.data.token)
        delete res.data.token
        commit('SET_USER', res.data)
        router.push({ name: 'userDashboard' })
      }
    },
    signOut ({ commit }) {
      commit('REM_USER')
      commit('REM_TOKEN')
      router.push({ name: 'homePage' })
    }
  }
}
