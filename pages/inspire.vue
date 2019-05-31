<template>
  <v-layout row wrap>
    <v-flex text-xs-center xs12>
      <scatter-plot
        :id="scatter_id"
        :width="sizes.scatterplot.width"
        :height="sizes.scatterplot.height"
        :dataset="scatter_dataset"
      />
      <heat-map
        :id="heat_id"
        :width="sizes.heatmap.width"
        :height="sizes.heatmap.height"
        :dataset="heatmap_dataset"
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
      scatter_dataset: [[2, 3]],
      heatmap_dataset: [
        { x: 'A', y: 'v1', v: 10 },
        { x: 'A', y: 'v2', v: 14 },
        { x: 'A', y: 'v3', v: 1 },
        { x: 'B', y: 'v1', v: 6 },
        { x: 'B', y: 'v2', v: 15 },
        { x: 'B', y: 'v3', v: 3 },
        { x: 'C', y: 'v1', v: 10 },
        { x: 'C', y: 'v2', v: 10 },
        { x: 'C', y: 'v3', v: 10 },
        { x: 'D', y: 'v1', v: 10 },
        { x: 'D', y: 'v2', v: 10 },
        { x: 'D', y: 'v3', v: 10 },
        { x: 'E', y: 'v1', v: 10 },
        { x: 'E', y: 'v2', v: 10 },
        { x: 'E', y: 'v3', v: 1 }
      ],
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
  watch: {
    scatter_dataset: function(newValue) {
      if (newValue.length > 100) newValue.splice(0, 10)
    }
  },
  mounted() {
    const that = this
    this.resize()
    window.addEventListener('resize', this.resize)

    // Update dataset (add new data)
    window.setInterval(function() {
      for (let i = 0; i < 10; i++) {
        const val1 = Math.random() * 100
        const val2 = Math.random() * 100
        that.scatter_dataset.push([val1, val2])

        const val3 = parseInt(Math.random() * that.heatmap_dataset.length)
        that.heatmap_dataset[val3].v = Math.random() * 15
      }
    }, 300)
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
