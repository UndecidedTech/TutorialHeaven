<template>
<div>
  <div class="input-group" id="courseSelect">
    <div class="input-group-prepend"><span class="input-group-text">Course</span></div>
      <select class="form-control input" v-model="selectedCourse" @change="updateCourseID">
        <option value="" selected> Overview </option>
        <option v-for="(test, index) in user.courses" :key="index" :value="test " :id="test.name">{{test.name}}</option>
      </select>
    </div>
    <div v-if="selectedCourse.role == 'instructor'">
      <div class="d-flex flex-row justify-content-around align-items-center">
        <statsCounter :number="course.students.length" :title="'# of Students'"/>
        <barChart/>
        <lineChart/>
      </div>
    </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import barChart from '../components/barChart'
import lineChart from '../components/lineChart'
import statsCounter from '../components/statsCounter'

export default {
  name: 'statsDashboard',
  components: {
    barChart,
    lineChart,
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
            label: 'Test',
            backgroundColor: 'rgba(248, 121, 121, 0.5)',
            borderColor: 'rgb(0, 0, 0)',
            borderWidth: '1',
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
