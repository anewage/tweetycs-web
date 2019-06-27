<template>
  <v-layout row wrap>
    <v-flex text-xs-center xs12 class="mt-5">
      <span>Number of Panels:</span>
      <v-slider
        :tick-labels="[1, 2, 3, 4, 6, 12]"
        :max="6"
        :min="1"
        step="1"
        ticks="always"
        tick-size="1"
        @change="changeComparisons"
      ></v-slider>
    </v-flex>
    <v-flex
      v-for="(comparison, index) in comparisons"
      :key="index"
      :xs6="comparisons.length === 2"
      :xs4="comparisons.length === 3"
      :xs3="comparisons.length === 4"
      :xs2="comparisons.length === 6"
      :xs1="comparisons.length === 12"
    >
      <v-flex xs12>
        <v-card flat color="transparent">
          <v-card-title>
            <h2>{{ index + 1 }} - Control Box</h2>
          </v-card-title>
          <v-card-actions>
            <v-layout row align-center justify-space-around>
              <v-flex v-if="mlMethods.length === 0" text-xs-center>
                <v-progress-circular
                  :size="50"
                  color="orange"
                  indeterminate
                ></v-progress-circular>
              </v-flex>
              <v-flex v-if="mlMethods.length !== 0">
                <h4>Text Categorization Methods</h4>
                <v-radio-group v-model="comparison.machineLearning" column>
                  <v-radio
                    v-for="method in mlMethods"
                    :key="method.id + '-' + index"
                    :label="method.title"
                    :value="method.id"
                    color="orange"
                  ></v-radio>
                </v-radio-group>
              </v-flex>
              <v-flex v-if="analysisMethods.length === 0" text-xs-center>
                <v-progress-circular
                  :size="50"
                  color="cyan"
                  indeterminate
                ></v-progress-circular>
              </v-flex>
              <v-flex v-if="analysisMethods.length !== 0">
                <h4>Sentiment Analysis Methods</h4>
                <v-radio-group v-model="comparison.analysis" column>
                  <v-radio
                    v-for="method in analysisMethods"
                    :key="method.id + '-' + index"
                    :label="method.title"
                    :value="method.id"
                    color="cyan"
                  ></v-radio>
                </v-radio-group>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex text-xs-center xs12>
        <sankey-diagram-wrapper
          :id="charts.sankey.id + '-comparison-' + index"
          :div-id="charts.sankey.divId + '-comparison-' + index"
          :label="index + 1 + ' - ' + charts.sankey.label"
          :width="charts.sankey.width"
          :height="charts.sankey.height"
          :color="color"
          :flat="flat"
          :topics="topics"
          :selected-ml-method="comparison.machineLearning"
          :dataset="aggregatedTopics"
          @itemClick="updateTopic"
        ></sankey-diagram-wrapper>
      </v-flex>
      <v-flex text-xs-center xs12>
        <heat-map-wrapper
          :id="charts.heatmap.id + '-comparison-' + index"
          :div-id="charts.heatmap.divId + '-comparison-' + index"
          :label="index + 1 + ' - ' + charts.heatmap.label"
          :width="charts.heatmap.width"
          :height="charts.heatmap.height"
          :selected-analysis-method="comparison.analysis"
          :selected-machine-learning-method="comparison.machineLearning"
          :selected-topic="comparison.topic"
          :color="color"
          :flat="flat"
          :dataset="aggregatedKeywords"
        ></heat-map-wrapper>
      </v-flex>
      <v-flex text-xs-center xs12>
        <scatter-plot-wrapper
          :id="charts.scatterplot.id + '-comparison-' + index"
          :div-id="charts.scatterplot.divId + '-comparison-' + index"
          :label="index + 1 + ' - ' + charts.scatterplot.label"
          :width="charts.scatterplot.width"
          :height="charts.scatterplot.height"
          :selected-analysis-method="comparison.analysis"
          :color="color"
          :flat="flat"
          :dataset="aggregatedUsers"
          @circleClicked="updateTweets"
        ></scatter-plot-wrapper>
      </v-flex>
    </v-flex>
  </v-layout>
</template>

<script>
// import { _ } from 'vue-underscore'
import ScatterPlotWrapper from '../components/Scatterplot/ScatterPlotWrapper'
import HeatMapWrapper from '../components/Heatmap/HeatMapWrapper'
import SankeyDiagramWrapper from '../components/Sankey/SankeyDiagramWrapper'
import socket from '../lib/socket.io'
import TweetsWrapper from '../components/Twitter/TweetsWrapper'

