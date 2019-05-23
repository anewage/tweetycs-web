<template>
  <div :id="chartDomID">
    <svg :width="width" :height="height" class="svg"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'ScatterPlot',
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
    padding: {
      type: Object,
      default: function() {
        return {
          top: 20,
          right: 20,
          left: 30,
          bottom: 20
        }
      }
    }
  },
  data() {
    return {
      svg: null,
      circlesGroup: null,
      xScale: null,
      yScale: null,
      xAxis: null,
      yAxis: null,
      dataset: [],
      step: 10,
      limit: 100
    }
  },
  watch: {
    height: function(newValue) {
      this.update()
    },
    width: function(newValue) {
      this.update()
    },
    dataset: function(newValue) {
      // Keep the dataset limited by removing old data points
      if (newValue.length > this.limit) newValue.splice(0, this.step)

      // Update the view
      this.update()
    }
  },
  mounted() {
    const that = this
    // Setup the SVG and Groups
    this.setupSVG()

    // The initial display.
    this.update()

    // Update dataset (add new data)
    d3.interval(function() {
      for (let i = 0; i < that.step; i++) {
        that.dataset.push([Math.random() * 1000, Math.random() * 1000])
      }
    }, 1000)
  },
  methods: {
    setupSVG: function() {
      this.svg = d3.select('svg')
      this.circlesGroup = this.svg.append('g')
    },
    update: function(data = this.dataset) {
      // Remove old axes
      d3.selectAll('.axis').remove()

      // re-draw axes
      this.drawAxes()

      // re-draw data points
      this.drawData(data)
    },
    drawAxes: function() {
      this.xScale = d3
        .scaleLinear()
        .domain([
          d3.min(this.dataset, function(d) {
            return d[0]
          }),
          d3.max(this.dataset, function(d) {
            return d[0]
          })
        ])
        .range([this.padding.left, this.width - this.padding.right])

      this.yScale = d3
        .scaleLinear()
        .domain([
          d3.min(this.dataset, function(d) {
            return d[1]
          }),
          d3.max(this.dataset, function(d) {
            return d[1]
          })
        ])
        .range([this.height - this.padding.bottom, this.padding.top])

      this.xAxis = d3.axisBottom(this.xScale).ticks(10)
      this.yAxis = d3.axisLeft(this.yScale).ticks(10)

      // X axis
      this.svg
        .append('g')
        .attr('class', 'x axis')
        .attr(
          'transform',
          'translate(0,' + (this.height - this.padding.top) + ')'
        )
        .call(this.xAxis)

      // Y axis
      this.svg
        .append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + this.padding.left + ', 0)')
        .call(this.yAxis)
    },
    drawData: function(data) {
      const that = this
      const t = d3.transition().duration(750)
      // JOIN new data with old elements.
      const circles = this.circlesGroup
        .selectAll('circle')
        .data(data, function(d) {
          return d
        })

      // EXIT old elements not present in new data.
      circles
        .exit()
        .attr('class', 'exit')
        .transition(t)
        .style('fill-opacity', 1e-6)
        .remove()

      // UPDATE old elements present in new data.
      // Cx and Cy are being updated just to maintain the responsiveness to changes in screen resize
      circles
        .transition(t)
        .attr('cx', function(d) {
          return that.xScale(d[0])
        })
        .attr('cy', function(d) {
          return that.yScale(d[1])
        })
        .attr('class', 'update')
        .style('fill-opacity', 1)

      // ENTER new elements present in new data.
      circles
        .enter()
        .append('circle')
        .attr('cx', function(d) {
          return that.xScale(d[0])
        })
        .attr('cy', function(d) {
          return that.yScale(d[1])
        })
        .attr('r', 2)
        .attr('class', 'enter')
        .style('fill-opacity', 1e-6)
        .transition(t)
        .style('fill-opacity', 1)
    }
  }
}
</script>

<style>
.svg {
  /*background: lightgrey;*/
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
