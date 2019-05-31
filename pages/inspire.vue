<template>
  <v-layout row wrap>
    <v-flex text-xs-center xs12>
      <scatter-plot
        :id="scatter_id"
        :width="sizes.scatterplot.width"
        :height="sizes.scatterplot.height"
        :dataset="dataset"
      />
      <heat-map
        :id="heat_id"
        :width="sizes.heatmap.width"
        :height="sizes.heatmap.height"
        :dataset="dataset"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import ScatterPlot from '../components/ScatterPlot'
import HeatMap from '../components/HeatMap'
export default {
  name: 'PageInspire',
  components: {
    'scatter-plot': ScatterPlot,
    'heat-map': HeatMap
  },
  data() {
    return {
      scatter_id: 'scatter-plot',
      heat_id: 'heatmap',
      sizes: {
        scatterplot: {
          width: 600,
          height: 500
        },
        heatmap: {
          width: 600,
          height: 500
        }
      }
    }
  },
  computed: {
    dataset() {
      return this.$store.state.fetched
    }
  },
  mounted() {
    const that = this
    this.resize()
    window.addEventListener('resize', this.resize)

    // Update dataset (add new data)
    window.setInterval(function() {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let i = 0; i < 10; i++) {
        const x = alphabet.charAt(parseInt(Math.random() * 26))
        const y = 'v' + parseInt(Math.random() * 4)
        const v = Math.random() * 100
        const a = Math.random() * 100
        that.$store.commit('add', { x: x, y: y, v: v, a: a })
      }
    }, 1500)
  },
  methods: {
    resize: function() {
      const scatter = document.getElementById(this.scatter_id)
      const heat = document.getElementById(this.heat_id)
      this.sizes.scatterplot.width = scatter.clientWidth
      this.sizes.heatmap.width = heat.clientWidth
    }
  }
}
</script>