export default {
  name: 'PageCompare',
  components: {
    'sankey-diagram-wrapper': SankeyDiagramWrapper,
    'scatter-plot-wrapper': ScatterPlotWrapper,
    'heat-map-wrapper': HeatMapWrapper,
    // eslint-disable-next-line vue/no-unused-components
    'tweets-wrapper': TweetsWrapper
  },
  data() {
    return {
      flat: false,
      color: 'transparent',
      msg: '',
      temp: [],
      comparisons: [{ analysis: '', machineLearning: '', topic: 'hiv' }],
      // Charts and all of their configurations
      charts: {
        scatterplot: {
          id: 'scatter-plot',
          divId: 'scatter-plot-div',
          label: 'User Influence Vs. Average Sentiment',
          width: 600,
          height: 300
        },
        sankey: {
          id: 'sankey-diagram',
          divId: 'sankey-diagram-div',
          label: 'User Categories, Topics, and Content Theme',
          width: 600,
          height: 450
        },
        heatmap: {
          id: 'heatmap',
          divId: 'heatmap-div',
          label: 'Hybrid Analysis',
          width: 600,
          height: 150
        },
        tweets: {
          user: {},
          tweets: [],
          avgSentiment: 0,
          influence: 0
        }
      },
      // Data required for connection metrics
      pingPong: {
        start: 0,
        end: 0,
        busy: false,
        history: []
      }
    }
  },
  computed: {
    /*
     * dataset containing the tweets
     */
    aggregatedTopics() {
      return this.$store.state.aggregatedTopics
    },
    aggregatedUsers() {
      return this.$store.state.aggregatedUsers
    },
    aggregatedKeywords() {
      return this.$store.state.aggregatedKeywords
    },
    topics() {
      return this.$store.state.topics
    },
    analysisMethods() {
      return this.aggregatedUsers.map(cat => {
        return {
          id: cat._id,
          title: cat.items[0].analysis.title
        }
      })
    },
    mlMethods() {
      return this.aggregatedTopics.group_topics.map(cat => {
        return {
          id: cat._id,
          title: cat.items[0].labels.title
        }
      })
    },
    /*
     * Current delay in ms
     */
    delay() {
      if (this.pingPong.busy)
        if (this.pingPong.history.length > 0)
          return this.pingPong.history[this.pingPong.history.length - 1]
        else return 0
      return this.pingPong.end - this.pingPong.start
    },
    /*
     * Current average delay in ms
     */
    avgDelay() {
      let avg = 0
      for (const num of this.pingPong.history) avg += num
      avg = (10 * avg) / (this.pingPong.history.length * 10)
      return avg
    }
  },
  beforeMount() {
    const that = this
    /*
     * Event handler for new connections.
     * The callback function is invoked when a connection with the server is established.
     */
    socket.on('connect', () => {
      socket.emit('client_event', { data: "I'm connected!" })
    })
    /*
     * Event handler for server sent data.
     * The callback function is invoked whenever the server emits data
     * to the client. The data is then displayed in the "Received"
     * section of the page.
     */
    socket.on('server_response', msg => {
      document.getElementById('log').innerText = msg.data
    })
    /*
     * Handler for the "pong" message. When the pong is received, the
     * time from the ping is stored, and the average of the last 30
     * samples is average and displayed.
     */
    socket.on('server_pong', () => {
      that.pingPong.end = new Date().getTime()
      that.pingPong.history.push(that.pingPong.end - that.pingPong.start)
      // Keep last 30 samples
      if (that.pingPong.history.length > 30) that.pingPong.history.splice(-30)
      that.pingPong.busy = false
    })
    /*
     * Store the incoming data
     */
    socket.on('bulk-update', msg => {
      that.commitUpdates(msg)
    })
  },
  mounted() {
    const that = this
    this.resize()
    window.addEventListener('resize', this.resize)

    window.setInterval(() => {
      if (socket.connected) {
        that.pingPong.busy = true
        that.pingPong.start = new Date().getTime()
        socket.emit('client_ping')
      }
    }, 2000)
  },
  methods: {
    resize: function() {
      for (const index in this.comparisons) {
        const scatterDiv = document.getElementById(
          this.charts.scatterplot.divId + '-comparison-' + index
        )
        const heatDiv = document.getElementById(
          this.charts.heatmap.divId + '-comparison-' + index
        )
        const sankeyDiv = document.getElementById(
          this.charts.sankey.divId + '-comparison-' + index
        )
        this.charts.scatterplot.width = scatterDiv.clientWidth - 5
        this.charts.heatmap.width = heatDiv.clientWidth - 5
        this.charts.sankey.width = sankeyDiv.clientWidth - 5
      }
    },
    commitUpdates: function(msg) {
      // Store the changes
      this.$store.commit('updateAggregatedTopics', msg.aggregatedTopics)
      this.$store.commit('updateAggregatedUsers', msg.aggregatedUsers)
      this.$store.commit('updateAggregatedKeywords', msg.aggregatedKeywords)
      this.$store.commit('updateTopics', msg.topics)
    },
    updateTweets: function(data) {
      this.charts.tweets.user = data.user
      this.charts.tweets.tweets = data.tweets
      this.charts.tweets.avgSentiment = data.y
      this.charts.tweets.influence = data.x
    },
    changeComparisons: function(count) {
      count = [1, 2, 3, 4, 6, 12][count - 1]
      if (this.comparisons.length < count) {
        for (let i = this.comparisons.length; i < count; i++)
          this.comparisons.push({
            analysis: '',
            machineLearning: '',
            topic: 'hiv'
          })
      } else if (this.comparisons.length > count) {
        this.comparisons.splice(count)
      }
    }
  }
}
</script>
