<template>
  <svg
    :id="chartDomID + '-svg'"
    :width="width"
    :height="height"
    class="svg heatmap"
  >
    <transition-group
      id="rects"
      tag="g"
      name="fade"
      :duration="transitionDuration"
    >
      <rect
        v-for="item in dataset"
        :key="JSON.stringify(item)"
        :x="xScale(item.x)"
        :y="yScale(item.y)"
        :width="xScale.bandwidth()"
        :height="yScale.bandwidth()"
        :style="'fill: ' + colorScale(item.v) + ';'"
        class="rect"
      ></rect>
    </transition-group>
    <g
      :class="'x-axis heatmap-' + chartDomID + '-x-axis'"
      :transform="'translate(0,' + chartBottom + ')'"
    ></g>
    <g
      :class="'y-axis heatmap-' + chartDomID + '-y-axis'"
      :transform="'translate(' + chartLeft + ', 0)'"
    ></g>
  </svg>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'HeatMap',
  props: {
    chartDomID: {
      type: String,
      default: 'heat-map'
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
    colorRange: {
      type: Array,
      default: function() {
        return ['#d7ffdb', '#006c03']
      }
    },
    padding: {
      type: Object,
      default: function() {
        return {
          top: 20,
          right: 20,
          left: 150,
          bottom: 150
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
          padding: 0.01,
          element: null
        },
        y: {
          padding: 0.01,
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
        .scaleBand()
        .domain(this.dataset.map(d => d.x).sort())
        .range([this.chartLeft, this.chartRight])
        .padding(this.axes.x.padding)
    },
    yScale: function() {
      return d3
        .scaleBand()
        .domain(this.dataset.map(d => d.y).sort())
        .range([this.chartBottom, this.chartTop])
        .padding(this.axes.y.padding)
    },
    colorScale: function() {
      return d3
        .scaleLinear()
        .range(this.colorRange)
        .domain([
          d3.min(this.dataset, function(d) {
            return d.v
          }),
          d3.max(this.dataset, function(d) {
            return d.v
          })
        ])
    },
    xAxisFunction: function() {
      return d3.axisBottom(this.xScale)
    },
    yAxisFunction: function() {
      return d3.axisLeft(this.yScale)
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
      this.svg = d3.select('.heatmap')
      this.circlesGroup = d3.select('#rects')
      this.axes.x.element = d3.select('.heatmap-' + this.chartDomID + '-x-axis')
      this.axes.y.element = d3.select('.heatmap-' + this.chartDomID + '-y-axis')
    },
    drawAxes: function() {
      // Draw X axis
      this.axes.x.element
        .call(this.xAxisFunction)
        .selectAll('text')
        .attr('class', 'body-2')
        .attr('dx', '-0.8em')
        .attr('dy', '-0.35em')
        .attr('transform', 'rotate(-90)')
        .style('text-anchor', 'end')

      // Draw Y axis
      this.axes.y.element
        .call(this.yAxisFunction)
        .selectAll('text')
        .attr('class', 'body-2')
    }
  }
}
</script>

<style scoped>
.svg {
  /*background: lightgrey;*/
}

.x-axis >>> .tick,
.y-axis >>> .tick {
  font-family: 'Roboto', sans-serif;
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
