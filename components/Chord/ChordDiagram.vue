<template>
  <svg
    :id="chartDomID + '-svg'"
    :width="meta.width"
    :height="meta.height"
    :fill-opacity="meta.fillOpacity"
    class="svg chord"
  >
    <!--sunburst-->
    <transition-group
      id="sunburstSlices"
      tag="g"
      name="fade"
      :duration="transitionDuration"
      :transform="'translate(' + radius + ',' + radius + ')'"
    >
      <!--SLICES-->
      <g v-for="(arc, index) in rootColor" :key="index">
        <path
          class="line"
          :fill="colorPack(arc)"
          :fill-opacity="line.fillOpacity"
          :stroke="line.stroke"
          :stroke-width="line.stroke_width"
          :d="arcFunction(arc)"
        >
          <title>
            {{ ancestorPath(arc) }}
          </title>
        </path>
      </g>
    </transition-group>
    <!--TEXT-->
    <transition-group
      id="SunburstLables"
      tag="g"
      name="fade"
      :duration="transitionDuration"
      :transform="'translate(' + radius + ',' + radius + ')'"
    >
      <g v-for="(item, index) in rootText" :key="index">
        <text
          pointer-events="null"
          text-anchor="middle"
          font-family="sans-serif"
          font-size="8"
          style="user-select: none;"
          dy="0.35em"
          class="sunburst-text"
          :transform="labelTransform(item)"
        >
          {{ item.data.name }}
        </text>
      </g>
    </transition-group>
    <!--Bubbles-->
    <transition-group
      id="Bubbles"
      tag="g"
      name="fade"
      :duration="transitionDuration"
      :transform="'translate(' + radius + ',' + radius * 0.7 + ')'"
    >
      <g v-for="(item, index) in rootColor" :key="index">
        <circle
          :cx="200"
          :cy="200"
          :r="token.size"
          stroke="grey"
          :stroke-width="token.strokeSize"
          :fill="token.color"
          :fill-opacity="token.opacity"
        />
      </g>
    </transition-group>
    <circle
      :cx="this.radius"
      :cy="this.radius"
      :r="token.size"
      stroke="grey"
      :stroke-width="token.strokeSize"
      :fill="token.color"
      :fill-opacity="token.opacity"
    />
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
    fakeData: {
      type: Array,
      default: function() {
        return [{ name: 'a', value: 100 }]
      }
    },
    line: {
      type: Object,
      default: function() {
        return {
          show: true,
          fill: 'blue',
          fillOpacity: 0.6,
          stroke: 'grey',
          stroke_width: '1.0'
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
          size: '7',
          color: 'pink',
          opacity: '0.6',
          strokeSize: '1'
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
    hierarchizeData: function() {
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
        name: 'All Topics',
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
    rootColor: function() {
      return this.partitions(this.hierarchizeData)
        .descendants()
        .filter(d => d.depth)
    },
    rootText: function() {
      return this.partitions(this.hierarchizeData)
        .descendants()
        .filter(d => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
    },
    colorPack: function() {
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
          that.hierarchizeData.children.length + 1
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
    autoBox: function() {
      return [0, 0, this.meta.width * 2, this.meta.height * 2]
    },
    ancestorPath: function() {
      return d => {
        return `${d
          .ancestors()
          .map(d => d.data.name)
          .reverse()
          .join('/')}\n${d.data.value}`
      }
    },
    tokenPlace: function() {
      return d => d.depth
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
