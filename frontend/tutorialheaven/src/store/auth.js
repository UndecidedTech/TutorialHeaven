import axios from 'axios'

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
    }
  },

  actions: {
    async signIn ({ commit }, credentials) {
      const response = await axios.post('http://localhost:3000/api/users/signin', credentials)
      if (response.status === 200) {
        commit('SET_TOKEN', { token: response.data.token })
        delete response.data.token
        commit('SET_USER', response.data)
        return 'Success'
      }
    }
  }
}
