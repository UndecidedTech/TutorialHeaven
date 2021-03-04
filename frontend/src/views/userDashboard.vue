<template>
    <div class="appBackground">
        <div class="flex-container">
            <div class="dashboard-sidebar">
                <div class="">
                  <h1 class="d-inline pr-5">Courses</h1>
                  <button type="button" class="btn btn-sm btn-primary mb-3" data-toggle="modal" data-target="#createCourseModal">Create a Course</button>
                </div>
                <hr/>
                <div v-for="(course, index) in this.courses" :key="index">
                    <div v-if="course.role ==='instructor'">
                      <a class="classLink">
                      <i class="fas fa-graduation-cap pr-2"></i>{{ course.name }}</a>
                      <button @click="editCourse(course.name, course._id)" type="button" class="btn btn-sm editCourseButton">+</button>
                    </div>
                    <div v-else>
                      <a class="classLink" @click="viewCourse(course.name, course._id)">
                      <i class="fas fa-book pr-2"></i>{{ course.name }}</a>
                    </div>
                </div>
            </div>
            <div class="notification-item">
                <button class="btn float-right mt-5 mr-5" :class="{ readButtonActive: marked, readButton: !marked }" @click="toggleRead()">Read</button>
                <h1 style="padding-left: 10px; padding-top: 30px; font-weight: bold">Notifications</h1>
                <hr/>
                <section class="align-self-center" style="width: auto;margin: 20px;">
                  <div class="mb-3 border-bottom py-3 d-flex flex-column width-full" v-for="(notif, index) in notifications" :key="index">
                    <div class="body" :class="user.read_notifications.includes(notif._id) ? 'th-notif': ''">
                    <div class="d-flex flex-items-baseline">
                      <span class="mr-3">
                        <a @click="goProfile()" class="d-inline-block pointer">
                          <img class="avatar avatar-user" width="32" height="32" :src="notif.avi"/>
                        </a>
                      </span>
                      <div>
                         {{ notif.courseName }}
                      </div>
                    </div>
                    <div class="Box mt-2" :class="user.read_notifications.includes(notif._id) ? 'th-read': ''">
                        <a class="cardTitle font-weight-bold" @click="goToResource(notif, true)">{{ notif.title }}</a>
                        <p class="cardInfo">
                          {{notif.content}}
                          <button class="float-right btn btn-light" @click="markRead(notif)"><i class="fas fa-eye"/></button>
                          <button class="mr-3 float-right btn btn-light" @click="goToResource(notif, false)"><i class="fas fa-external-link-alt"/></button>
                        </p>
                    </div>
                    </div>
                  </div>
                </section>
            </div>
        </div>
      <div class="modal fade" id="createCourseModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Create Course</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="closeModal()">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label for="courseName">Course Name</label>
              <input v-model="newCourse.name" id="courseName" type="text" class="form-control" required>
              <label for="courseDescription">Description</label>
              <textarea v-model="newCourse.description" rows="5" cols="48"/>
              <label for="subject">Subject</label>
              <select v-model="newCourse.subject" class="custom-select" id="subject" required>
              <option value="Greek History">Greek History</option>
              <option value="Roman History">Roman History</option>
              <option value="Japanese History">Japanese History</option>
              <option value="Other">Other</option>
              </select>
              <label for="fileUpload">Image Upload</label>
              <form>
                <div class="custom-file">
                  <input name="fileUpload" type="file" class="custom-file-input" id="customFile" @change="selectedFile($event)">
                  <label class="custom-file-label" for="customFile">Choose file</label>
                </div>
              </form>
            </div>
            <div class="modal-footer">
              <button type="button" @click="createCourse(newCourse)" data-dismiss="modal" class="btn btn-primary">Create</button>
            </div>
          </div>
        </div>
        </div>

    </div>
</template>

