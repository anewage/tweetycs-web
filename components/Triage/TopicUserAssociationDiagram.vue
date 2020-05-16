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
      <g
        v-for="(arc, index) in root"
        :id="'arc-' + arc.data.name"
        :key="index"
        class="highlightable"
        @mouseover="highlightConnectedSet({ arc: arc })"
        @mouseout="removeHighlights"
      >
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
      </g>
      <!--Labels-->
      <g
        v-for="(arc, index) in rootText"
        :id="'arc-' + arc.data.name"
        :key="index"
        class="highlightable"
        @mouseover="highlightConnectedSet({ arc: arc })"
        @mouseout="removeHighlights"
      >
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
    <!--Ribbons-->
    <g id="Ribbons" :duration="transitionDuration">
      <g v-for="(node, index) in packed.children" :key="index">
        <path
          v-for="(arc, index) in findArcs(node)"
          :id="'path-' + node.data.name + '-' + arc.data.name"
          :key="index"
          class="ribbon highlightable"
          :fill="ribbon.fill"
          :fill-opacity="ribbon.fillOpacity"
          :stroke="ribbon.stroke"
          :stroke-width="ribbon.stroke_width"
          :stroke-opacity="ribbon.stroke_opacity"
          :d="createConnectorPath(arc, node)"
          @mouseover="
            highlightConnectedSet({ path: arc, user: node, arc: arc })
          "
          @mouseout="removeHighlights"
        ></path>
      </g>
    </g>
    <!--Bubbles-->
    <g id="Bubbles" :duration="transitionDuration">
      <g v-for="(item, index) in packed.children" :key="index">
        <!--TODO: tranform and colors need to be changed-->
        <circle
          :id="'user-' + item.data.screen_name"
          :class="'user-circle highlightable'"
          :cx="circleX(item)"
          :cy="circleY(item)"
          :r="circleSize"
          :stroke="token.strokeColor"
          :stroke-opacity="token.strokeOpacity"
          :stroke-width="token.strokeSize"
          :fill="circleFill(index)"
          :fill-opacity="token.opacity"
          :transform="circleTransform"
          @mouseover="highlightConnectedSet({ user: item })"
          @mouseout="removeHighlights"
        />
      </g>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3'

