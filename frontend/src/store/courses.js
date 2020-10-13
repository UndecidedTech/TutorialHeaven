import axios from 'axios'
// import router from '../router'

axios.defaults.withCredentials = true

export default {
  namespaced: true,
  state: {
    course: {}
  },

  getters: {
    course (state) {
      return state.course
    }
  },
  mutations: {
    SET_COURSE (state, course) {
      state.course = course
    }
  },

  actions: {
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
    async updateSection ({ commit, state }, update) {
      console.log('HERE', JSON.stringify(update))
      update.courseID = state.course._id
      console.log(update)
      const res = await axios.put('/api/courses/updateSectionContent', update)
      if (res.status === 200) {
        console.log(res.data)
        commit('SET_COURSE', res.data)
      }
    },
    async createSectionContent ({ commit, state }, newContent) {
      newContent.courseID = state.course._id
      console.log(newContent)
      const res = await axios.post('/api/courses/createSectionContent', newContent)
      if (res.status === 200) {
        console.log(res.data)
        commit('SET_COURSE', res.data)
      }
    }
  }
}
