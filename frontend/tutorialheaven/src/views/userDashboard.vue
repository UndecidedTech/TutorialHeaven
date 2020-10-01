<template>
    <div class="appBackground">
        <div class="flex-container">
            <div class="dashboard-sidebar">
                <div class="pb-4">
                  <h1 class="d-inline pr-5">Courses</h1>
                  <button class="btn btn-sm btn-primary">Create a Course</button>
                </div>
                <div v-for="(course, index) in this.courses" :key="index">
                    <a :href="[[ course.name ]]" class="classLink">
                    <i v-if="course.role === 'instructor' " class="fas fa-graduation-cap pr-2"></i>
                    <i v-else class="fas fa-book pr-2"></i>{{ course.name }}</a>
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
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'userDashboard',
  data () {
    return {
      notifications: [{
        title: 'Baseline results',
        content: 'You are ready to start the javascript lessons!'
      }]
    }
  },
  methods: {
    ...mapActions({
      getCourses: 'courses/getCourses'
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
