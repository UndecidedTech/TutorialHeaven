<template>
<div>
  <h1 class="text-center">{{course.name}}</h1>
    <div v-if="course.instructors.includes(user._id)">
      <div class="d-flex flex-row justify-content-around align-items-center">
        <statsCounter :number="course.students.length" :title="'# of Students'"/>
        <barChart :chartData="chartData()"/>
        <lineChart :chartData="chartData()"/>
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
    }
  },
  methods: {
    ...mapActions({
      getCourse: 'courses/getCourse'
    }),
    chartData () {
      return {
        labels: ['Students', 'Instructors', 'Sections'],
        datasets: [
          {
            label: 'Test',
            backgroundColor: 'rgba(248, 121, 121, 0.5)',
            borderColor: 'rgb(0, 0, 0)',
            borderWidth: '1',
            data: [1, 12, 123]
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
  },
  created () {
    this.getCourse(this.$route.params.courseID)
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
