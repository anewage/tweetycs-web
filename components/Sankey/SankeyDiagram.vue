<template>
  <svg
    :id="chartDomID + '-svg'"
    :width="width"
    :height="height"
    class="svg sankey"
  >
    <g id="rects" stroke="#000">
      <rect
        v-for="(item, index) in sankyed.nodes"
        :key="index"
        :x="item.x0"
        :width="item.x1 - item.x0"
        :y="item.y0"
        :height="item.y1 - item.y0"
        :fill="color(item.name)"
      ></rect>
    </g>
    <g id="links" fill="none" stroke-opacity="0.5">
      <g
        v-for="(link, index) in sankyed.links"
        :key="index"
        style="mix-blend-mode: multiply;"
      >
        <linearGradient
          :id="'link-' + index"
          gradientUnits="userSpaceOnUse"
          :x1="link.source.x1"
          :x2="link.source.x0"
        >
          <stop offset="0%" :stop-color="color(link.source.name)"></stop>
          <stop offset="100%" :stop-color="color(link.target.name)"></stop>
        </linearGradient>
        <path
          :d="d(link)"
          :stroke="'url(#link-' + index + ')'"
          :stroke-width="Math.max(1, link.width)"
        ></path>
        <title>
          {{ link.source.name }} → {{ link.target.name }}
          {{ format(link.value) }}
        </title>
      </g>
    </g>
    <g style="font: 10px sans-serif;">
      <text
        v-for="(node, index) in sankyed.nodes"
        :key="index"
        :x="node.x0 < chartWidth / 2 ? node.x1 + 6 : node.x0 - 6"
        :y="(node.y1 + node.y0) / 2"
        dy="0.35em"
        :text-anchor="node.x0 < chartWidth / 2 ? 'start' : 'end'"
      >
        {{ node.name }}
      </text>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3'
import * as d3Sankey from 'd3-sankey'
export default {
  name: 'SankeyDiagram',
  props: {
    chartDomID: {
      type: String,
      default: 'sankey-diagram'
    },
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    dataset: {
      type: Object,
      default: function() {
        return {
          nodes: [],
          links: []
        }
      }
    },
    padding: {
      type: Object,
      default: function() {
        return {
          top: 5,
          right: 5,
          left: 5,
          bottom: 5
        }
      }
    }
  },
  data() {
    return {
      svg: null,
      rectsGroup: null,
      linksGroup: null
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
    sankyed: function() {
      const sankey = d3Sankey
        .sankey()
        .nodeId(node => node.id)
        .nodeAlign(d3Sankey.sankeyJustify)
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [this.chartWidth - 1, this.chartHeight - 5]])
      return sankey({
        nodes: this.dataset.nodes.map(d => Object.assign({}, d)),
        links: this.dataset.links.map(d => Object.assign({}, d))
      })
    },
    color: function() {
      const color = d3.scaleOrdinal(d3.schemeCategory10)
      return name => color(name.replace(/ .*/, ''))
    },
    format: function() {
      const f = d3.format(',.0f')
      return d => f(d) + 'TWh'
    },
    d: function() {
      return d3Sankey.sankeyLinkHorizontal()
    }
  },
  beforeUpdate() {},
  mounted() {
    // Setup the SVG and Groups
    this.setupSVG()
  },
  methods: {
    setupSVG: function() {
      // Select the SVG element
      this.svg = d3.select('.sankey')
      this.rectsGroup = d3.select('.rects')
      this.linksGroup = d3.select('.links')
    },
    sankey: function() {
      const sankey = d3Sankey
        .sankey()
        .nodeAlign(d3Sankey.sankeyJustify)
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 5], [this.chartWidth - 1, this.chartHeight - 5]])
      return ({ nodes, links }) =>
        sankey({
          nodes: nodes.map(d => Object.assign({}, d)),
          links: links.map(d => Object.assign({}, d))
        })
    },
    drawAxes: function() {}
  }
}
</script>

<style scoped></style>
