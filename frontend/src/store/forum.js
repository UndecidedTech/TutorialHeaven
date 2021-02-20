import axios from 'axios'

axios.defaults.withCredentials = true

export default {
  namespaced: true,
  state: {
    threadList: {},
    thread: {}
  },
  getters: {
    threads (state) {
      return state.threadList
    },
    thread (state) {
      return state.thread
    }
  },
  mutations: {
    SET_THREADS (state, newThreads) {
      state.threadList = newThreads
    },
    SET_THREAD (state, newThread) {
      state.thread = newThread
    }
  },
  actions: {
    async getThreads ({ commit }, courseID) {
      console.log('getting THreads')
      const res = await axios.get('/api/forum', { params: { courseID } })
      if (res.status === 200) {
        commit('SET_THREADS', res.data)
        console.log(res.data)
      } else if (res.status === 204) {
        commit('SET_THREADS', [])
      }
    },
    async createThread ({ commit }, newThread) {
      console.log(newThread)
      const fd = new FormData()
      fd.append('image', newThread.image, newThread.image.name)
      fd.append('text', newThread.text)
      fd.append('courseID', newThread.courseID)
      fd.append('title', newThread.title)
      fd.append('sectionID', newThread.relation.sectionID)
      fd.append('moduleID', newThread.relation.moduleID)
      const res = await axios.post('/api/forum', fd)
      if (res.status === 200) {
        commit('SET_THREADS', res.data)
      }
    },
    async likeThread ({ commit }, data) {
      const res = await axios.post('/api/forum/like', data)
      if (res.status === 200) {
        commit('SET_THREADS', res.data)
      }
    },
    async createPost ({ commit }, data) {
      const res = await axios.post('/api/forum/post', data)
      if (res.status === 200) {
        commit('SET_THREADS', res.data)
      }
    },
    async removeThread ({ commit }, data) {
      const res = await axios.delete('/api/forum/', { data: data })
      if (res.status === 200) {
        commit('SET_THREADS', res.data)
      }
    },
    async removePost ({ commit }, data) {
      const res = await axios.delete('/api/forum/post', { data: data })
      if (res.status === 200) {
        commit('SET_THREADS', res.data)
      }
    }
  }
}
