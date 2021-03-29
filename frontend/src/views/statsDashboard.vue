<template>
<div>
  <h1 class="text-center mt-3">{{course.name}}</h1>
    <div v-if="course.instructors.includes(user._id)">
      <div class="d-flex flex-row flex-wrap justify-content-around align-items-center">
        <statsCounter :number="course.students.length" :title="'# of Students'"/>
        <lineChart :chartData="chartData('growthChart')" :chartTitle="'Growth Chart'" :width="800" :height="400"/>
        <pieChart :chartData="chartData('AvgUserScore')" :chartTitle="'Average User Score'"/>
        <thTable :tableData="stats.assessments" :tableName="'Quiz Performance'"/>
        <thTable :tableData="stats.subjects" :tableName="'Subject Performance'"/>
      </div>
    </div>
    <div v-else>
      <div class="d-flex flex-row flex-wrap justify-content-around align-items-center">
        <lineChart :chartData="chartData('gradeHistory')" :chartTitle="'Grade History Chart'" :width="800" :height="400"/>
        <statsCounter :number="stats.currentGrade" :title="'Current Grade'"/>
        <thTable :tableData="stats.quizTable" :tableName="'Quiz Performance'"/>
        <thTable :tableData="stats.subjects" :tableName="'Subject Performance'"/>
      </div>
    </div>
</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import lineChart from '../components/lineChart'
import statsCounter from '../components/statsCounter'
import thTable from '../components/thTable'
import pieChart from '../components/pieChart'

export default {
  name: 'statsDashboard',
  components: {
    lineChart,
    statsCounter,
    thTable,
    pieChart
  },
  data () {
    return {
    }
  },
  methods: {
    ...mapActions({
      getCourse: 'courses/getCourse',
      getStats: 'statistics/getStats'
    }),
    chartData (type) {
      if (type === 'AvgUserScore') {
        return {
          labels: ['A', 'B', 'C', 'D', 'F'],
          datasets: [
            {
              label: 'data',
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)',
                'rgb(50, 168, 82)',
                'rgb(150, 131, 216)'
              ],
              borderWidth: '1',
              data: this.stats.grades
            }
          ]
        }
      } else if (type === 'growthChart') {
        return {
          labels: this.stats.months[0],
          datasets: [
            {
              label: '# of Students that joined per month',
              backgroundColor: 'rgba(248, 121, 121, 0.5)',
              borderColor: 'rgb(0, 0, 0)',
              borderWidth: '1',
              data: this.stats.months[1]
            }
          ]
        }
      } else if (type === 'gradeHistory') {
        return {
          labels: this.stats.gradeHistory[0],
          datasets: [
            {
              label: 'Grade History',
              backgroundColor: 'rgba(248, 121, 121, 0.5)',
              borderColor: 'rgb(0, 0, 0)',
              borderWidth: '1',
              data: this.stats.gradeHistory[1]
            }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'user/user',
      course: 'courses/course',
      stats: 'statistics/stats'
    })
  },
  created () {
    this.getCourse(this.$route.params.courseID)
    this.getStats(this.$route.params.courseID)
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
