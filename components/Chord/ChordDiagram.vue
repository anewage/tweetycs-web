<template>
  <svg
    :id="chartDomID + '-svg'"
    :width="meta.width"
    :height="meta.height"
    :fill-opacity="meta.fillOpacity"
    class="svg chord"
  >
    <!--SUNBURST-->
    <transition-group
      id="sunburstSlices"
      tag="g"
      name="fade"
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
        >
          <title>
            {{ ancestorPath(arc) }}
          </title>
        </path>
        <text
          pointer-events="null"
          text-anchor="middle"
          font-family="sans-serif"
          font-size="8"
          style="user-select: none;"
          dy="0.35em"
          class="sunburst-text"
          textLength="10"
          :textLength="textLength(arc)"
          lengthAdjust="spacingAndGlyphs"
          :transform="labelTransform(arc)"
        >
          {{ arc.data.name }}
        </text>
      </g>
    </transition-group>
    <!--
    &lt;!&ndash;TEXT&ndash;&gt;
    <transition-group
      id="SunburstLables"
      tag="g"
      name="fade"
      :duration="transitionDuration"
      :transform="'translate(' + radius + ',' + radius + ')'"
    >
      <g v-for="(item, index) in root" :key="index">
        <text
          pointer-events="null"
          text-anchor="middle"
          font-family="sans-serif"
          font-size="8"
          style="user-select: none;"
          dy="0.35em"
          class="sunburst-text"
          textLength="40"
          lengthAdjust="spacingAndGlyphs"
          :transform="labelTransform(item)"
        >
          {{ item.data.name }}
        </text>
      </g>
    </transition-group>
  -->
    <!--Bubbles-->
    <transition-group
      id="Bubbles"
      tag="g"
      name="fade"
      :duration="transitionDuration"
    >
      <g v-for="(item, index) in users" :key="index">
        <circle
          :cx="radius"
          :cy="radius"
          :r="token.size"
          :stroke="token.strokeColor"
          :stroke-opacity="token.strokeOpacity"
          :stroke-width="token.strokeSize"
          :fill="token.color"
          :fill-opacity="token.opacity"
        />
      </g>
    </transition-group>
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
    line: {
      type: Object,
      default: function() {
        return {
          show: true,
          fill: 'blue',
          fillOpacity: 0.6,
          stroke: '#61768e',
          stroke_width: '0.6'
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
          opacity: '0.6',
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
      transitionDuration: 500
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
          // eslint-disable-next-line no-console
          console.log(this.innerRadiusTerm(d))
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
          ...a,
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
            name: tw,
            value: 1
          }
        })
        return {
          ...a,
          children: c,
          name: a.id
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
    /*    rootText: function() {
      return this.partitions(this.hierarchizeTopicData)
        .descendants()
        .filter(d => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 0)
    }, */
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
          d3.interpolateInferno,
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
        // ${d.data.value}
      }
    },
    innerRadiusTerm: function() {
      return d => {
        return this.radius - d.y1 + (this.radius / 4) * d.depth * 1.2
      }
    },
    outerRadiusTerm: function() {
      return d => {
        return this.radius - d.y0 + this.radius / 10
      }
    },
    labelTransferX: function() {
      return d => {
        return (((d.x0 + d.x1) / 2) * 180) / Math.PI
      }
    },
    labelTransferY: function() {
      return d => {
        return ((d.y0 + d.y1) / d.depth ** 1.2) * 0.7
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
    }
  }
}
</script>
