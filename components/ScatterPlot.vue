<template>
  <div :id="chartDomID">
    <svg :width="width" :height="height" class="svg scatterplot"></svg>
  </div>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'ScatterPlot',
  props: {
    chartDomID: {
      type: String,
      default: 'scatter-plot'
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
          left: 35,
          bottom: 20
        }
      }
    }
  },
  data() {
    return {
      svg: null,
      circlesGroup: null,
      xAxis: null,
      yAxis: null,
      scales: {
        x: null,
        y: null
      },
      xTicks: 10,
      yTicks: 10,
      dataset: [],
      step: 10,
      limit: 100,
      xScale: null,
      yScale: null
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
    }
  },
  watch: {
    width: function() {
      this.update()
    },
    height: function() {
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
        const val1 = Math.random() * 1000
        const val2 = Math.random() * 1000
        that.dataset.push([val1, val2, 'Hello!'])
      }
    }, 1000)
  },
  methods: {
    setupSVG: function() {
      // Select the SVG element
      this.svg = d3.select('.scatterplot')

      // Add circles group
      this.circlesGroup = this.svg.append('g')

      for (let i = 0; i < this.step; i++) {
        const val = Math.random() * 1000
        this.dataset.push([val, val, 'Hello!'])
      }
    },
    update: function(data = this.dataset) {
      // remove outdated elements
      this.flush()

      // update scales
      this.updateScales()

      // re-draw axes
      this.drawAxes()

      // re-draw data points
      this.drawData(data)
    },
    flush: function() {
      // Remove old axes
      d3.selectAll('.axis').remove()
    },
    updateScales: function() {
      // X Scale
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
        .range([this.chartLeft, this.chartRight])
        .nice()

      // Y Scale
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
        .range([this.chartBottom, this.chartTop])
        .nice()
    },
    drawAxes: function() {
      // Update Axes
      this.xAxis = d3.axisBottom(this.xScale).ticks(this.xTicks)
      this.yAxis = d3.axisLeft(this.yScale).ticks(this.yTicks)

      // Draw X axis
      this.svg
        .append('g')
        .attr('class', 'x axis')
        .attr(
          'transform',
          'translate(0,' + (this.height - this.padding.top) + ')'
        )
        .call(this.xAxis)

      // Draw Y axis
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
      this.circlesGroup
        .selectAll('circle')
        .data(data, function(d) {
          return d
        })
        .join(
          // ENTER new elements present in new data.
          enter =>
            enter
              .append('circle')
              .attr('cx', function(d) {
                return that.xScale(d[0])
              })
              .attr('cy', function(d) {
                return that.yScale(d[1])
              })
              .attr('r', 6)
              .attr('class', 'enter')
              .style('fill-opacity', 1e-6)
              .call(enter => enter.transition(t).style('fill-opacity', 1)),

          // UPDATE old elements present in new data.
          // Cx and Cy are being updated just to maintain the responsiveness to changes in screen resize
          update =>
            update
              .attr('cx', function(d) {
                return that.xScale(d[0])
              })
              .attr('cy', function(d) {
                return that.yScale(d[1])
              })
              .call(update =>
                update
                  .transition(t)
                  .attr('class', 'update')
                  .style('fill-opacity', 1)
              ),

          // EXIT old elements not present in new data.
          exit =>
            exit.attr('class', 'exit').call(exit =>
              exit
                .transition(t)
                .style('fill-opacity', 1e-6)
                .remove()
            )
        )
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
