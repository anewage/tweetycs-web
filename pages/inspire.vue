<template>
  <v-layout row wrap>
    <v-flex text-xs-center xs12>
      <scatter-plot
        :id="component_id"
        :width="chartWidth"
        :height="chartHeight"
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
      component_id: 'text-changer',
      chartHeight: 500,
      chartWidth: null
    }
  },
  mounted() {
    const elem = document.getElementById(this.component_id)
    // this.chartHeight = elem.clientHeight
    this.chartWidth = elem.clientWidth
    window.addEventListener('resize', this.handleResize)
  },
  methods: {
    handleResize: function() {
      const elem = document.getElementById(this.component_id)
      // this.chartHeight = elem.clientHeight
      this.chartWidth = elem.clientWidth
    }
  }
}
</script>
