import axios from 'axios'

axios.defaults.withCredentials = true

export default {
  namespaced: true,
  state: {
    course: {},
    selectedModule: {
      type: '',
      index: 0
    }
  },

  getters: {
    course (state) {
      return state.course
    },
    selectedModule (state) {
      return state.selectedModule
    }
  },
  mutations: {
    SET_COURSE (state, course) {
      state.course = course
      console.log('Course Set')
    },
    SET_SELECTEDMODULE (state, value) {
      state.selectedModule = value
    }
  },

  actions: {
    signOut ({ commit }) {
      commit('SET_SELECTEDMODULE', false)
      commit('SET_COURSE', {})
    },
    findCourse ({ state }, urlParams) {
      const value = state.courses.find(elem => elem._id === urlParams.courseID)
      console.log(value)
    },
    async createSection ({ commit }, data) {
      const res = await axios.post('/api/courses/createSection', data)
      commit('SET_COURSE', res.data)
    },
    async getCourse ({ commit }, courseID) {
      console.log(courseID)
      const res = await axios.get(`/api/courses/getCourse/${courseID}`)
      if (res.status === 200) {
        commit('SET_COURSE', res.data)
      }
    },
    async updateCourse ({ commit }, data) {
      console.log(data)
      const res = await axios.put('/api/courses/updateCourse', {
        courseID: data.courseID,
        field: data.field,
        value: data.value
      })
      if (res.status === 200) {
        console.log(res.data)
        commit('SET_COURSE', res.data)
      }
    },
    async updateSection ({ commit }, data) {
      const res = await axios.put('/api/courses/updateSection', data)
      if (res.status === 200) {
        commit('SET_COURSE', res.data)
      }
    },
    async updateSectionContent ({ commit, state }, update) {
      console.log('HERE', JSON.stringify(update))
      update.courseID = state.course._id
      console.log(update)
      const res = await axios.put('/api/courses/updateSectionContent', update)
      if (res.status === 200) {
        console.log(res.data)
        commit('SET_COURSE', res.data)
      }
    },
    async createModuleContent ({ commit, state }, newContent) {
      newContent.courseID = state.course._id
      console.log(newContent)
      const res = await axios.post('/api/courses/createModuleContent', newContent)
      console.log(res.data)
      if (res.status === 200) {
        console.log(res.data)
        commit('SET_COURSE', res.data)
      }
    },
    async createModule ({ commit }, data) {
      const res = await axios.post('/api/courses/createModule', data)
      if (res.status === 200) {
        commit('SET_COURSE', res.data)
      }
    }
  }
}
