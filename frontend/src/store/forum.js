import axios from 'axios'
import Vue from 'vue'

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
      Vue.set(state, 'threads', newThreads)
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
        commit('SET_THREADS', res.data.threads)
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
        commit('SET_THREADS', res.data.threads)
      }
    },
    async removeThread ({ _ }, data) {
      const res = await axios.post('/api/forum/deleteThread', data)
      if (res.status === 200) {
        console.log(res.data)
      }
    },
    async removePost ({ _ }, data) {
      const res = await axios.post('/api/forum/deletePost', data)
      console.log(res)
    }
  }
}
