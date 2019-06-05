<template>
  <div :id="chartDomID">
    <svg
      :id="chartDomID + '-svg'"
      :width="width"
      :height="height"
      class="svg scatterplot"
    >
      <rect
        class="view"
        :x="chartLeft"
        :y="chartTop"
        :width="chartWidth"
        :height="chartHeight"
      ></rect>
      <!--      <transition-group-->
      <!--        id="circles"-->
      <!--        tag="g"-->
      <!--        name="fade"-->
      <!--        :duration="transitionDuration"-->
      <!--      >-->
      <g id="circles">
        <circle
          v-for="(item, index) in dataset"
          :key="item.name"
          :cx="xScale(item.x)"
          :cy="yScale(item.y)"
          :r="3"
          class="circle"
          :style="'fill: ' + colorScale(index) + ';'"
        ></circle>
        <!--      </transition-group>-->
      </g>
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
      view: null,
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
      transitionDuration: 0,
      zoom: null,
      transform: d3.zoomIdentity
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
      const x = d3
        .scaleLinear()
        .domain([
          d3.min(this.dataset, function(d) {
            return d.x
          }),
          5
        ])
        .range([this.chartLeft, this.chartRight])
        .nice()
      return this.transform.rescaleX(x)
    },
    yScale: function() {
      const y = d3
        .scaleLinear()
        .domain([
          d3.min(this.dataset, function(d) {
            return d.y
          }),
          d3.max(this.dataset, function(d) {
            return d.y
          })
        ])
        .range([this.chartBottom, this.chartTop])
        .nice()
      return this.transform.rescaleY(y)
    },
    colorScale: function() {
      return d3
        .scaleLinear()
        .range(['#2c475d', '#c0e5be'])
        .domain([0, 300])
    },
    xAxisFunction: function() {
      return d3.axisBottom(this.xScale).ticks((this.width / this.height) * 10)
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

    // call zoom behaviour
    this.callZoomBehaviour()
  },
  methods: {
    setupSVG: function() {
      // Select the SVG element
      this.svg = d3.select('.scatterplot')
      this.circlesGroup = d3.select('#circles')
      this.view = d3.select('.view')
      this.axes.x.element = d3.select(
        '.scatterplot-' + this.chartDomID + '-x-axis'
      )
      this.axes.y.element = d3.select(
        '.scatterplot-' + this.chartDomID + '-y-axis'
      )
    },
    drawAxes: function() {
      // Draw X axis without transformation
      this.axes.x.element.call(this.xAxisFunction)

      // Draw Y axis without transformation
      this.axes.y.element.call(this.yAxisFunction)

      // reset zoom
      // this.resetZoom()
    },
    callZoomBehaviour: function() {
      const that = this
      this.zoom = d3.zoom().on('zoom', () => {
        that.transform = d3.event.transform
      })
      this.view.call(this.zoom)
    },
    resetZoom: function() {
      // reset the zoom
      if (this.zoom) this.view.call(this.zoom.transform, d3.zoomIdentity)
    }
  }
}
</script>

<style>
.svg {
  /*background: lightgrey;*/
}

.view {
  fill: transparent;
  stroke: none;
}
</style>
