import axios from 'axios'

axios.defaults.withCredentials = true

export default {
  namespaced: true,
  state: {
    threads: [],
    thread: {}
  },
  getters: {
    threads (state) {
      return state.threads
    },
    thread (state) {
      return state.thread
    }
  },
  mutations: {
    SET_THREADS (state, newThreads) {
      state.threads = newThreads
    },
    SET_THREAD (state, newThread) {
      state.thread = newThread
    }
  },
  actions: {
    async getThreads ({ commit }, courseID) {
      console.log('getting THreads')
      const res = await axios.get('/api/forum', { params: { courseID } })
      commit('SET_THREADS', res.data)
      console.log(res.data)
    },
    async createThread ({ _ }, newThread) {
      console.log(newThread)
      const fd = new FormData()
      fd.append('image', newThread.image, newThread.image.name)
      fd.append('text', newThread.text)
      fd.append('courseID', newThread.courseID)
      fd.append('title', newThread.title)
      const res = await axios.post('/api/forum', fd)
      if (res.data === 200) {
        console.log(res.data)
      }
    }
  }
}
