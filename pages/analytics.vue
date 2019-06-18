<template>
  <v-layout row wrap>
    <v-flex text-xs-center xs12>
      <div>
        <h1>
          Delay: <span>{{ delay }}</span>
        </h1>
        <h1>
          Avg. Delay: <span>{{ avgDelay }}</span>
        </h1>
        <h1 id="log">Response: {{ msg }}</h1>
      </div>
    </v-flex>
    <v-flex xs12>
      <v-card flat color="transparent">
        <v-card-title>
          <h2>
            Control Box
          </h2>
        </v-card-title>
        <v-card-actions>
          <v-layout row align-center justify-space-around>
            <v-flex v-if="Object.keys(mlMethods).length === 0" text-xs-center>
              <v-progress-circular
                :size="50"
                color="orange"
                indeterminate
              ></v-progress-circular>
            </v-flex>
            <v-flex v-if="Object.keys(mlMethods).length !== 0">
              <h4>Text Categorization Methods</h4>
              <v-radio-group v-model="selectedMachineLearningMethod" column>
                <v-radio
                  v-for="method in Object.keys(mlMethods)"
                  :key="method"
                  :label="mlMethods[method]"
                  :value="method"
                  color="orange"
                ></v-radio>
              </v-radio-group>
            </v-flex>
            <v-flex
              v-if="Object.keys(analysisMethods).length === 0"
              text-xs-center
            >
              <v-progress-circular
                :size="50"
                color="cyan"
                indeterminate
              ></v-progress-circular>
            </v-flex>
            <v-flex v-if="Object.keys(analysisMethods).length !== 0">
              <h4>Sentiment Analysis Methods</h4>
              <v-radio-group v-model="selectedSentimentAnalysisMethod" column>
                <v-radio
                  v-for="method in Object.keys(analysisMethods)"
                  :key="method"
                  :label="analysisMethods[method]"
                  :value="method"
                  color="cyan"
                ></v-radio>
              </v-radio-group>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex text-xs-center xs12 md7>
      <sankey-diagram-wrapper
        :id="charts.sankey.id"
        :div-id="charts.sankey.divId"
        :label="charts.sankey.label"
        :width="charts.sankey.width"
        :height="charts.sankey.height"
        :color="color"
        :flat="flat"
        :selected-ml-method="selectedMachineLearningMethod"
        :dataset="sankeyData"
      ></sankey-diagram-wrapper>
    </v-flex>
    <v-flex text-xs-center xs12 md5>
      <scatter-plot-wrapper
        :id="charts.scatterplot.id"
        :div-id="charts.scatterplot.divId"
        :label="charts.scatterplot.label"
        :width="charts.scatterplot.width"
        :height="charts.scatterplot.height"
        :selected-analysis-method="selectedSentimentAnalysisMethod"
        :color="color"
        :flat="flat"
        :dataset="dataset"
      ></scatter-plot-wrapper>
    </v-flex>
    <v-flex text-xs-center xs12 md8>
      <heat-map-wrapper
        :id="charts.heatmap.id"
        :div-id="charts.heatmap.divId"
        :label="charts.heatmap.label"
        :width="charts.heatmap.width"
        :height="charts.heatmap.height"
        :color="color"
        :flat="flat"
        :dataset="heatmapData"
      ></heat-map-wrapper>
    </v-flex>
    <v-flex text-xs-center xs12 md4>
      <v-card color="transparent" :flat="flat">
        <v-card-title>
          <h2>
            Extra Tweets...
          </h2>
        </v-card-title>
        <v-card-text></v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
// import { _ } from 'vue-underscore'
import ScatterPlotWrapper from '../components/Scatterplot/ScatterPlotWrapper'
import HeatMapWrapper from '../components/Heatmap/HeatMapWrapper'
import SankeyDiagramWrapper from '../components/Sankey/SankeyDiagramWrapper'
import socket from '../lib/socket.io'

export default {
  name: 'PageAnalytics',
  components: {
    'sankey-diagram-wrapper': SankeyDiagramWrapper,
    'scatter-plot-wrapper': ScatterPlotWrapper,
    'heat-map-wrapper': HeatMapWrapper
  },
  data() {
    return {
      flat: true,
      color: 'transparent',
      threshold: 20,
      selectedSentimentAnalysisMethod: '',
      selectedMachineLearningMethod: '',
      msg: '',
      temp: [],
      heatmapData: [],
      // Charts and all of their configurations
      charts: {
        scatterplot: {
          id: 'scatter-plot',
          divId: 'scatter-plot-div',
          label: 'User Influence Vs. Average Sentiment',
          width: 600,
          height: 600
        },
        sankey: {
          id: 'sankey-diagram',
          divId: 'sankey-diagram-div',
          label: 'User Categories, Topics, and Content Theme',
          width: 600,
          height: 700
        },
        heatmap: {
          id: 'heatmap',
          divId: 'heatmap-div',
          label: 'HeatMap Soon...',
          width: 600,
          height: 500
        }
      },
      // Data required for connection metrics
      pingPong: {
        start: 0,
        end: 0,
        busy: false,
        history: []
      },
      sankeyData: []
    }
  },
  computed: {
    /*
     * dataset containing the tweets
     */
    dataset() {
      return this.$store.state.tweets.list
    },
    /*
     * the selected sentiment analysis method
     */
    analysisMethods() {
      const res = {}
      for (const tw of this.dataset) {
        for (const mt of tw.analysis) {
          res[mt.id] = mt.title
        }
      }
      return res
    },
    mlMethods() {
      const res = {}
      for (const tw of this.dataset) {
        for (const mt of tw.labels) {
          res[mt.id] = mt.title
        }
      }
      return res
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
  // asyncData({ $axios }) {
  //   return $axios.get('/api/').then(res => {
  //     return { sankeyData: res.data }
  //   })
  // },
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
     * Store the incoming tweets
     */
    socket.on('tweet', msg => {
      const tweet = msg.data
      that.storeTemp(tweet)
    })
    socket.on('bulk-update', msg => {
      const tweets = msg.tweets
      that.sankeyData = msg.aggregate
      for (const tweet of tweets) {
        that.storeTemp(tweet)
      }
    })
  },
  mounted() {
    const that = this
    this.resize()
    window.addEventListener('resize', this.resize)

    // Update dataset (add new data)
    // window.setInterval(function() {
    //   for (let i = 0; i < 10; i++) {
    //     const y = 'v' + parseInt(Math.random() * 6)
    //     const x = 'name-' + parseInt(Math.random() * 10)
    //     const v = Math.random() * 100
    //     that.heatmapData.push({ x: x, y: y, v: v })
    //   }
    // }, 3000)

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
      const scatterDiv = document.getElementById(this.charts.scatterplot.divId)
      const heatDiv = document.getElementById(this.charts.heatmap.divId)
      const sankeyDiv = document.getElementById(this.charts.sankey.divId)
      this.charts.scatterplot.width = scatterDiv.clientWidth - 5
      this.charts.heatmap.width = heatDiv.clientWidth - 5
      this.charts.sankey.width = sankeyDiv.clientWidth - 5
    },
    storeTemp: function(tweet) {
      // Store the actual tweet
      this.temp.push(tweet)
      if (this.temp.length > this.threshold) {
        this.$store.commit('tweets/addBulkTweet', this.temp)
        this.temp = []
      }
    }
  }
}
</script>
