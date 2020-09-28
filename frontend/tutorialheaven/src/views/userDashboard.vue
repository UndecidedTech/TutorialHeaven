<template>
    <div class="appBackground">
        <div class="flex-container">
            <div class="dashboard-sidebar">
                <h1 >Courses</h1>
                <div v-for="(course, index) in this.courses" :key="index">
                    <p><i class="fas fa-book"></i>{{ course.name }}</p>
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
import axios from 'axios';
export default {
  name: 'userDashboard',
  data () {
    return {
      user: JSON.parse(localStorage.getItem('userData')),
      courses: [],
      notifications: [{
        title: 'Baseline results',
        content: 'You are ready to start the javascript lessons!'
      }]
    }
  },
  methods: {
    async getCourses () {
      const res = await axios.get(`/api/users/profile/${this.user._id}`)

      if (res.status === 200) {
        this.user = res.data
      }
    }
  },
  created () {
    this.getCourses()
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
    width: 25%;
    padding: 30px;
    border-right: 3px solid rgba(136, 133, 133, 0.534);
}
.notification-item {
    flex-grow: 1;
    align-self: stretch;
}

</style>
