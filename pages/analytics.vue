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
        <v-radio-group v-model="selectedAnalysisMethod" row>
          <v-radio
            v-for="method in analysisMethods"
            :key="method.id"
            :label="method.title"
            :value="method.id"
          ></v-radio>
        </v-radio-group>
      </div>
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
        :selected-analysis-method="selectedAnalysisMethod"
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
      selectedAnalysisMethod: '',
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
          label: 'Sankey Soon...',
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
      sankeyData: {
        nodes: [
          { id: 'neoplasms', name: 'Neoplasms' },
          {
            id: 'diarrhea',
            name:
              'Diarrhea, Lower Respiratory Infections, Meningitis, and Other Common Infectious Diseases'
          },
          { id: 'hiv', name: 'HIV/AIDS and Tuberculosis' },
          { id: 'fundraising', name: 'Fundraising' },
          { id: 'promotional', name: 'Promotional' },
          { id: 'public', name: 'Public' },
          { id: 'interest_group', name: 'Intereset Groups' },
          { id: 'media', name: 'Media' }
        ],
        links: [
          { source: 'fundraising', target: 'hiv', value: 10.729 },
          { source: 'hiv', target: 'media', value: 30 },
          { source: 'hiv', target: 'interest_group', value: 15 },
          { source: 'promotional', target: 'neoplasms', value: 9 },
          { source: 'neoplasms', target: 'public', value: 16 },
          { source: 'promotional', target: 'diarrhea', value: 7 },
          { source: 'diarrhea', target: 'public', value: 3 },
          { source: 'diarrhea', target: 'media', value: 5 }
        ]
      }
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
      return this.$store.state.analysisMethods
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
     * Store the incoming tweets
     */
    socket.on('tweet', msg => {
      const tweet = msg.data
      that.storeTemp(tweet)
    })
    socket.on('tweet-bulk', msg => {
      const tweets = msg.data
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
      // Store the analysis methods
      const methods = []
      for (const analysis of tweet.analysis) {
        methods.push({
          id: analysis.id,
          title: analysis.title
        })
      }
      this.$store.commit('addAnalysisMethod', methods)

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
