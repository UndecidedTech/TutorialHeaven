
<div>
<canvas id="myChart" :width="width" :height="height"></canvas>
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
    chartData: Object,
    chartTitle: String,
    width: {
      type: Number,
      default: 200
    },
    height: {
      type: Number,
      default: 200
    }
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
          text: this.chartTitle
        },
        tooltips: {
          mode: 'index',
          intersect: false
        },
        hover: {
          mode: 'nearest',
          intersect: true
        }
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
