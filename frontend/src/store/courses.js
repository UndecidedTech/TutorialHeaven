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
    async updateSection ({ _ }, section) {
      console.log(section)
      const res = await axios.post('/api/courses/updateSection', section)
      if (res.status === 200) {
        console.log(res.body)
      }
    }
  }
}
