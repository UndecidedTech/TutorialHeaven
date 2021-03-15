<template>
<div>
  <h1 class="text-center mt-3">{{course.name}}</h1>
    <div v-if="course.instructors.includes(user._id)">
      <div class="d-flex flex-row flex-wrap justify-content-around align-items-center">
        <statsCounter :number="course.students.length" :title="'# of Students'"/>
        <lineChart :chartData="chartData()" :chartTitle="'Growth Chart'"/>
        <pieChart :chartData="chartData()" :chartTitle="'Average User Score'"/>
        <thTable :tableData="stats.assessments" :tableName="'Quiz Performance'"/>
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
    chartData () {
      return {
        labels: ['A', 'B', 'C', 'D', 'F'],
        datasets: [
          {
            label: 'data',
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ],
            borderWidth: '1',
            data: this.stats.grades
          }
        ]
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
