<template>
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
      :x="chartLeft"
      :y="chartTop"
      :width="chartWidth"
      :height="chartHeight"
      :duration="transitionDuration"
      :appear="true"
    >
      <circle
        v-for="(item, index) in dataset"
        :key="item.name"
        :cx="xScale(item[axesMeta.x.selector])"
        :cy="yScale(item[axesMeta.y.selector])"
        :r="radius"
        :style="'fill: ' + colorScale(index) + ';'"
        class="circle"
      ></circle>
    </transition-group>
    <g
      :class="'axis x-axis scatterplot-' + chartDomID + '-x-axis'"
      :transform="'translate(' + chartLeft + ',' + chartBottom + ')'"
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
      :transform="'translate(' + chartLeft + ',' + chartTop + ')'"
    >
      <text
        class="label"
        :transform="
          'rotate(-90) translate(' + -(chartHeight / 2 - 70) + ',-25)'
        "
      >
        {{ axesMeta.y.label }}
      </text>
    </g>
  </svg>
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
            zoomEnabled: true,
            label: 'User Influence'
          },
          y: {
            selector: 'y',
            zoomEnabled: true,
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
    padding: {
      type: Object,
      default: function() {
        return {
          top: 5,
          right: 5,
          left: 40,
          bottom: 40
        }
      }
    },
    transform: {
      type: Object,
      default: function() {
        return d3.zoomIdentity
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
      const selector = this.axesMeta.x.selector
      const x = d3
        .scaleLinear()
        .domain([
          d3.min(this.dataset, function(d) {
            return d[selector]
          }),
          d3.max(this.dataset, function(d) {
            return d[selector]
          })
        ])
        .range([0, this.chartWidth])
        .nice()
      if (this.axesMeta.x.zoomEnabled) return this.transform.rescaleX(x)
      else return x
    },
    yScale: function() {
      const selector = this.axesMeta.y.selector
      const y = d3
        .scaleLinear()
        .domain([
          d3.min(this.dataset, function(d) {
            return d[selector]
          }),
          d3.max(this.dataset, function(d) {
            return d[selector]
          })
        ])
        .range([this.chartHeight, 0])
        .nice()
      if (this.axesMeta.y.zoomEnabled) return this.transform.rescaleY(y)
      else return y
    },
    colorScale: function() {
      return d3
        .scaleLinear()
        .range(this.colorRange)
        .domain([0, this.dataset.length - 1])
    },
    xAxisFunction: function() {
      return d3
        .axisBottom(this.xScale)
        .tickSize(-this.chartHeight)
        .ticks((this.width / this.height) * 10)
      // return d3.axisBottom(this.xScale).ticks((this.width / this.height) * 10)
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
        that.$emit('zoomed', d3.event.transform)
        // that.transform = d3.event.transform
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
  fill: currentColor;
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
  transition: opacity 1800ms, fill 1800ms, cy 1800ms;
  -webkit-transition: opacity 1800ms, fill 1800ms, cy 1800ms;
}
</style>
