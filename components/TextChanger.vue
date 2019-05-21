<template>
  <div :id="chartDomID">
    <svg :width="width" :height="height" class="svg"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'TextChanger',
  props: {
    chartDomID: {
      type: String,
      default: 'text-changer'
    },
    height: {
      type: Number,
      default: 500
    },
    width: {
      type: Number,
      default: 0
    },
    minWidth: {
      type: Number,
      default: 200
    },
    minHeight: {
      type: Number,
      default: 200
    },
    margin: {
      type: Object,
      default: () => ({
        left: 30,
        right: 10,
        top: 10,
        bottom: 20
      })
    }
  },
  data() {
    return {
      svg: null,
      g: null
    }
  },
  computed: {
    actualWidth: function() {
      if (this.width) {
        return this.width
      }
      return document.getElementById(this.chartDomID).clientWidth
    },
    displayWidth: function() {
      if (this.minWidth > this.actualWidth) {
        return this.minWidth - this.margin.left - this.margin.right
      }
      return this.actualWidth - this.margin.left - this.margin.right
    },
    displayHeight: function() {
      if (this.minHeight > this.height) {
        return this.minHeight - this.margin.top - this.margin.bottom
      }
      return this.height - this.margin.top - this.margin.bottom
    }
  },
  watch: {
    // width: function(newValue) {
    //   d3.select('#' + this.chartDomID)
    //     .selectAll('*')
    //     .remove()
    //   this.setupSVG()
    //   this.update()
    // },
    // height: function(newValue) {
    //   d3.select('#' + this.chartDomID)
    //     .selectAll('*')
    //     .remove()
    //   this.setupSVG()
    //   this.update()
    // }
  },
  mounted() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
    const that = this
    // Setup
    this.setupSVG()

    // The initial display.
    this.update(alphabet)

    // Grab a random sample of letters from the alphabet, in alphabetical order.
    d3.interval(function() {
      const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
      that.update(
        d3
          .shuffle(alphabet)
          .slice(0, Math.floor(Math.random() * 26))
          .sort()
      )
    }, 1000)
  },
  methods: {
    setupSVG: function() {
      this.svg = d3.select('svg')
      // .append('svg')
      // .attr('width', this.displayWidth + this.margin.left + this.margin.right)
      // .attr(
      //   'height',
      //   this.displayHeight + this.margin.top + this.margin.bottom
      // )
      const height = +this.svg.attr('height')
      this.g = this.svg
        .append('g')
        .attr('transform', 'translate(20,' + height / 2 + ')')
    },
    update: function(data = 'abcdefghijklmnopqrstuvwxyz'.split('')) {
      const t = d3.transition().duration(750)

      // JOIN new data with old elements.
      const text = this.g.selectAll('text').data(data, function(d) {
        return d
      })

      // EXIT old elements not present in new data.
      text
        .exit()
        .attr('class', 'exit')
        .transition(t)
        .attr('y', 60)
        .style('fill-opacity', 1e-6)
        .remove()

      // UPDATE old elements present in new data.
      text
        .attr('class', 'update')
        .attr('y', 0)
        .style('fill-opacity', 1)
        .transition(t)
        .attr('x', function(d, i) {
          return i * 32
        })

      // ENTER new elements present in new data.
      text
        .enter()
        .append('text')
        .attr('class', 'enter')
        .attr('dy', '.35em')
        .attr('y', -60)
        .attr('x', function(d, i) {
          return i * 32
        })
        .style('fill-opacity', 1e-6)
        .text(function(d) {
          return d
        })
        .transition(t)
        .attr('y', 0)
        .style('fill-opacity', 1)
    }
  }
}
</script>

<style>
text {
  font: bold 48px monospace;
}

.svg {
  background: lightgrey;
}

.enter {
  fill: green;
}

.update {
  fill: #333;
}

.exit {
  fill: brown;
}
</style>
