<template>
  <svg
    :id="chartDomID + '-svg'"
    :width="meta.width"
    :height="meta.height"
    :fill-opacity="meta.fillOpacity"
    class="svg concentric"
  >
    <!--ConcentricCalendar-->
    <g id="concentricCalendar" :duration="transitionDuration">
      <!--ConcentricAxis-->
      <g
        v-for="(circle, index) in numberOfTracks"
        :key="index"
        :transform="'translate(' + radius + ',' + radius + ')'"
      >
        <circle
          :cx="0"
          :cy="0"
          :r="(radius * (index + 1)) / numberOfTracks"
          :fill="axis.fill"
          :opacity="axis.fillOpacity"
          :stroke="axis.stroke"
          :stroke-width="axis.stroke_width"
          :stroke-opacity="axis.strokeOpacity"
        />
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
    axis: {
      type: Object,
      default: function() {
        return {
          show: true,
          fill: '#869bb4',
          fillOpacity: 0.1,
          stroke: '#506479',
          stroke_width: '0.8',
          stroke_opacity: 0.9
        }
      }
    }
  },
  data() {
    return {
      svg: null,
      transitionDuration: 50,
      unit: 0,
      numberOfTracks: 3,
      innerRCoefficient: 1,
      outerRCoefficient: 1
    }
  },
  computed: {
    angleScale() {
      const temp = d3
        .scaleLinear()
        .domain([0, this.meta.timeUnit - 1])
        .range([0, 2 * Math.PI])
      // eslint-disable-next-line no-console
      console.log(temp(1), temp(2), temp(6), temp(11), temp(12), temp(13))
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
    yAxis: function() {
      return d => {
        d3.scaleLinear(d)
          .domain([0, 2])
          .range([this.innerRadius, this.outerRadius])
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
      // eslint-disable-next-line no-console
      console.log(angle, 2 * Math.PI)
      return (this.radius / this.numberOfTracks) * Math.sin(-(angle + Math.PI))
    },
    PolarToCartesianY(angle) {
      // eslint-disable-next-line no-console
      console.log(angle, 2 * Math.PI)
      return (this.radius / this.numberOfTracks) * Math.cos(-(angle + Math.PI))
    }
  }
}
</script>

<style scoped></style>
