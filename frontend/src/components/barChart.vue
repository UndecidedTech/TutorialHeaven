
<div>
<canvas id="myChart" width="200" height="200"></canvas>
</div>

<script>
import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  name: 'barChart',
  extends: Bar,
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
        scaleStartValue: 0
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
