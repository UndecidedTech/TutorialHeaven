import axios from 'axios'
import router from '../router'

axios.defaults.withCredentials = true

export default {
  namespaced: true,
  state: {
    token: null,
    user: null,
    courses: [],
    notifications: []
  },

  getters: {
    authenticated (state) {
      return state.token && state.user
    },
    user (state) {
      return state.user
    },
    userCourses (state) {
      return state.courses
    },
    notifications (state) {
      return state.notifications
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
    SET_COURSES (state, courses) {
      state.courses = courses
    },
    SET_NOTIFICATIONS (state, notifications) {
      state.notifications = notifications
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
    async updateField ({ commit }, update) {
      console.log('vuex store action triggered', update)
      const res = await axios.post('/api/users/profile/', {
        userId: update.userId,
        field: update.fieldName,
        value: update.updatedValue
      })
      if (res.status === 200) {
        commit('SET_USER', res.data)
      }
    },
    async getCourses ({ commit }, userID) {
      const res = await axios.get(`/api/users/profile/${userID}`)
      if (res.status === 200) {
        commit('SET_COURSES', res.data.courses)
      }
    },
    async createCourse ({ state, dispatch }, courseData) {
      const fd = new FormData()
      fd.append('image', courseData.image, courseData.image.name)
      fd.append('description', courseData.description)
      fd.append('name', courseData.name)
      fd.append('subject', courseData.subject)
      fd.append('subscription', courseData.subscription)
      console.log(courseData)
      if (courseData.name && courseData.subject) {
        const res = await axios.post('/api/courses/createCourse', fd)
        console.log(courseData)
        if (res.status === 200) {
          dispatch('getCourses', state.user._id)
        }
      } else {
        alert('Please fill required forms')
      }
    },
    async submitAssessment ({ commit }, data) {
      if (data.responses.length === 0) {
        return alert('You have not selected any answers')
      } else {
        console.log(data)
        const res = await axios.post('/api/users/submitAssessment', data)
        if (res.status === 200) {
          commit('SET_USER', res.data)
          commit('SET_COURSES', res.data.courses)
        }
      }
    },
    async saveAssessment ({ _ }, data) {
      console.log(data)
      // const res = await axios.post('/api/users/submitAssessment', data)
      // if (res.status === 200) {
      // }
    },
    async joinCourse ({ _ }, data) {
      const res = await axios.post('/api/catalog', data)
      if (res.status === 200) {
        console.log(res.data)
        router.push({ name: 'userDashboard' })
      }
    },
    async getNotifications ({ commit }, data) {
      const res = await axios.get('/api/notifications', {
        params: {
          marked: data.marked || false,
          userID: data.userID
        }
      })
      console.log(res)
      if (res.status === 200) {
        console.log(res.data)
        // save data to the store here
        commit('SET_NOTIFICATIONS', res.data)
      }
    },
    async markRead ({ commit }, data) {
      console.log('Marked: ', data)
      const res = await axios.post('/api/notifications', data)
      if (res.status === 200) {
        console.log(res.data)
        // save data to the store here
      }
    }
  }
}
