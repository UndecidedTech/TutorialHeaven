<template>
<div class="appBackground">
  <div class="input-group" id="courseSelect">
    <div class="input-group-prepend"><span class="input-group-text">Course</span></div>
      <select class="form-control input" v-model="selectedCourse" @change="updateCourseID">
        <option value="" selected> Overview </option>
        <option v-for="(test, index) in user.courses" :key="index" :value="test " :id="test.name">{{test.name}}</option>
      </select>
    </div>
    <div v-if="selectedCourse.role == 'instructor'">
      <statsChart/>
      Instructor stats not implemented yet!
      <br/>
      Number of Instructors {{course.instructors.length}}
      <br/>
      Number of Students {{course.students.length}}
      <br>
      Number of Sections {{course.sections.length}}
    </div>
    <div v-else>
      <div v-for="(result, index) in selectedCourse.results" :key="index">
        {{ result._id }} {{ result.score }}
      </div>
      {{ selectedCourse }}
    </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import statsChart from '../components/statsChart'

export default {
  name: 'statsDashboard',
  components: {
    statsChart
  },
  data () {
    return {
      selectedCourse: {}
    }
  },
  methods: {
    ...mapActions({
      getCourse: 'courses/getCourse'
    }),
    updateCourseID () {
      this.$router.push({ name: 'statsDashboard', params: { courseID: this.selectedCourse._id } })
      this.getCourse(this.$route.params.courseID)
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      course: 'courses/course'
    })
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
#courseSelect {
  width: 50%;
  padding: 5px;
}
</style>
