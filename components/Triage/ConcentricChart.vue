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
          v-for="(circle, index) in numberOfTracks + 1"
          :key="index"
          :cx="0"
          :cy="0"
          :r="radiusCalculation(index)"
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
          v-for="(path, index) in parseInt(this.meta.timeUnit)"
          :key="'t-' + index"
          :stroke="line.stroke"
          :stroke-opacity="line.strokeOpacity"
          :fill="line.fill"
          stroke-dasharray="3,3"
          :d="divider(index)"
        ></path>
        <!--TimeLabels-->
        /* TODO: check the other component to implement*/
        <text
          v-for="(item, index) in parseInt(this.meta.timeUnit)"
          :key="'c-' + index"
          font-size="8"
          :transform="textTransform(index)"
        >
          {{ index + 1 }}
        </text>
      </g>
      <!--Markers-->
      <g>
        <circle
          v-for="(circle, index) in parseInt(this.meta.timeUnit)"
          :key="'c-' + index"
          :cx="PolarToCartesianX(angleScale(index), radius)"
          :cy="PolarToCartesianY(angleScale(index), radius)"
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
          fillOpacity: 0.4,
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
          stroke: '#d4dee7',
          stroke_width: '0.1',
          stroke_opacity: 0.2
        }
      }
    }
  },
  data() {
    return {
      svg: null,
      transitionDuration: 50,
      unit: 0,
      numberOfTracks: 2,
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
        // const start = this.radiusCalculation(this.numberOfTracks)
        const x0 = this.PolarToCartesianX(
          this.angleScale(d),
          this.radiusCalculation(this.numberOfTracks)
        )
        const y0 = this.PolarToCartesianY(
          this.angleScale(d),
          this.radiusCalculation(this.numberOfTracks)
        )
        const x1 = this.PolarToCartesianX(
          this.angleScale(d),
          this.radiusCalculation(0)
        )
        const y1 = this.PolarToCartesianY(
          this.angleScale(d),
          this.radiusCalculation(0)
        )
        return `M ${x0},${y0}` + `L ${x1},${y1}`
      }
    },
    textTransform: function() {
      return d => {
        const x = this.labelX({
          x0: this.angleScale(d),
          x1: this.angleScale((d + 1) % this.numberOfTracks)
        })
        const y = this.labelY({
          y0: this.angleScale(d),
          y1: this.angleScale((d + 1) % this.numberOfTracks)
        })
        return `rotate(${x - 90}) translate(${y},0) rotate(${
          x < 180 ? 0 : 180
        })`
      }
    },
    labelX: function() {
      return d => {
        return (((d.x0 + d.x1) / 2) * 180) / Math.PI
      }
    },
    labelY: function() {
      return d => {
        return (d.y0 + d.y1) / 2
      }
    },
    radiusCalculation: function() {
      return d => {
        d = this.numberOfTracks - d
        const coef = ((d + 1) * (d + 2)) / 2
        const total =
          ((this.numberOfTracks + 1) * (this.numberOfTracks + 2)) / 2
        const scale = d3
          .scaleLinear()
          .domain([0, total])
          .range([0, this.radius])
        return scale(coef)
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
    PolarToCartesianX: function(angle, radius) {
      return (radius / this.numberOfTracks) * Math.sin(-(angle + Math.PI))
    },
    PolarToCartesianY: function(angle, radius) {
      return (radius / this.numberOfTracks) * Math.cos(-(angle + Math.PI))
    }
  }
}
</script>

<style scoped></style>
