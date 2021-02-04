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
      <div class="d-flex flex-row justify-content-around">
        <statsCounter :number="course.instructors.length" :title="'# of Instructors'"/>
        <statsCounter :number="course.students.length" :title="'# of Students'"/>
        <statsCounter :number="course.sections.length" :title="'# of Sections'"/>
      </div>
      <statsChart :chart-data="chartData(course)"/>
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
import statsCounter from '../components/statsCounter'

export default {
  name: 'statsDashboard',
  components: {
    statsChart,
    statsCounter
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
    },
    chartData (c) {
      return {
        labels: ['Students', 'Instructors', 'Sections'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [c.instructors.length, c.students.length, c.sections.length]
          }
        ]
      }
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
  width: 25%;
  padding: 5px;
}
</style>
