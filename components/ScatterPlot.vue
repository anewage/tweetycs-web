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
        :duration="transitionDuration"
      >
        <circle
          v-for="item in dataset"
          :key="JSON.stringify(item)"
          :cx="xScale(item.a)"
          :cy="yScale(item.v)"
          :r="4"
          class="circle"
        ></circle>
      </transition-group>
      <g
        :class="'x-axis scatterplot-' + chartDomID + '-x-axis'"
        :transform="'translate(0,' + chartBottom + ')'"
      ></g>
      <g
        :class="'y-axis scatterplot-' + chartDomID + '-y-axis'"
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
      axes: {
        x: {
          ticks: 10,
          element: null
        },
        y: {
          ticks: 10,
          element: null
        }
      },
      transitionDuration: 500
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
            return d.a
          }),
          d3.max(this.dataset, function(d) {
            return d.a
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
            return d.v
          }),
          d3.max(this.dataset, function(d) {
            return d.v
          })
        ])
        .range([this.chartBottom, this.chartTop])
        .nice()
    },
    xAxisFunction: function() {
      return d3.axisBottom(this.xScale).ticks(this.axes.x.ticks)
    },
    yAxisFunction: function() {
      return d3.axisLeft(this.yScale).ticks(this.axes.y.ticks)
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
      this.axes.x.element = d3.select(
        '.scatterplot-' + this.chartDomID + '-x-axis'
      )
      this.axes.y.element = d3.select(
        '.scatterplot-' + this.chartDomID + '-y-axis'
      )
    },
    drawAxes: function() {
      // Draw X axis
      this.axes.x.element.call(this.xAxisFunction)

      // Draw Y axis
      this.axes.y.element.call(this.yAxisFunction)
    }
  }
}
</script>

<style>
.svg {
  /*background: lightgrey;*/
}

.circle {
  transition: all 500ms;
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
