<template>
  <div :id="chartDomID">
    <svg
      :id="chartDomID + '-svg'"
      :width="width"
      :height="height"
      class="svg scatterplot"
    >
      <transition-group
        id="circles"
        tag="g"
        name="fade"
        :duration="transitionDuraton"
      >
        <circle
          v-for="item in dataset"
          v-show="item[2]"
          :key="item[0]"
          :cx="xScale(item[0])"
          :cy="yScale(item[1])"
          :r="6"
          class="circle"
        ></circle>
      </transition-group>
      <g
        :class="'x-axis scatterplot-' + chartDomID + '-axis'"
        :transform="'translate(0,' + chartBottom + ')'"
      ></g>
      <g
        :class="'y-axis scatterplot-' + chartDomID + '-axis'"
        :transform="'translate(' + chartLeft + ', 0)'"
      ></g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'ScatterPlot',
  props: {
    chartDomID: {
      type: String,
      default: 'scatter-plot'
    },
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    dataset: {
      type: Array,
      default: function() {
        return []
      }
    },
    padding: {
      type: Object,
      default: function() {
        return {
          top: 20,
          right: 20,
          left: 35,
          bottom: 20
        }
      }
    }
  },
  data() {
    return {
      svg: null,
      circlesGroup: null,
      xAxis: null,
      yAxis: null,
      scales: {
        x: null,
        y: null
      },
      xTicks: 10,
      yTicks: 10,
      limit: 100,
      transitionDuraton: 1000
    }
  },
  computed: {
    chartLeft: function() {
      return this.padding.left
    },
    chartRight: function() {
      return this.width - this.padding.right
    },
    chartBottom: function() {
      return this.height - this.padding.bottom
    },
    chartTop: function() {
      return this.padding.top
    },
    chartHeight: function() {
      return this.chartBottom - this.chartTop
    },
    chartWidth: function() {
      return this.chartRight - this.chartLeft
    },
    xScale: function() {
      return d3
        .scaleLinear()
        .domain([
          d3.min(this.dataset, function(d) {
            return d[0]
          }),
          d3.max(this.dataset, function(d) {
            return d[0]
          })
        ])
        .range([this.chartLeft, this.chartRight])
        .nice()
    },
    yScale: function() {
      return d3
        .scaleLinear()
        .domain([
          d3.min(this.dataset, function(d) {
            return d[1]
          }),
          d3.max(this.dataset, function(d) {
            return d[1]
          })
        ])
        .range([this.chartBottom, this.chartTop])
        .nice()
    }
  },
  beforeUpdate() {
    // re-draw axes
    this.drawAxes()
  },
  mounted() {
    // Setup the SVG and Groups
    this.setupSVG()
  },
  methods: {
    setupSVG: function() {
      // Select the SVG element
      this.svg = d3.select('.scatterplot')
      this.circlesGroup = d3.select('#circles')
    },
    drawAxes: function() {
      // Update Axes
      this.xAxis = d3.axisBottom(this.xScale).ticks(this.xTicks)
      this.yAxis = d3.axisLeft(this.yScale).ticks(this.yTicks)

      // Draw X axis
      d3.select('.x-axis').call(this.xAxis)

      // Draw Y axis
      d3.select('.y-axis').call(this.yAxis)
    }
  }
}
</script>

<style>
.svg {
  /*background: lightgrey;*/
}

.circle {
  transition: all 1s;
}

.fade-enter-active {
  fill: green;
}

.fade-leave-active {
  fill: brown;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
