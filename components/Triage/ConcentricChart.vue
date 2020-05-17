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
        <!--ConcentricAxisLabels-->
        <text
          v-for="(circle, index) in numberOfTracks"
          :key="`label-${index}`"
          :font-size="2 * radiusCalculation(circle) ** 0.3"
          :opacity="label.opacity"
          :fill="label.fill"
          :transform="
            'translate(' + '0' + ',' + concentricTransform(circle) + ')'
          "
        >
          {{ concentricLabels(circle) }}
        </text>
      </g>
      <!--RadialAxis-->
      <g>
        <path
          v-for="(path, index) in parseInt(meta.timeUnit)"
          :key="'t-' + index"
          :stroke="line.stroke"
          :stroke-opacity="line.strokeOpacity"
          :fill="line.fill"
          stroke-dasharray="3,7"
          :d="divider(index)"
        ></path>
        <!--TimeSlotLabels-->
        <text
          v-for="(item, index) in parseInt(meta.timeUnit)"
          :key="'c-' + index"
          :font-size="label.fontSize"
          :transform="textTransform(index)"
          :opacity="label.opacity"
          :fill="label.fill"
        >
          {{ timeSlotLabel(index) }}
        </text>
      </g>
      <!--TOKENS-->
      <g>
        <circle
          v-for="(candid, index) in candidates"
          :key="index"
          :cx="
            PolarToCartesianX(
              tokenRadialScale(findTimeSlot(candid.tweetTime)),
              totalDistance(candid.tweet, candid.userIndex)
            )
          "
          :cy="
            PolarToCartesianY(
              tokenRadialScale(findTimeSlot(candid.tweetTime)),
              totalDistance(candid.tweet, candid.userIndex)
            )
          "
          :r="circleSize"
          :stroke="token.stroke"
          :stroke-opacity="token.strokeOpacity"
          :stroke-width="token.strokeSize"
          :fill="circleFill(candid.userIndex)"
          :fill-opacity="token.opacity"
        >
          <!-- <title>{{ candid.name }}</title>-->
          <title>{{ candid.tweet.created_at }}</title>
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
          color: '#829ba8',
          opacity: '0.7',
          strokeSize: '0.8',
          strokeOpacity: '0.8',
          strokeColor: '#6eecbf'
        }
      }
    },
    label: {
      type: Object,
      default: function() {
        return {
          fontSize: '10',
          fill: '#104842',
          opacity: '0.7'
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
    radius: function() {
      return Math.min(this.meta.width) / 2
    },
    /**
     * Returns labels of outer circle based on selected time unit(e.g. Jan - Dec , or Sun - Sat)
     **/
    concentricLabels: function() {
      return d => {
        const now = new Date()
        let label = null
        let title = null
        if (this.meta.timeUnit === '12') {
          label = now.getFullYear() - this.numberOfTracks + d
          title = `Year ${label}`
        } else if (this.meta.timeUnit === '30') {
          label = now.getMonth() - this.numberOfTracks + d + 1
          if (label < 1) while (label < 1) label += 12
          const monthNames = [
            'Jan.',
            'Feb.',
            'Mar.',
            'Apr.',
            'May',
            'Jun.',
            'Jul.',
            'Aug.',
            'Sept.',
            'Oct.',
            'Nov.',
            'Dec.'
          ]
          title = `${monthNames[label - 1]}`
        } else if (this.meta.timeUnit === '7') {
          label = this.numberOfTracks - d
          title = label === 0 ? 'This Week' : `${label} Week Ago`
        } else if (this.meta.timeUnit === '24') {
          label = this.numberOfTracks - d
          title = label === 0 ? 'Today' : `${label} Day Ago`
        } else if (this.meta.timeUnit === '60') {
          label = this.numberOfTracks - d
          title = label === 0 ? 'This Hour' : `${label} Hour Ago`
        }
        return title
      }
    },
    /**
     * Places the label of each tracks on its circle (e.g. Year 2020 , Year 2019, ...)
     **/
    concentricTransform: function() {
      return d => {
        const circlePadding = 0.9
        return this.radiusCalculation(d) * circlePadding * -1
      }
    },
    /**
     * Returns the radius of the i th track (tracks for recent time have larger index)
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
    /**
     * Places the label of each time slot based on selected unit time around the outer circle
     **/
    labelAngleScale() {
      return d3
        .scaleLinear()
        .domain([0, parseInt(this.meta.timeUnit)])
        .range([0, 2 * Math.PI])
    },
    /**
     * draw lines to divide to the number of selected unit time
     **/
    divider: function() {
      return d => {
        const x0 = this.PolarToCartesianX(
          this.labelAngleScale(d),
          this.radiusCalculation(0)
        )
        const y0 = this.PolarToCartesianY(
          this.labelAngleScale(d),
          this.radiusCalculation(0)
        )
        const x1 = this.PolarToCartesianX(
          this.labelAngleScale(d),
          this.radiusCalculation(this.numberOfTracks)
        )
        const y1 = this.PolarToCartesianY(
          this.labelAngleScale(d),
          this.radiusCalculation(this.numberOfTracks)
        )
        return `M ${x0},${y0}` + `L ${x1},${y1}`
      }
    },
    /**
     * Places time slot labels based on selected unit time
     **/
    textTransform: function() {
      return d => {
        const clockFormat = !!(
          this.meta.timeUnit === '24' || this.meta.timeUnit === '60'
        )
        const x = !clockFormat
          ? this.labelX({
              x0: this.labelAngleScale(d),
              x1: this.labelAngleScale(d + 1)
            })
          : this.labelX({
              x0: this.labelAngleScale(d),
              x1: this.labelAngleScale(d)
            })
        // circlePadding is defined for symmetric distances to circle in both sides
        const textLabel =
          this.meta.timeUnit === '7' || this.meta.timeUnit === '12' ? 0.06 : 0
        const circlePadding = x < 180 ? 1.03 : 1.09 + textLabel
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
    /**
     * Places the label of each tracks on its circle (e.g. Year 2020 , Year 2019, ...)
     **/
    timeSlotLabel: function() {
      return d => {
        if (this.meta.timeUnit === '12') {
          const monthNames = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
          ]
          return monthNames[d]
        }
        if (this.meta.timeUnit === '7') {
          const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
          return weekDays[d]
        }
        if (this.meta.timeUnit === '24' || this.meta.timeUnit === '60') return d
        return d + 1
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
    // TODO: temp is not accurate ( doesn't consider 31 day months and ...)
    /**
     * value of the selected time unit in ms
     **/
    unitRange: function() {
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
      return temp
    },
    /**
     * Scales a token on its track
     **/
    tokenRadialScale() {
      return d3
        .scaleLinear()
        .domain([0, this.unitRange])
        .range([0, 2 * Math.PI])
    },
    circleFill: function() {
      return d => {
        return this.colorToken(d)
      }
    },
    circleSize: function() {
      return this.radius * 0.015
    },
    colorToken: function() {
      const that = this
      return d3.scaleOrdinal(
        d3.quantize(d3.interpolateTurbo, that.numberOfCandidateUsers)
      )
    },
    /**
     * Returns the place of a user on the stack of users in each track
     * this will feed radius of PolarToCartesianX/Y(angle, radius) for placing a token
     **/
    usersStackScale: function() {
      return (userIndex, track) => {
        const scale = d3
          .scaleLinear()
          .domain([0, this.numberOfCandidateUsers + 1])
          .range([
            1.5 * this.circleSize,
            this.radiusCalculation(track + 1) -
              this.radiusCalculation(track) -
              this.circleSize * 1.5
          ])
        return scale(userIndex)
      }
    },
    /**
     * the value of minimum acceptable date in ms
     **/
    minDate: function() {
      let temp = 0
      const now = new Date()
      if (this.meta.timeUnit === '12') {
        // years ago
        temp =
          new Date(now.getFullYear() + 1, 0, 1) -
          new Date(now.getFullYear() - (this.numberOfTracks - 1), 0, 1)
      } else if (this.meta.timeUnit === '30') {
        // months ago
        temp =
          new Date(now.getFullYear(), now.getMonth() + 1, 1) -
          new Date(
            now.getFullYear(),
            now.getMonth() - (this.numberOfTracks - 1),
            1
          )
      } else if (this.meta.timeUnit === '7') {
        // weeks ago
        temp =
          new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() + ((7 - now.getDay()) % 7)
          ) -
          new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - (this.numberOfTracks - 1) * 7
          )
      } else if (this.meta.timeUnit === '24') {
        // Days ago
        temp =
          new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1) -
          new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate() - (this.numberOfTracks - 1)
          )
      } else if (this.meta.timeUnit === '60') {
        // hours ago
        temp =
          new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours()
          ) -
          new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            now.getHours() - (this.numberOfTracks - 1)
          )
      }
      temp = new Date(this.maxDate.getTime() - temp)
      return temp
    },
    /**
     * List of tweets that can be shown based on selected time unit and number of tracks
     **/
    candidates: function() {
      const array = []
      let newIndex = 0
      for (const userIndex in this.users) {
        for (const tweet of this.users[userIndex].tweets) {
          const date = new Date(tweet.created_at)
          if (
            this.minDate.getTime() < date.getTime() &&
            date.getTime() < this.maxDate.getTime()
          ) {
            array.push({
              index: newIndex,
              userIndex: userIndex,
              name: this.users[userIndex].screen_name,
              tweet: tweet,
              tweetTime: tweet.created_at
            })
            newIndex += 1
          }
        }
      }
      return array
    },
    /**
     * Number of users that their tweets are in candidates tweets
     **/
    numberOfCandidateUsers: function() {
      const usersArray = []
      for (const tweet of this.candidates)
        if (!usersArray.includes(tweet.name)) usersArray.push(tweet.name)
      return usersArray.length
    },
    maxDate: function() {
      return new Date()
    },
    /**
     * Returns number of the track for a token
     **/
    findTrack: function() {
      return tweet => {
        return (
          this.numberOfTracks -
          Math.floor(
            (new Date().getTime() - new Date(tweet.created_at).getTime()) /
              this.unitRange
          ) -
          1
        )
      }
    },
    /**
     * Returns the distance of a tweet from the beginning of its corresponded track
     * to feed the tokenRadialScale()
     **/
    findTimeSlot: function() {
      return tweetTime => {
        let temp = null
        const twYear = new Date(tweetTime).getFullYear()
        const twMonth = new Date(tweetTime).getMonth()
        const twDate = new Date(tweetTime).getDate()
        const twDay = new Date(tweetTime).getDay()
        const twHour = new Date(tweetTime).getHours()
        const time = new Date(tweetTime).getTime()
        if (this.meta.timeUnit === '12') {
          // years beginning
          temp = time - new Date(twYear, 0, 1).getTime()
        } else if (this.meta.timeUnit === '30') {
          // months beginning
          temp = time - new Date(twYear, twMonth, 1).getTime()
        } else if (this.meta.timeUnit === '7') {
          // weeks beginning
          temp = time - new Date(twYear, twMonth, twDate - twDay).getTime()
        } else if (this.meta.timeUnit === '24') {
          // Days beginning
          temp = time - new Date(twYear, twMonth, twDate, 0, 0, 0, 0).getTime()
        } else if (this.meta.timeUnit === '60') {
          // hours beginning
          temp =
            time - new Date(twYear, twMonth, twDate, twHour, 0, 0, 0).getTime()
        }
        return temp
      }
    },
    /**
     * Returns the radius at which the user should be placed (stackScale(index,track) + radiusCalculation(track))
     **/
    totalDistance: function() {
      return (tweet, userIndex) => {
        const track = this.findTrack(tweet)
        return (
          this.radiusCalculation(track) + this.usersStackScale(userIndex, track)
        )
      }
    },
    chartTopPadding: function() {
      return this.meta.padding.top + this.radius
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
      return radius * Math.sin(-(angle + Math.PI))
    },
    PolarToCartesianY: function(angle, radius) {
      return radius * Math.cos(-(angle + Math.PI))
    }
  }
}
</script>

<style scoped></style>
