
<div>
<canvas id="myChart" width="200" height="200"></canvas>
</div>

<script>
import { Bar } from 'vue-chartjs'

export default {
  name: 'statsChart',
  extends: Bar,
  components: {
  },
  data () {
    return {
      options: {
        responsive: false,
        maintainAspectRation: true,
        scaleOverride: true,
        scaleSteps: 1,
        scaleStepWidth: 50,
        scaleStartValue: 0
      },
      chartData: {
        labels: ['Students', 'Instructors', 'Sections'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [30, 40, 40]
          },
          {
            label: 'Test',
            backgroundColor: '#f87979',
            data: [9, 10, 10]
          }
        ]
      }
    }
  },
  methods: {
  },
  computed: {
  },
  mounted () {
    this.renderChart(this.chartData, this.options)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
</style>
