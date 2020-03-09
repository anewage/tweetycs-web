<template>
  <svg
    :id="chartDomID + '-svg'"
    :width="meta.width"
    :height="meta.height"
    :fill-opacity="meta.fillOpacity"
    class="svg concentric"
  >
    <!--ConcentricCalendar-->
    <g
      id="concentricCalendar"
      :duration="transitionDuration"
      :transform="'translate(' + radius + ',' + radius + ')'"
    >
      <!--ConcentricAxis-->
      <g>
        <circle
          v-for="(circle, index) in numberOfTracks"
          :key="index"
          :cx="0"
          :cy="0"
          :r="(radius * (numberOfTracks - index)) / numberOfTracks"
          :fill="axis.fill"
          :opacity="axis.fillOpacity"
          :stroke="axis.stroke"
          :stroke-width="axis.stroke_width"
          :stroke-opacity="axis.strokeOpacity"
        />
      </g>
      <!--RadialAxis-->
      <g>
        <path
          v-for="(item, index) in parseInt(this.meta.timeUnit)"
          :key="'t-' + index"
          :stroke="line.stroke"
          :stroke-opacity="line.strokeOpacity"
          :fill="line.fill"
          :d="divider(index)"
        ></path>
        <!--TimeLabels-->
        // TODO: check the other component to implement
        <text
          v-for="(circle, index) in parseInt(this.meta.timeUnit)"
          :key="'c-' + index"
          font-size="8"
          :x="
            PolarToCartesianX((angleScale(index) + angleScale(index + 1)) / 2) *
              3.9
          "
          :y="
            PolarToCartesianY((angleScale(index) + angleScale(index + 1)) / 2) *
              3.9
          "
        >
          {{ index + 1 }}
        </text>
      </g>
      <!--Markers-->
      <g>
        <circle
          v-for="(circle, index) in parseInt(this.meta.timeUnit)"
          :key="'c-' + index"
          :cx="PolarToCartesianX(angleScale(index))"
          :cy="PolarToCartesianY(angleScale(index))"
          r="5"
          fill="white"
        ></circle>
      </g>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'ConcentricChart',
  props: {
    chartDomID: {
      type: String,
      default: 'concentric-chart'
    },
    topics: {
      type: Array,
      default: function() {
        return []
      }
    },
    meta: {
      type: Object,
      default: function() {
        return {
          id: 'concentric-chart',
          label: 'Agent-Time Association ',
          width: 500,
          height: 500,
          fillOpacity: 0.6,
          timeUnit: 12
        }
      }
    },
    users: {
      type: Array,
      default: function() {
        return []
      }
    },
    axis: {
      type: Object,
      default: function() {
        return {
          show: true,
          fill: '#eef1f1',
          fillOpacity: 0.8,
          stroke: '#d9e3ec',
          stroke_width: '0.8',
          stroke_opacity: 0.9
        }
      }
    },
    line: {
      type: Object,
      default: function() {
        return {
          show: true,
          fill: '#869bb4',
          fillOpacity: 0.5,
          stroke: '#ccd6df',
          stroke_width: '0.1',
          stroke_opacity: 0.5
        }
      }
    }
  },
  data() {
    return {
      svg: null,
      transitionDuration: 50,
      unit: 0,
      numberOfTracks: 4,
      innerRCoefficient: 1,
      outerRCoefficient: 1
    }
  },
  computed: {
    angleScale() {
      const temp = d3
        .scaleLinear()
        .domain([0, parseInt(this.meta.timeUnit)])
        .range([0, 2 * Math.PI])
      return temp
    },
    radius: function() {
      return Math.min(this.meta.width) / 2
    },
    innerRadius: function() {
      return this.radius / 3
    },
    outerRadius: function() {
      return this.radius / 2
    },
    divider: function() {
      return d => {
        const x = this.PolarToCartesianX(this.angleScale(d))
        const y = this.PolarToCartesianY(this.angleScale(d))
        return `M ${x},${y}` + `L ${4 * x},${4 * y}`
      }
    }
  },
  mounted() {
    this.setupSVG()
  },
  methods: {
    setupSVG: function() {
      this.svg = d3.select('.concentric')
    },
    /**
     * @return {number}
     */
    PolarToCartesianX(angle) {
      return (this.radius / this.numberOfTracks) * Math.sin(-(angle + Math.PI))
    },
    PolarToCartesianY(angle) {
      return (this.radius / this.numberOfTracks) * Math.cos(-(angle + Math.PI))
    }
  }
}
</script>

<style scoped></style>
