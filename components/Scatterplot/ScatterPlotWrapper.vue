<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card :color="color" :flat="flat">
    <v-card-title>
      <h2>
        {{ label }}
      </h2>
    </v-card-title>
    <v-card-actions>
      <v-btn icon @click="meta.show = !meta.show">
        <v-icon>{{ meta.show ? 'help' : 'help_outline' }}</v-icon>
      </v-btn>
      <v-btn icon @click="reset">
        <v-icon>refresh</v-icon>
      </v-btn>

      <v-spacer></v-spacer>

      <span class="caption theme--light">Old:</span>
      <input v-model="colorRange[0]" type="color" />

      <v-spacer></v-spacer>

      <span class="caption theme--light">Recent:</span>
      <input v-model="colorRange[1]" type="color" />

      <v-spacer></v-spacer>

      <v-slider
        v-model="radius"
        hint="Circle size"
        persistent-hint
        thumb-label="always"
        min="1"
        max="20"
        prepend-icon="remove_circle"
        append-icon="add_circle"
        @click:prepend="decrement"
        @click:append="increment"
      >
      </v-slider>
    </v-card-actions>
    <v-slide-y-transition>
      <v-card-text v-show="meta.show">
        {{ meta.info }}
      </v-card-text>
    </v-slide-y-transition>
    <v-card-text>
      <div :id="divId">
        <scatter-plot
          :id="id"
          :width="width"
          :height="height"
          :axes-meta="axesMeta"
          :radius="radius"
          :color-range="colorRange"
          :transform="transform"
          :dataset="scatterplotData"
          @zoomed="zoomed"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { _ } from 'vue-underscore'
import * as d3 from 'd3'
import ScatterPlot from './ScatterPlot'
export default {
  name: 'ScatterPlotWrapper',
  components: {
    'scatter-plot': ScatterPlot
  },
  props: {
    id: {
      type: String,
      default: 'scatterplot'
    },
    divId: {
      type: String,
      default: 'scatterplot-div'
    },
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: 'transparent'
    },
    flat: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: 'This Amazing Scatter Plot'
    },
    dataset: {
      type: Array,
      default: function() {
        return []
      }
    },
    selectedAnalysisMethod: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      radius: 4,
      transform: d3.zoomIdentity,
      colorRange: ['#d4e3f4', '#14004f'],
      meta: {
        show: false,
        info: 'Hello this is only a help box!'
      },
      axesMeta: {
        x: {
          selector: 'x',
          zoomEnabled: true,
          label: 'User Influence'
        },
        y: {
          selector: 'y',
          zoomEnabled: false,
          label: 'Average Sentiment'
        }
      }
    }
  },
  computed: {
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
    }
  },
  methods: {
    zoomed: function(transform) {
      this.transform = transform
    },
    increment: function() {
      this.radius += 1
    },
    decrement: function() {
      this.radius -= 1
    },
    pause: function() {},
    reset: function() {
      this.transform = d3.zoomIdentity
      this.colorRange = ['#d4e3f4', '#14004f']
      this.radius = 4
    }
  }
}
</script>

<style scoped></style>
