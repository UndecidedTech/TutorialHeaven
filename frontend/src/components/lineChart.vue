
<div>
<canvas id="myChart" width="200" height="200"></canvas>
</div>

<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  name: 'lineChart',
  extends: Line,
  mixins: [reactiveProp],
  components: {
  },
  props: {
    chartData: Object
  },
  data () {
    return {
      options: {
        responsive: false,
        maintainAspectRation: true,
        scaleOverride: true,
        scaleSteps: 1,
        scaleStepWidth: 50,
        scaleStartValue: 0,
        title: {
          display: true,
          text: 'Line Chart'
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
      },
      data: {
        labels: ['Students', 'Instructors', 'Sections'],
        datasets: [
          {
            label: 'Test',
            backgroundColor: 'rgba(248, 121, 121, 0.5)',
            borderColor: 'rgb(0, 0, 0)',
            borderWidth: '1',
            data: [10, 20, 40]
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
    this.renderChart(this.data, this.options)
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
</style>
