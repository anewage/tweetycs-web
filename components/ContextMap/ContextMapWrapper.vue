<template>
  <v-card :color="color" :flat="flat">
    <v-card-title v-if="topics.length > 0">
      <h4>{{ label }}</h4>
    </v-card-title>
    <v-card-text>
      <div :id="divId">
        <context-map
          :chart-dom-i-d="id"
          :width="width"
          :height="height"
          :color-range="colorRange"
          :topics="topics"
          :dataset="contextMapData"
          @topicSelected="topicSelected"
          @tweetClicked="tweetClicked"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import ContextMap from './ContextMap'
export default {
  name: 'ContextMapWrapper',
  components: {
    'context-map': ContextMap
  },
  props: {
    id: {
      type: String,
      default: 'heatmap'
    },
    divId: {
      type: String,
      default: 'heatmap-div'
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
    tweets: {
      type: Array,
      default: function() {
        return []
      }
    },
    topics: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      colorRange: ['#d7ffdb', '#006c03'],
      meta: {
        show: false,
        info: 'Hello this is only a help box!'
      }
    }
  },
  computed: {
    contextMapData() {
      return this.tweets
    }
  },
  methods: {
    topicSelected(data) {
      this.$emit('topicSelected', data)
    },
    tweetClicked(data) {
      this.$emit('tweetClicked', data)
    }
  }
}
</script>

<style scoped></style>
