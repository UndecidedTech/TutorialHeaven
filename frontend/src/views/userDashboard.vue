<template>
    <div class="appBackground">
        <div class="flex-container">
            <div class="dashboard-sidebar">
                <div class="">
                  <h1 class="d-inline pr-5">Courses</h1>
                  <button type="button" class="btn btn-sm btn-primary mb-3" data-toggle="modal" data-target="#createCourseModal">Create a Course</button>
                </div>
                <hr>
                <div v-for="(course, index) in this.courses" :key="index">
                    <div v-if="course.role ==='instructor'">
                      <a :href="[[ course.name ]]" class="classLink">
                      <i class="fas fa-graduation-cap pr-2"></i>{{ course.name }}</a>
                    </div>
                    <div v-else>
                      <a :href="[[ course.name ]]" class="classLink">
                      <i class="fas fa-book pr-2"></i>{{ course.name }}</a>
                    </div>
                </div>
            </div>
            <div class="notification-item">
                <h1 style="padding-left: 10px; padding-top: 30px;">Notifications</h1>
                <hr/>
                <section class="card align-self-center" style="width: auto;margin: 20px;">
                  <div v-for="(notif, index) in notifications" :key="index">
                    <div class="card-body">
                        <a class="card-title ">{{ notif.title }}</a>
                        <hr/>
                        <p class="card-text">{{notif.content}}</p>
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
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <label for="courseName">Course Name</label>
              <input v-model="newCourse.name" id="courseName" type="text" class="form-control">
              <label for="subject">Subject</label>
              <select v-model="newCourse.subject" class="custom-select" id="subject">
              <option selected>Choose...</option>
              <option value="Greek History">Greek History</option>
              <option value="Roman History">Roman History</option>
              <option value="Japanese History">Japanese History</option>
              </select>
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
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'userDashboard',
  data () {
    return {
      newCourse: {
        name: null,
        subject: null,
        subscription: true
      },
      notifications: [{
        title: 'Baseline results',
        content: 'You are ready to start the javascript lessons!'
      }]
    }
  },
  methods: {
    ...mapActions({
      getCourses: 'courses/getCourses',
      createCourse: 'courses/createCourse'
    })
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      courses: 'courses/courses'
    })
  },
  created () {
    this.getCourses(this.user._id)
    console.log(this.courses)
  }
}
</script>

<style scoped lang="css">
.flex-container {
    min-height: 94vh;
    display: flex;
    justify-content: space-around;
    align-items: flex-start;
    border: 2px solid #5e0d0d;
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

</style>
