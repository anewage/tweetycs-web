<template>
  <svg
    :id="chartDomID + '-svg'"
    :width="width"
    :height="height"
    class="svg sankey"
  >
    <g id="links" fill="none" stroke-opacity="0.5">
      <g
        v-for="(link, index) in sankyed.links"
        :key="index"
        style="mix-blend-mode: multiply;"
      >
        <linearGradient
          :id="specialID + '-link-' + index"
          gradientUnits="userSpaceOnUse"
          :x1="link.source.x1"
          :x2="link.target.x0"
        >
          <stop offset="0%" :stop-color="color(link.source.name)"></stop>
          <stop offset="100%" :stop-color="color(link.target.name)"></stop>
        </linearGradient>
        <path
          :id="specialID + '-path-' + index"
          :class="'path ' + specialID + '-object'"
          :d="d(link)"
          :stroke="'url(#' + specialID + '-link-' + index + ')'"
          :stroke-width="Math.max(1, link.width)"
        ></path>
        <title>
          {{ link.source.name }} → {{ link.target.name }}
          {{ format(link.value) }}
        </title>
      </g>
    </g>
    <g id="rects" class="rects" stroke="#000">
      <g
        v-for="(item, index) in sankyed.nodes"
        :id="specialID + '-node-' + index"
        :key="index"
        :class="'node ' + specialID + '-object'"
        @click="$emit('nodeClicked', item)"
        @mouseover="mouseover(item)"
        @mouseout="mouseout(item)"
      >
        <rect
          :x="item.x0"
          :width="item.x1 - item.x0"
          :y="item.y0"
          :height="item.y1 - item.y0"
          :fill="color(item.name)"
          stroke="none"
          class="rect"
        ></rect>
        <text
          :x="item.x0 < chartWidth / 2 ? item.x1 + 6 : item.x0 - 6"
          :y="(item.y1 + item.y0) / 2"
          :text-anchor="item.x0 < chartWidth / 2 ? 'start' : 'end'"
          style="font: 10px sans-serif;"
        >
          {{ item.name }}
        </text>
      </g>
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
    specialID: function() {
      return 'sankey-' + this.chartDomID
    },
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
        .nodeWidth(20)
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
    mouseover: function(item) {
      // Identify the nodes - paths and rects - that should be highlighted
      const whiteList = []

      // Select the paths that should be highlighted
      for (const link of [...item.targetLinks, ...item.sourceLinks]) {
        // The link itself
        whiteList.push(
          document.getElementById(this.specialID + '-path-' + link.index)
        )
        // Target and source nodes
        whiteList.push(
          document.getElementById(this.specialID + '-node-' + link.source.index)
        )
        whiteList.push(
          document.getElementById(this.specialID + '-node-' + link.target.index)
        )
      }
      whiteList.push(
        document.getElementById(this.specialID + '-node-' + item.index)
      )

      // Add greyed class to all of objects
      const elems = document.getElementsByClassName(this.specialID + '-object')
      for (const el of elems) {
        el.classList.remove('highlighted')
        el.classList.add('greyed')
      }

      // Highlight the known elements
      for (const elem of whiteList) {
        elem.classList.remove('greyed')
        elem.classList.add('highlighted')
      }
      this.$emit('nodeMouseover', item)
    },
    mouseout: function(item) {
      const elems = document.getElementsByClassName(this.specialID + '-object')
      for (const el of elems) {
        el.classList.remove('highlighted')
        el.classList.remove('greyed')
      }
      this.$emit('nodeMouseout', item)
    }
  }
}
</script>

<style scoped>
.svg >>> .greyed {
  opacity: 0.2;
  stroke-opacity: 0.2;
}

.svg >>> .highlighted {
  opacity: 1;
  stroke-opacity: unset;
}

.svg >>> .object {
  transition: opacity 500ms;
}

.svg >>> .v-enter {
  opacity: 0;
}

.svg >>> .v-enter-to {
  opacity: 100%;
  fill: green;
}

.svg >>> .v-leave {
  opacity: 100%;
}

.svg >>> .v-leave-to {
  opacity: 0;
  fill: red;
}

.svg >>> .rect,
.svg >>> .path {
  transition: all 500ms;
  -webkit-transition: all 500ms;
}
</style>