export default {
  name: 'TopicUserDiagram',
  props: {
    chartDomID: {
      type: String,
      default: 'topic-user'
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
          id: 'topic-user-diagram',
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
          fillOpacity: 0.7,
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
          fill: '#869bb4',
          fillOpacity: 0.1,
          stroke: '#61768e',
          stroke_width: '0.6',
          stroke_opacity: 0.4
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
          opacity: '0.75',
          strokeSize: '0.7',
          strokeOpacity: '0.8',
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
    innerAreaRadius: function() {
      return this.radius / 3
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
    /**
     * formatting Topic data, to apply arc() on it
     * each element has a name, and children (for non-leaf nodes) or a value (for leaf nodes)
     **/
    hierarchizeTopicData: function() {
      const child = this.topics.map(a => {
        const c = a.keywords.map(kw => {
          return {
            name: kw,
            value: 1 * Math.random()
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
    /**
     * formating Topic data, to apply pack() on it
     **/
    hierarchizeUsersData: function() {
      const child = this.users.map(a => {
        const c = a.tweets.map(tw => {
          return {
            name: 'tweet',
            tweets: tw,
            value: 1
          }
        })
        c.value = 1
        return {
          ...a,
          children: c,
          name: a.screen_name
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
    rootText: function() {
      return this.partitions(this.hierarchizeTopicData)
        .descendants()
        .filter(d => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
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
          that.hierarchizeTopicData.children.length + 1
        )
      )
    },
    colorToken: function() {
      const that = this
      return d3.scaleOrdinal(
        d3.quantize(
          d3.interpolateCubehelixDefault,
          that.hierarchizeUsersData.children.length + 1
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
    // TODO: this function should to be relative to radius
    labelFont: function() {
      return d => {
        if (d.data.name.length * 4 > this.radius / 3) return 6.5
        return 8
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
      const margin = 2
      return d => {
        return this.meta.sunburst
          ? d.y0 + margin
          : this.radius - d.y1 + this.innerAreaRadius + margin
      }
    },
    /**
     * to magnify sunburst: multiply d.y0 & d.y1 to a value> 1 (and to a value < 1 to reduce)
     * to magnify the inner area radius (the white circle in the middle): add a term to that
     **/
    outerRadiusTerm: function() {
      return d => {
        return this.meta.sunburst
          ? d.y1
          : this.radius - d.y0 + this.innerAreaRadius
      }
    },
    labelTransferX: function() {
      return d => {
        return (((d.x0 + d.x1) / 2) * 180) / Math.PI
      }
    },
    labelTransferY: function() {
      return d => {
        return this.meta.sunburst
          ? (d.y0 + d.y1) / 2
          : ((d.y0 + d.y1) / d.depth ** 1.4) * 0.8
      }
    },
    pack: function() {
      return function(d) {
        const packRadius = this.radius * 0.78
        return d3
          .pack()
          .size([packRadius, packRadius])
          .padding(30)(d3.hierarchy(d).sum(d => d.value))
      }
    },
    packed: function() {
      return this.pack(this.hierarchizeUsersData)
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
        return this.colorToken(d)
      }
    },
    circleSize: function() {
      return this.radius * 0.02
    },
    /**
     * Related arcs to a user, only at one of depth 1 or 2
     **/
    findArcs: function() {
      return user => {
        let res = []
        const desiredDepth = this.meta.sunburst ? 1 : 2
        const desiredField = this.meta.sunburst ? 'topics' : 'keywords'
        const arcs = this.root.filter(d => d.depth === desiredDepth)
        for (const tw of user.data.children)
          res = res.concat(
            arcs.filter(d => tw.tweets[desiredField].includes(d.data.name))
          )
        return res
      }
    },
    /**
     * Related arcs to a user, at both 1 and 2 depths
     **/
    relatedArcs: function() {
      return user => {
        let res = []
        for (const tw of user.data.children)
          res = res.concat(
            this.root.filter(
              d =>
                tw.tweets.topics.includes(d.data.name) ||
                tw.tweets.keywords.includes(d.data.name)
            )
          )
        return res
      }
    },
    isUsed: function() {
      return arc => {
        for (const user of this.packed.children)
          for (const tw of user.data.tweets)
            if (tw.keywords.includes(arc.data.name)) return true
        return false
      }
    },
    /**
     * Related users to a specific arc
     **/
    relatedUsers: function() {
      return arc => {
        let res = []
        for (const user of this.packed.children)
          for (const tw of user.data.tweets)
            if (tw.keywords.includes(arc.data.name)) res = res.concat(user)
        return res
      }
    },
    /**
     * takes a node in cartesian system and an arc's start and end points in polar
     * transforms start/end point by transforms done on sunburst
     * transforms node coordinate by transforms done on bubbles
     * returns a sequence of dots for drawing a ribbon
     **/
    createConnectorPath: function() {
      return (arc, userNode) => {
        const { start, end } = this.calculateCoordinate(arc)
        const node = {}
        node.x = userNode.x + this.radius * 0.6
        node.y = userNode.y + this.radius * 0.6
        start.x = start.x + this.radius
        start.y = start.y + this.radius
        end.x = end.x + this.radius
        end.y = end.y + this.radius
        return this.drawCurvePath({ start, end, node })
      }
    },
    /**
     * converts polar coordinates of arc start and end points to cartesian
     **/
    calculateCoordinate: function() {
      return arc => {
        const startAngle = arc.x0
        const endAngle = arc.x1
        const radius = this.innerAreaRadius * 0.98
        const start = {}
        const end = {}
        start.x = radius * Math.cos(startAngle - Math.PI / 2)
        start.y = radius * Math.sin(startAngle - Math.PI / 2)
        end.x = radius * Math.cos(endAngle - Math.PI / 2)
        end.y = radius * Math.sin(endAngle - Math.PI / 2)
        return { start, end }
      }
    },
    /**
     * takes start/end/node points and returns coordination of a path (ribbon)
     **/
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
    removeHighlights: function() {
      const elems = document.getElementsByClassName('highlightable')
      for (const el of elems) {
        if (el) {
          el.classList.remove('highlighted')
          el.classList.remove('greyed')
        }
      }
    },
    // Highlight a user and the connected topics/subtopics
    highlightConnectedSet: function(
      elements = { user: null, path: null, arc: null }
    ) {
      // Find elements to highlight
      let whiteList = []
      // Only user is a candidate (the mouse is on user)
      if (elements.user) {
        // The user himself
        whiteList.push('user-' + elements.user.data.name)

        // The arcs and paths which are related to this user
        const arcs = this.relatedArcs(elements.user)
        for (const arc of arcs) {
          whiteList.push('arc-' + arc.data.name)
          whiteList.push(
            'path-' + elements.user.data.name + '-' + arc.data.name
          )
        }
      }

      // Only an arc is a candidate (the mouse is on an arc)
      if (elements.arc) {
        whiteList.push('arc-' + elements.arc.data.name)
        let keywordList = []
        let usersList = []
        // If keyword is selected add its parent
        if (elements.arc.depth === 2) {
          whiteList.push('arc-' + elements.arc.parent.data.name)
          keywordList = keywordList.concat(elements.arc)
        } // If topic is selected add all its used keywords
        else if (elements.arc.depth === 1) {
          for (const el of elements.arc.children)
            if (this.isUsed(el)) {
              whiteList.push('arc-' + el.data.name)
              keywordList = keywordList.concat(el)
            }
        }
        // Add all related users
        for (const kw of keywordList)
          for (const tw of this.relatedUsers(kw)) {
            whiteList.push('user-' + tw.data.name)
            usersList = usersList.concat(tw)
          }
        // Add the ribbons between arc and users based on sunburst view
        for (const tw of usersList) {
          // If selected arc is a keyword
          if (elements.arc.depth === 2) {
            const baseArc = this.meta.sunburst
              ? elements.arc.parent
              : elements.arc
            whiteList.push('path-' + tw.data.name + '-' + baseArc.data.name)
          } // If selected arc is a topic
          else if (elements.arc.depth === 1) {
            if (this.meta.sunburst)
              whiteList.push(
                'path-' + tw.data.name + '-' + elements.arc.data.name
              )
            // If not sunburst, find ribbons between each keyword and user
            else {
              for (const kw of keywordList)
                for (const user of usersList)
                  for (const tw of user.data.tweets)
                    if (tw.keywords.includes(kw.data.name))
                      whiteList.push(
                        'path-' + user.data.name + '-' + kw.data.name
                      )
            }
          }
        }
      }

      // Only a path is a candidate (the mouse is on a path connecting a user to a (sub)topic)
      if (elements.path) {
        whiteList.push(
          'path-' + elements.user.data.name + '-' + elements.path.data.name
        )
      }
      // Add greyed class to all of objects
      const elems = document.getElementsByClassName('highlightable')
      for (const el of elems) {
        if (el) {
          el.classList.remove('highlighted')
          el.classList.add('greyed')
        }
      }
      whiteList = whiteList.map(str => document.getElementById(str))
      // Highlight the known elements
      for (const el of whiteList) {
        // Prevent error while brushing
        if (el) {
          el.classList.remove('greyed')
          el.classList.add('highlighted')
        }
      }
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

.svg >>> .selected {
  opacity: 1;
  stroke-opacity: unset;
}
</style>
