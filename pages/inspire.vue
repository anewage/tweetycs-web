<template>
  <v-layout row wrap>
    <v-flex text-xs-center xs12>
      <scatter-plot
        :id="scatter_id"
        :width="sizes.scatterplot.width"
        :height="sizes.scatterplot.height"
        :dataset="dataset"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import ScatterPlot from '../components/ScatterPlot'
export default {
  name: 'PageInspire',
  components: {
    'scatter-plot': ScatterPlot
  },
  data() {
    return {
      dataset: [[2, 3, true]],
      scatter_id: 'scatter-plot',
      sankey_id: 'heatmap',
      sizes: {
        scatterplot: {
          width: 600,
          height: 500
        }
      }
    }
  },
  watch: {
    dataset: function(newValue) {
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
        that.dataset.push([val1, val2, true])
      }
    }, 3000)
  },
  methods: {
    resize: function() {
      const scatter = document.getElementById(this.scatter_id)
      this.sizes.scatterplot.width = scatter.clientWidth
    }
  }
}
</script>
