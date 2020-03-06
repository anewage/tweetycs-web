<template>
  <svg
    :id="chartDomID + '-svg'"
    :width="meta.width"
    :height="meta.height"
    :fill-opacity="meta.fillOpacity"
    class="svg chord"
  >
    <!--SUNBURST-->
    <g
      id="sunburstSlices"
      :duration="transitionDuration"
      :transform="'translate(' + radius + ',' + radius + ')'"
    >
      <!--SLICES-->
      <g v-for="(arc, index) in root" :key="index">
        <path
          class="line"
          :fill="sliceColor(arc)"
          :fill-opacity="line.fillOpacity"
          :stroke="line.stroke"
          :stroke-width="line.stroke_width"
          :d="arcFunction(arc)"
          @click="sunburst = !sunburst"
        >
          <title>
            {{ ancestorPath(arc) }}
          </title>
        </path>
        <text
          pointer-events="null"
          text-anchor="middle"
          font-family="sans-serif"
          :font-size="labelFont(arc)"
          style="user-select: none;"
          dy="0.35em"
          class="sunburst-text"
          :transform="labelTransform(arc)"
        >
          {{ arc.data.name }}
        </text>
      </g>
    </g>
    <!--Bubbles-->
    <g id="Bubbles" :duration="transitionDuration">
      <g v-for="(item, index) in packed.children" :key="index">
        <!--TODO: tranform and colors need to be changed-->
        <circle
          :cx="circleX(item)"
          :cy="circleY(item)"
          :r="circleSize"
          :stroke="token.strokeColor"
          :stroke-opacity="token.strokeOpacity"
          :stroke-width="token.strokeSize"
          :fill="circleFill(index)"
          :fill-opacity="token.opacity"
          :transform="circleTransform"
        />
      </g>
    </g>
    <!--Ribbons-->
    <g id="Ribbons" :duration="transitionDuration">
      <g v-for="(node, index) in packed.children" :key="index">
        <path
          v-for="(arc, index) in root"
          :key="index"
          class="ribbon"
          :fill="ribbon.fill"
          :fill-opacity="ribbon.fillOpacity"
          :stroke="ribbon.stroke"
          :stroke-width="ribbon.stroke_width"
          :stroke-opacity="ribbon.stroke_opacity"
          :d="createConnectorPath(arc, node)"
          :transform="circleTransform"
        ></path>
      </g>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'ChordDiagram',
  props: {
    chartDomID: {
      type: String,
      default: 'chord-diagram'
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
          id: 'chord-diagram',
          label: 'Agent-Topic Association ',
          width: 500,
          height: 500,
          fillOpacity: 0.6
        }
      }
    },
    users: {
      type: Array,
      default: function() {
        return []
      }
    },
    innerRadiusSize: {
      type: Number,
      default: 0
    },
    line: {
      type: Object,
      default: function() {
        return {
          show: true,
          fillOpacity: 0.6,
          stroke: '#61768e',
          stroke_width: '0.6'
        }
      }
    },
    ribbon: {
      type: Object,
      default: function() {
        return {
          show: true,
          fill: '#61768e',
          fillOpacity: 0.2,
          stroke: '#61768e',
          stroke_width: '0.6',
          stroke_opacity: 0.6
        }
      }
    },
    text: {
      type: Object,
      default: function() {
        return {}
      }
    },
    token: {
      type: Object,
      default: function() {
        return {
          size: '10',
          color: '#d6d0bc',
          opacity: '0.8',
          strokeSize: '0.7',
          strokeOpcaity: '0.6',
          strokeColor: '#797362'
        }
      }
    }
  },
  data() {
    return {
      svg: null,
      arcGroup: null,
      arcsCoefficient: 0.85,
      transitionDuration: 50,
      sunburst: false
    }
  },
  computed: {
    radius: function() {
      return Math.min(this.meta.width) / 2
    },
    arcFunction: function() {
      return d3
        .arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.018))
        .padRadius(this.radius / 2)
        .innerRadius(function(d) {
          return this.innerRadiusTerm(d)
        })
        .outerRadius(function(d) {
          return this.outerRadiusTerm(d)
        })
    },
    hierarchizeTopicData: function() {
      const child = this.topics.map(a => {
        const c = a.keywords.map(kw => {
          return {
            name: kw,
            value: 1
          }
        })
        return {
          // ...a,
          children: c,
          name: a.id
        }
      })
      return {
        name: 'U.S. Elections',
        children: child
      }
    },
    hierarchizeUsercData: function() {
      const child = this.users.map(a => {
        const c = a.tweets.map(tw => {
          return {
            name: 'tweet',
            tweet: tw,
            value: 1
          }
        })
        c.value = 1
        return {
          // ...a,
          children: c,
          name: a.name
        }
      })
      return {
        name: 'Tweeters',
        children: child
      }
    },
    partitions: function() {
      return function(ddd) {
        return d3.partition().size([2 * Math.PI, this.radius])(
          d3
            .hierarchy(ddd)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value)
        )
      }
    },
    root: function() {
      return this.partitions(this.hierarchizeTopicData)
        .descendants()
        .filter(d => d.depth)
    },
    sliceColor: function() {
      return d => {
        while (d.depth > 1) d = d.parent
        return this.color(d.data.name)
      }
    },
    color: function() {
      const that = this
      return d3.scaleOrdinal(
        d3.quantize(
          d3.interpolateYlGnBu,
          d3.interpolateYlGnBu,
          that.hierarchizeTopicData.children.length + 1
        )
      )
    },
    labelTransform: function() {
      return d => {
        const x = this.labelTransferX(d)
        const y = this.labelTransferY(d)
        return `rotate(${x - 90}) translate(${y},0) rotate(${
          x < 180 ? 0 : 180
        })`
      }
    },
    // TODO: this function needs to be relative to radius
    labelFont: function() {
      return d => {
        if (d.data.name.length > 20) return 7.5
        return 8
      }
    },
    textLength: function() {
      return d => {
        return Math.abs(
          Math.abs(this.outerRadiusTerm(d) - this.innerRadiusTerm(d)) - 10
        )
      }
    },
    ancestorPath: function() {
      return d => {
        return `${d
          .ancestors()
          .map(d => d.data.name)
          .reverse()
          .join('/')}\n`
      }
    },
    innerRadiusTerm: function() {
      return d => {
        return this.sunburst ? d.y0 : this.radius - d.y1 + this.radius / 3
        // : this.radius - d.y1 + (this.radius / 4) * d.depth * 1.2
      }
    },
    outerRadiusTerm: function() {
      return d => {
        return this.sunburst ? d.y1 : this.radius - d.y0 + this.radius / 3
        // return this.sunburst ? d.y1 : this.radius - d.y0 + this.radius / 10
        // to change the size of sunburts: multiply d.y0 and d.y1 to a value> 1 to magnify and a value < 1 to reduce it
        // and add a term to that to make the inner radius bigger ( the white circle in the middle)
      }
    },
    labelTransferX: function() {
      return d => {
        return (((d.x0 + d.x1) / 2) * 180) / Math.PI
      }
    },
    labelTransferY: function() {
      return d => {
        return this.sunburst
          ? (d.y0 + d.y1) / 2
          : ((d.y0 + d.y1) / d.depth ** 1.4) * 0.8
      }
    },
    pack: function() {
      return function(d) {
        const innerRadius = this.radius
        return d3
          .pack()
          .size([innerRadius * 0.8, innerRadius * 0.8])
          .padding(30)(d3.hierarchy(d).sum(d => d.value))
      }
    },
    packed: function() {
      return this.pack(this.hierarchizeUsercData)
    },
    circleTransform: function() {
      return 'translate(' + this.radius * 0.6 + ',' + this.radius * 0.6 + ')'
    },
    circleX: function() {
      return d => {
        return d.x
      }
    },
    circleY: function() {
      return d => {
        return d.y
      }
    },
    circleFill: function() {
      return d => {
        return this.color(d)
      }
    },
    circleSize: function() {
      return this.radius * 0.02
    },
    /*    findLinks: function() {
      return d => {
        const res = []
        const sourceCartesianCo = { X: d.x, Y: d.y, R: d.r }
        for (const tw of d.children.data.children.tweet) {
          const targetPolarCo = d3.arc()
          res.push([sourceCartesianCo, targetPolarCo])
        }
        return res
      }
    }, */
    createConnectorPath: function() {
      return (arc, node) => {
        const { start, end } = this.calculateCoordinate(arc)
        return this.drawCurvePath({ start, end, node })
      }
    },
    calculateCoordinate: function() {
      return arc => {
        const startAngle = arc.x0
        const endAngle = arc.x1
        // radius should be changed based on it's value but it's constant( consider a padding later)
        const radius = 100
        const start = {}
        const end = {}
        // converting polar to cartesian (rotate 90 degrees to get to standard system)
        start.x = radius * Math.cos(startAngle - Math.PI / 2)
        start.y = radius * Math.sin(startAngle - Math.PI / 2)
        end.x = radius * Math.cos(endAngle - Math.PI / 2)
        end.y = radius * Math.sin(endAngle - Math.PI / 2)
        return { start, end }
      }
    },
    drawCurvePath: function() {
      return d => {
        return (
          `M ${d.start.x},${d.start.y}` +
          `C ${d.start.x},${(d.start.y + d.node.y) / 2} ${d.node.x},${(d.start
            .y +
            d.node.y) /
            2} ${d.node.x},${d.node.y}` +
          `L ${d.node.x},${d.node.y}` +
          `C ${d.node.x},${(d.node.y + d.end.y) / 2} ${d.end.x},${(d.node.y +
            d.end.y) /
            2} ${d.end.x},${d.end.y}`
        )
      }
    }
  },
  mounted() {
    this.setupSVG()
  },
  methods: {
    setupSVG: function() {
      this.svg = d3.select('.chord')
      this.arcGroup = d3.select('#arcs')
    },
    sunburstView: function() {
      this.sunburst = !this.sunburst
    }
  }
}
</script>
