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
        tag="svg"
        name="fade"
        :duration="transitionDuration"
        :appear="true"
        :x="chartLeft"
        :y="chartTop"
        :width="chartWidth"
        :height="chartHeight"
      >
        <circle
          v-for="(item, index) in dataset"
          :key="item.name"
          :cx="xScale(item.x)"
          :cy="yScale(item.y)"
          :r="radius"
          :style="'fill: ' + colorScale(index) + ';'"
          class="circle"
        ></circle>
      </transition-group>
      <g
        :class="'axis x-axis scatterplot-' + chartDomID + '-x-axis'"
        :transform="'translate(0,' + chartBottom + ')'"
      >
        <text
          class="label"
          :transform="'translate(' + (chartWidth / 2 + 90) + ',+31)'"
        >
          {{ axesMeta.x.label }}
        </text>
      </g>
      <g
        :class="'axis y-axis scatterplot-' + chartDomID + '-y-axis'"
        :transform="'translate(' + chartLeft + ', 0)'"
      >
        <text
          class="label"
          :transform="
            'rotate(-90) translate(' + -(chartHeight / 2 - 70) + ',-45)'
          "
        >
          {{ axesMeta.y.label }}
        </text>
      </g>
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
    axesMeta: {
      type: Object,
      default: function() {
        return {
          x: {
            selector: 'x',
            label: 'User Influence'
          },
          y: {
            selector: 'y',
            label: 'Average Sentiment'
          }
        }
      }
    },
    radius: {
      type: Number,
      default: 4
    },
    colorRange: {
      type: Array,
      default: function() {
        return ['#bbd6f4', '#1c008b']
      }
    },
    dataset: {
      type: Array,
      default: function() {
        return []
      }
    },
    datasetLimit: {
      type: Number,
      default: 100
    },
    padding: {
      type: Object,
      default: function() {
        return {
          top: 10,
          right: 10,
          left: 60,
          bottom: 40
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
      zoom: null,
      transform: d3.zoomIdentity,
      transitionDuration: 2000
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
        .range(this.colorRange)
        .domain([0, this.datasetLimit])
    },
    xAxisFunction: function() {
      // return d3.axisBottom(this.xScale).ticks((this.width / this.height) * 10)
      return d3
        .axisBottom(this.xScale)
        .tickSize(-this.chartHeight)
        .ticks((this.width / this.height) * 10)
    },
    yAxisFunction: function() {
      return d3
        .axisLeft(this.yScale)
        .tickSize(-this.chartWidth)
        .ticks(this.axes.y.ticks)
      // return d3.axisLeft(this.yScale).tickSize(this.chartHeight)
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

<style scoped>
.svg {
  /*background: lightgrey;*/
}

.view {
  fill: transparent;
}

/* Gridlines */
.axis >>> .tick line {
  stroke: #e6deec;
  stroke-dasharray: 1;
}

/* Axis Labels */
.axis >>> .label {
  fill: #35495e;
  font-size: large;
  font-weight: bolder;
  text-anchor: end;
}

.svg >>> .fade-enter {
  opacity: 0;
}

.svg >>> .fade-enter-to {
  opacity: 100%;
  fill: green;
}

.svg >>> .fade-leave {
  opacity: 100%;
}

.svg >>> .fade-leave-to {
  opacity: 0;
  fill: red;
}

.svg >>> .circle {
  transition: opacity 1800ms, fill 1800ms;
  -webkit-transition: opacity 1800ms, fill 1800ms;
}
</style>
