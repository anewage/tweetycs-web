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
      :transform="'translate(' + radius + ',' + chartTopPadding + ')'"
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
        <!--ConcentricLabels-->
        <text
          v-for="(circle, index) in numberOfTracks + 1"
          :key="index"
          :font-size="2 * radiusCalculation(index) ** 0.3"
          opacity="0.5"
          fill="#354452"
          :transform="
            'translate(' + '0' + ',' + concentricTransform(circle) + ')'
          "
        >
          {{ concentricLables(circle).title }}
          {{ concentricLables(circle).label }}
        </text>
        >
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
        <!--TimeSlotLabels-->
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
      <!--TOKENS-->
      <g>
        <circle
          v-for="(candid, index) in this.candidates"
          :key="index"
          :cx="
            PolarToCartesianX(
              angleScale(findTrack(candid.tweet)),
              tokenPlacement(candid.tweet, candid.index)
            )
          "
          :cy="
            PolarToCartesianY(
              angleScale(findTrack(candid.tweet)),
              tokenPlacement(candid.tweet, candid.index)
            )
          "
          :r="circleSize"
          :stroke="token.stroke"
          :stroke-opacity="token.strokeOpacity"
          :stroke-width="token.strokeSize"
          :fill="circleFill(candid.index)"
          :fill-opacity="token.opacity"
        >
          <title>{{ candid.index }}</title>
        </circle>
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
          timeUnit: 12,
          padding: { top: 0, bottom: 0, left: 0, right: 0 }
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
          stroke: '#829ba8',
          stroke_width: '1',
          stroke_opacity: 0.9
        }
      }
    },
    line: {
      type: Object,
      default: function() {
        return {
          show: true,
          fill: '#7f93ac',
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
        // circlePadding is defined for symmetric distances to circle in both sides
        const circlePadding = x < 180 ? 1.02 : 1.06
        const y = this.labelY({
          // to bring labels in the inner ares: radiusCalculation(0)
          y0: this.radiusCalculation(this.numberOfTracks) * circlePadding,
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
    concentricLables: function() {
      return d => {
        const now = new Date()
        let label = null
        let title = null
        let pre = ''
        if (this.meta.timeUnit === '12') {
          title = 'Year'
          label = now.getFullYear() - this.numberOfTracks + d
        } else if (this.meta.timeUnit === '30') {
          title = 'Month'
          label = now.getMonth() - this.numberOfTracks + d + 1
          if (label < 1) while (label < 1) label += 12
        } else if (this.meta.timeUnit === '7') {
          pre = 'Past '
          title = 'Week'
          label = this.numberOfTracks - d
        } else if (this.meta.timeUnit === '24') {
          pre = 'Past '
          title = 'Day'
          label = this.numberOfTracks - d
        } else if (this.meta.timeUnit === '60') {
          pre = 'Past '
          title = 'Hour'
          label = this.numberOfTracks - d
        }
        if (label === 0) {
          pre = this.meta.timeUnit === '24' ? 'To' : 'This '
          label = ''
        }
        title = pre + title
        return { title: title, label: label }
      }
    },
    concentricTransform: function() {
      return d => {
        const circlePadding = 1 * 0.95
        return this.radiusCalculation(d) * circlePadding * -1
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
            this.radiusCalculation(track - 1) + this.circleSize,
            this.radiusCalculation(track) - this.circleSize
          ])
        return scale(d)
      }
    },
    minDate: function() {
      let temp = 0
      if (this.meta.timeUnit === '12') {
        // years ago
        temp = 365 * 24 * 60 * 60 * 1000
      } else if (this.meta.timeUnit === '30') {
        // months ago
        temp = 30 * 24 * 60 * 60 * 1000
      } else if (this.meta.timeUnit === '7') {
        // weeks ago
        temp = 7 * 24 * 60 * 60 * 1000
      } else if (this.meta.timeUnit === '24') {
        // days ago
        temp = 24 * 60 * 60 * 1000
      } else if (this.meta.timeUnit === '60') {
        // hours ago
        temp = 60 * 60 * 1000
      }
      return new Date(this.maxDate.getTime() - temp * this.numberOfTracks)
    },
    candidates: function() {
      const array = []
      for (const userIndex in this.users) {
        for (const tweet of this.users[userIndex].tweets) {
          const date = new Date(tweet.created_at)
          if (
            this.minDate.getTime() < date.getTime() &&
            date.getTime() < this.maxDate.getTime()
          ) {
            array.push({ index: userIndex, tweet: tweet })
          }
        }
      }
      return array
    },
    maxDate: function() {
      const date = new Date()
      return date
    },
    findTrack: function() {
      return tweet => {
        const tweetDate = new Date(tweet.created_at)
        let temp = 0
        if (this.meta.timeUnit === '12') {
          // years ago
          temp = 365 * 24 * 60 * 60 * 1000
        } else if (this.meta.timeUnit === '30') {
          // months ago
          temp = 30 * 24 * 60 * 60 * 1000
        } else if (this.meta.timeUnit === '7') {
          // weeks ago
          temp = 7 * 24 * 60 * 60 * 1000
        } else if (this.meta.timeUnit === '24') {
          // days ago
          temp = 24 * 60 * 60 * 1000
        } else if (this.meta.timeUnit === '60') {
          // hours ago
          temp = 60 * 60 * 1000
        }
        const elapse = Math.ceil(
          (this.maxDate.getTime() - tweetDate.getTime()) / temp
        )
        return this.numberOfTracks + 1 - elapse
      }
    },
    chartTopPadding: function() {
      return this.meta.padding.top + this.radius
    },
    /**
     * Returns the radius at which the user should be placed (stackScale(index,track) + radiusCalculation(track))
     */
    tokenPlacement: function() {
      return (tweet, userIndex) => {
        const track = this.findTrack(tweet)
        return track + this.stackScale(userIndex, track)
      }
    }
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