<script>
import $ from 'jquery'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'userDashboard',
  components: {
  },
  data () {
    return {
      newCourse: {
        image: null,
        description: null,
        name: null,
        subject: null,
        subscription: false
      },
      marked: false
    }
  },
  methods: {
    ...mapActions({
      getCourses: 'user/getCourses',
      createCourse: 'user/createCourse',
      getNotifications: 'user/getNotifications',
      markRead: 'user/markRead'
    }),
    editCourse (courseName, id) {
      this.$router.push({ name: 'course', params: { courseName: courseName, courseID: id } })
    },
    viewCourse (courseName, id) {
      this.$router.push({ name: 'course', params: { courseName: courseName, courseID: id } })
    },
    selectedFile (event) {
      console.log('triggered')
      this.newCourse.image = event.target.files[0]
      console.log(this.newCourse.image)
    },
    closeModal () {
      this.newCourse = {
        image: null,
        description: null,
        name: null,
        subject: null,
        subscription: true
      }
      $('#customFile').val('')
    },
    goProfile () {
      this.$router.push({ name: 'userProfile' })
    },
    goToResource (notif) {
      if (notif.resource.type === 'forum' && notif.resource._id !== undefined) {
        this.$router.push({ name: 'forum', params: { courseID: notif.courseId, threadID: notif.resource._id } })
      } else if (notif.resource.type === 'forum' && notif.resource._id === undefined) {
        this.$router.push({ name: 'forum', params: { courseID: notif.courseId, threadID: notif.resource._id } })
      } else if (notif.resource.type === 'courses' && notif.resource._id !== undefined) {
        this.$router.push({ name: 'course', params: { courseID: notif.courseId, sectionID: notif.resource._id } })
      } else if (notif.resource.type === 'courses' && notif.resource._id !== undefined && notif.subresource._id !== undefined) {
        this.$router.push({ name: 'course', params: { courseID: notif.courseId, sectionID: notif.resource._id, moduleID: notif.subresource._id } })
      } else if (notif.resource.type === 'courses' && notif.resource._id === undefined) {
        this.$router.push({ name: 'course', params: { courseID: notif.courseId } })
      } else if (notif.resource.type === 'statistics' && notif.resource._id === undefined) {
        this.$router.push({ name: 'statistics', params: { courseID: notif.courseId } })
      }
    },
    toggleRead () {
      if (this.marked === false) {
        this.marked = true
      } else {
        this.marked = false
      }

      this.getNotifications({ userID: this.user._id, marked: this.marked })
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      courses: 'user/userCourses',
      notifications: 'user/notifications'
    })
  },
  created () {
    this.getCourses(this.user._id)
    this.getNotifications({ userID: this.user._id })
    // console.log(this.courses)
  },
  mounted () {
    $('#createCourseModal').on('hidden.bs.modal', (evt) => {
      this.closeModal()
    })
  }
}
</script>

<style scoped lang="css">
.flex-container {
    min-height: 93.7vh;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
}
.dashboard-sidebar {
    align-self: stretch;
    width: 20%;
    padding: 20px;
    border-right: 3px solid rgba(136, 133, 133, 0.534);
}
.notification-item {
    flex-grow: 1;
    align-self: stretch;
}
.classLink {
  color: black;
  text-decoration: none;
  background-color: transparent;
  }

.editCourseButton:hover {
  background-color: #007bff;
  color: white;
}

.cardTitle {
  color: #24292e!important;
}

.cardTitle:hover {
  color:#007bff!important;
  cursor: pointer;
  text-decoration: none;
}

.cardInfo {
  font-size: 14px;
  line-height: 1.5;
}

.border-bottom {
    border-bottom: 1px solid #e1e4e8!important;
}

.Box {
    padding: 1em;
    background-color: #fff;
    border: 1px solid #e1e4e8;
    border-radius: 6px;
}
.flex-items-baseline {
    align-items: baseline!important;
}

.avatar {
    display: inline-block;
    overflow: hidden;
    line-height: 1;
    vertical-align: middle;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 0 0 1px grey;
}

.avatar-user {
    border-radius: 50%!important;
}

.width-full {
    width: 100%!important;
}

.th-notif {
  opacity: .6;
}

.th-read {
  background: #CCCCCC
}

.readButtonActive {
  background: cadetblue;
  color: #fff
}

.readButton:hover {
  background: cadetblue;
  border-color: cadetblue;
  color: #fff;
}

.readButton {
  background: #fff;
  border-color:cadetblue;
}

</style>
