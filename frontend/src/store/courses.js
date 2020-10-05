import axios from 'axios'
// import router from '../router'

axios.defaults.withCredentials = true

export default {
  namespaced: true,
  state: {
    courses: []
  },

  getters: {
    courses (state) {
      return state.courses
    }
  },

  mutations: {
    SET_COURSES (state, courses) {
      state.courses = courses
    },
    PUSH_COURSES (state, courses) {
      state.courses.push(courses)
    }
  },

  actions: {
    async getCourses ({ commit }, userID) {
      const res = await axios.get(`/api/users/profile/${userID}`)
      if (res.status === 200) {
        commit('SET_COURSES', res.data.courses)
      }
    },
    async createCourse ({ commit }, courseData) {
      if (courseData.name && courseData.subject) {
        const res = await axios.post('/api/courses/createCourse', courseData)
        if (res.status === 200) {
          commit('SET_COURSES', res.data.courses)
        }
      } else {
        alert('Please fill required forms')
      }
    }
  }
}
