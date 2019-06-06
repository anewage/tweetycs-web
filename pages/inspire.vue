<template>
  <v-layout row wrap>
    <v-flex text-xs-center xs12>
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
      <scatter-plot
        :id="charts.scatterplot.id"
        :width="charts.scatterplot.width"
        :height="charts.scatterplot.height"
        :axes-meta="charts.scatterplot.axesMeta"
        :radius="charts.scatterplot.radius"
        :color-range="charts.scatterplot.colorRange"
        :dataset="scatterplotData"
        :dataset-limit="$store.state.tweets.limit"
      />
      <heat-map
        :id="charts.heatmap.id"
        :width="charts.heatmap.width"
        :height="charts.heatmap.height"
        :dataset="heatmapData"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import { _ } from 'vue-underscore'
import ScatterPlot from '../components/ScatterPlot'
import HeatMap from '../components/HeatMap'
import socket from '../lib/socket.io'
export default {
  name: 'PageInspire',
  components: {
    'scatter-plot': ScatterPlot,
    'heat-map': HeatMap
  },
  data() {
    return {
      // Charts and all of their configurations
      charts: {
        scatterplot: {
          id: 'scatter-plot',
          width: 600,
          height: 500,
          radius: 4,
          colorRange: ['#d4e3f4', '#14004f'],
          axesMeta: {
            x: {
              selector: 'x',
              label: 'User Influence'
            },
            y: {
              selector: 'y',
              label: 'Average Sentiment'
            }
          }
        },
        heatmap: {
          id: 'heatmap',
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
      msg: '',
      temp: [],
      threshold: 20,
      selectedAnalysisMethod: '',
      scatterplotData2: []
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
    },
    userBasedTweets() {
      return _.groupBy(this.dataset, tweet => tweet.user.screen_name)
    },
    scatterplotData() {
      const res = []
      if (this.selectedAnalysisMethod === '') return res
      for (const user in this.userBasedTweets) {
        const tweets = this.userBasedTweets[user]
        res.push({
          // influence
          x:
            tweets[0].user.followers_count / (tweets[0].user.friends_count + 1),

          // sentiment
          y: tweets[0].sentiment,

          // meta data
          tweets: tweets,
          name: user
        })
      }
      return res
    },
    heatmapData() {
      return []
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
      // Keep last 30 samples
      that.pingPong.history = that.pingPong.history.slice(-30)
      that.pingPong.history.push(that.pingPong.end - that.pingPong.start)
      that.pingPong.busy = false
    })
    /*
     * Store the incoming tweets
     */
    socket.on('tweet', msg => {
      const tweet = msg.data
      that.storeTemp(tweet)
    })
  },
  mounted() {
    const that = this
    this.resize()
    window.addEventListener('resize', this.resize)

    // Update dataset (add new data)
    // window.setInterval(function() {
    //   for (let i = 0; i < 10; i++) {
    //     const name = Math.random() * 1000000
    //     // const y = 'v' + parseInt(Math.random() * 6)
    //     const x = Math.random() * 100
    //     const y = Math.random() * 100
    //     that.scatterplotData2.push('addData', { x: x, y: y, name: name })
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
      const scatter = document.getElementById(this.charts.scatterplot.id)
      const heat = document.getElementById(this.charts.heatmap.id)
      this.charts.scatterplot.width = scatter.clientWidth
      this.charts.heatmap.width = heat.clientWidth
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
