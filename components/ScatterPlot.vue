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
      transitionDuration: 500,
      zoom: null
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
      return d3.axisBottom(this.xScale).ticks((this.width / this.height) * 10)
    },
    yAxisFunction: function() {
      return d3.axisLeft(this.yScale).ticks(this.axes.y.ticks)
    }
  },
  beforeUpdate() {
    // re-draw axes
    this.drawAxes()

    // call zoom behaviour
    this.callZoomBehaviour()
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
      this.view = d3.select('.view')
      this.axes.x.element = d3.select(
        '.scatterplot-' + this.chartDomID + '-x-axis'
      )
      this.axes.y.element = d3.select(
        '.scatterplot-' + this.chartDomID + '-y-axis'
      )
    },
    drawAxes: function(zoomed = false) {
      if (zoomed) {
        // Draw X axis
        this.axes.x.element.call(
          this.xAxisFunction.scale(d3.event.transform.rescaleX(this.xScale))
        )

        // Draw Y axis
        this.axes.y.element.call(
          this.yAxisFunction.scale(d3.event.transform.rescaleY(this.yScale))
        )

        // Transform the dots (move)
        this.circlesGroup.attr('transform', d3.event.transform)
      } else {
        // Draw X axis without transformation
        this.axes.x.element.call(this.xAxisFunction)

        // Draw Y axis without transformation
        this.axes.y.element.call(this.yAxisFunction)

        // reset zoom
        this.resetZoom()
      }
    },
    callZoomBehaviour: function() {
      const that = this
      this.zoom = d3
        .zoom()
        .scaleExtent([0.5, 20])
        .extent([
          [this.chartLeft, this.chartTop],
          [this.chartRight, this.chartBottom]
        ])
        .on('zoom', () => {
          that.drawAxes(true)
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
