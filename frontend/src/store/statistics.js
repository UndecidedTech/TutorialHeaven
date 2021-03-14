import axios from 'axios'

axios.defaults.withCredentials = true

export default {
  namespaced: true,
  state: {
    stats: {}
  },
  getters: {
    stats (state) {
      return state.stats
    }
  },
  mutations: {
    SET_STATS (state, stats) {
      state.stats = stats
    }
  },
  actions: {
    async getStats ({ commit }, courseID) {
      console.log('here')
      const res = await axios.get('/api/statistics', { params: { courseID } })
      if (res.status === 200) {
        console.log(res.data)
        commit('SET_STATS', res.data)
        return 'Success'
      }
    }
  }
}
