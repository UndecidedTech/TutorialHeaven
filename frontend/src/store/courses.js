import axios from 'axios'

axios.defaults.withCredentials = true

export default {
  namespaced: true,
  state: {
    course: {},
    selectedModule: {
      type: '',
      index: 0
    },
    courseList: [],
    instructors: [],
    students: []
  },

  getters: {
    course (state) {
      return state.course
    },
    selectedModule (state) {
      return state.selectedModule
    },
    courseList (state) {
      return state.courseList
    },
    instructors (state) {
      return state.instructors
    },
    students (state) {
      return state.students
    }
  },
  mutations: {
    SET_COURSE (state, course) {
      state.course = course
    },
    SET_SELECTEDMODULE (state, value) {
      state.selectedModule = value
    },
    SET_COURSE_LIST (state, courseList) {
      state.courseList = courseList
    },
    SET_USERNAMES (state, value) {
      state.instructors = value.Instructors
      state.students = value.Students
    },
    REM_FROM_USERSLIST (state, data) {
      console.log(state[data.type], data.index)
      state[data.type].splice(data.index, 1)
    },
    REM_FROM_COURSE (state, data) {
      state.course[data.type].splice(data.index, 1)
    },
    ADD_TO_COURSE (state, data) {
      state.course[data.type].push(data.value)
    },
    ADD_USERNAMES (state, data) {
      if (data.type === 'instructors') {
        state.instructors.push({ name: data.value })
      }
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
      const res = await axios.put('/api/courses/updateCourse', data)
      if (res.status === 200) {
        console.log(res.data)
        commit('SET_COURSE', res.data)
      }
    },
    async deleteSection ({ commit }, data) {
      const res = await axios.post('/api/courses/deleteSection', data)
      if (res.status === 200) {
        commit('SET_COURSE', res.data)
      }
    },
    async updateSection ({ commit }, data) {
      const res = await axios.put('/api/courses/updateSection', data)
      if (res.status === 200) {
        commit('SET_COURSE', res.data)
      }
    },
    async updateModuleContent ({ commit, state }, update) {
      console.log('HERE', JSON.stringify(update))
      update.courseID = state.course._id
      console.log(update)
      const res = await axios.put('/api/courses/updateModuleContent', update)
      if (res.status === 200) {
        console.log(res.data)
        commit('SET_COURSE', res.data)
      }
    },
    async deleteModuleContent ({ commit, state }, data) {
      data.courseID = state.course._id
      const res = await axios.post('/api/courses/deleteModuleContent', data)
      console.log(res.data)
      if (res.status === 200) {
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
    async deleteModule ({ commit }, data) {
      const res = await axios.post('/api/courses/deleteModule', data)
      if (res.status === 200) {
        commit('SET_COURSE', res.data)
      }
    },
    async createModule ({ commit }, data) {
      const res = await axios.post('/api/courses/createModule', data)
      if (res.status === 200) {
        commit('SET_COURSE', res.data)
      }
    },
    async updateModule ({ commit }, data) {
      const res = await axios.put('/api/courses/updateModule', data)
      if (res.status === 200) {
        commit('SET_COURSE', res.data)
      }
    },
    async createAssessmentContent ({ commit, state }, data) {
      data.courseID = state.course._id
      console.log(data)
      const res = await axios.post('/api/courses/createAssessmentContent', data)
      if (res.status === 200) {
        console.log(res.data)
        commit('SET_COURSE', res.data)
      }
    },
    async updateAssessmentContent ({ commit, state }, data) {
      data.courseID = state.course._id
      console.log(data)
      const res = await axios.put('/api/courses/updateAssessmentContent', data)
      if (res.status === 200) {
        console.log(res.data)
        commit('SET_COURSE', res.data)
      }
    },
    async deleteAssessmentContent ({ commit, state }, data) {
      data.courseID = state.course._id
      console.log(data)
      const res = await axios.post('/api/courses/deleteAssessmentContent', data)
      if (res.status === 200) {
        console.log(res.data)
        commit('SET_COURSE', res.data)
      }
    },
    async getCourseList ({ commit }, searchText) {
      if (searchText) {
        const res = await axios.get('/api/catalog', { params: { query: searchText.query || '', subscribe: searchText.subscribe || false, enrolled: searchText.enrolled || false } })
        if (res.status === 200) {
          console.log('search data: ', res.data)
          commit('SET_COURSE_LIST', res.data)
        }
      } else {
        const res = await axios.get('/api/catalog')
        if (res.status === 200) {
          console.log(res.data)
          commit('SET_COURSE_LIST', res.data)
        }
      }
    },
    async postSubject ({ commit }, subject) {
      console.log(subject)
      const res = await axios.post('/api/courses/settings', subject)
      if (res.status === 200) {
        commit('SET_COURSE', res.data)
      }
    },
    async getUserNames ({ commit }, courseID) {
      console.log('here', courseID)
      const res = await axios.get('/api/courses/settings', { params: { courseID } })
      if (res.status === 200) {
        commit('SET_USERNAMES', res.data)
      }
    },
    async updateSettings ({ _, state }, data) {
      const updates = {}
      for (const key in data) {
        if (data[key] === true) {
          if (key === 'instructors') {
            updates[key] = state.instructors
          } else if (key === 'students') {
            updates[key] = state.students
          } else {
            updates[key] = state.course[key]
          }
        }
      }
      console.log('backend', updates)
      // const res = await axios.post(`/api/courses/settings/${state.course._id}`, updates)
      // if (res.status === 200) {
      //   this.getUserNames(state.course._id)
      //   console.log('response', res.data)
      //   return res
      // }
    }
  }
}
