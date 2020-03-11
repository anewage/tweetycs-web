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
          stroke-dasharray="3,7"
          :d="divider(index)"
        ></path>
        <!--TimeLabels-->
        /* TODO: check the other component to implement*/
        <text
          v-for="(item, index) in parseInt(this.meta.timeUnit)"
          :key="'c-' + index"
          font-size="7"
          :transform="textTransform(index)"
          opacity="0.6"
        >
          {{ index + 1 }}
        </text>
      </g>
      <!--Bubbles-->
      <g v-for="user in this.users" :key="user.screen_name">
        <circle
          v-for="(tweet, index) in user.tweets"
          :key="index"
          :cx="
            PolarToCartesianX(angleScale(tweetTime(tweet).first), radius / 2)
          "
          :cy="
            PolarToCartesianY(angleScale(tweetTime(tweet).first), radius / 2)
          "
          :r="circleSize"
          :stroke="token.stroke"
          :stroke-opacity="token.strokeOpacity"
          :stroke-width="token.strokeSize"
          :fill="circleFill(user.screen_name)"
          :fill-opacity="token.opacity"
        />
      </g>
      <!--Markers-->
      <!--      <g>
        <circle
          v-for="(circle, index) in parseInt(this.meta.timeUnit)"
          :key="'c-' + index"
          :cx="PolarToCartesianX(angleScale(index), radius)"
          :cy="PolarToCartesianY(angleScale(index), radius)"
          r="5"
          fill="white"
        ></circle>
      </g>-->
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
    numberOfTracks: {
      type: Number,
      default: function() {
        return 3
      }
    },
    axis: {
      type: Object,
      default: function() {
        return {
          show: true,
          fill: '#eef1f1',
          fillOpacity: 0.4,
          stroke: '#bed2ec',
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
    },
    token: {
      type: Object,
      default: function() {
        return {
          size: '10',
          color: '#d6d0bc',
          opacity: '0.7',
          strokeSize: '0.8',
          strokeOpacity: '0.8',
          strokeColor: '#6eecbf'
        }
      }
    }
  },
  data() {
    return {
      svg: null,
      transitionDuration: 50,
      unit: 0,
      // numberOfTracks: this.,
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
        const x0 = this.PolarToCartesianX(
          this.angleScale(d),
          this.radiusCalculation(0)
        )
        const y0 = this.PolarToCartesianY(
          this.angleScale(d),
          this.radiusCalculation(0)
        )
        const x1 = this.PolarToCartesianX(
          this.angleScale(d),
          this.radiusCalculation(this.numberOfTracks)
        )
        const y1 = this.PolarToCartesianY(
          this.angleScale(d),
          this.radiusCalculation(this.numberOfTracks)
        )
        return `M ${x0},${y0}` + `L ${x1},${y1}`
      }
    },
    textTransform: function() {
      return d => {
        const x = this.labelX({
          x0: this.angleScale(d),
          x1: this.angleScale(d + 1)
        })
        // margin is defined for symmetric distances to circle in both sides
        const margin = x < 180 ? 0.9 : 0.95
        const y = this.labelY({
          // to bring labels in the inner ares: radiusCalculation(0)
          y0: this.radiusCalculation(this.numberOfTracks) * margin,
          y1: this.radiusCalculation(this.numberOfTracks)
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
    /**
     * Returns the radius of the i th track (recent tracks have larger index)
     * to change the ratio of radius, we should change this function
     * radius(d) = coef * r
     */
    radiusCalculation: function() {
      return d => {
        const coef = ((d + 1) * (d + 2)) / 2
        const total =
          ((this.numberOfTracks + 1) * (this.numberOfTracks + 2)) / 2
        const scale = d3
          .scaleLinear()
          .domain([0, total])
          .range([this.radius / total, this.radius])
        return scale(coef)
      }
    },
    circleFill: function() {
      return d => {
        return this.colorToken(d)
      }
    },
    circleSize: function() {
      return this.radius * 0.02
    },
    colorToken: function() {
      const that = this
      return d3.scaleOrdinal(
        d3.quantize(d3.interpolateCubehelixDefault, that.users.length)
      )
    },
    time: function() {
      return date => {
        const d = new Date(date)
        return {
          millisecond: d.getUTCMilliseconds(),
          second: d.getUTCSeconds(),
          minute: d.getUTCMinutes(),
          hour: d.getUTCHours(),
          day: d.getUTCDay(),
          date: d.getUTCDate(),
          month: d.getUTCMonth(),
          year: d.getUTCFullYear()
        }
      }
    },
    /**
     * Returns the place of a user on the stack of users in each epoch
     * this will feed radius of PolarToCartesianX/Y(angel, radius) for placing a circle
     */
    stackScale: function() {
      return (d, track) => {
        const scale = d3
          .scaleLinear()
          .domain([0, this.users.length])
          .range([
            this.radiusCalculation(track - 1) + this.circleSize(),
            this.radiusCalculation(track) - this.circleSize()
          ])
        return scale(d)
      }
    },
    /**
     * Returns time of a tweet based on the selected time unit,
     * first is the value of selected time unit
     * second will be used to make the VR more precised
     */
    tweetTime: function() {
      return tweet => {
        const tm = this.time(tweet.created_at)
        const temp = {}
        if (this.meta.timeUnit === '12') {
          temp.first = tm.month + 1
          temp.second = tm.date
        } else if (this.meta.timeUnit === '30') {
          temp.first = tm.date
          temp.second = tm.hour
        } else if (this.meta.timeUnit === '7') {
          temp.first = tm.day
          temp.second = tm.hour
        } else if (this.meta.timeUnit === '24') {
          temp.first = tm.hour
          temp.second = tm.minute
        } else if (this.meta.timeUnit === '60') {
          temp.first = tm.minute
          temp.second = tm.second
        }
        // eslint-disable-next-line no-console
        console.log(temp)
        return temp
      }
    }
    /**
     *
     */
    // TODO: another scale function is needed to find the angle of a circle among a period of time
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
      return radius * Math.sin(-(angle + Math.PI))
    },
    PolarToCartesianY: function(angle, radius) {
      return radius * Math.cos(-(angle + Math.PI))
    }
  }
}
</script>

<style scoped></style>
