<template>
  <div id="timeline-target">
    <time-line
      v-if="username"
      :id="username"
      ref="timeline"
      source-type="profile"
      :options="options"
    ></time-line>
  </div>
</template>

<script>
import { Timeline } from 'vue-tweet-embed'
export default {
  name: 'UserProfile',
  components: {
    'time-line': Timeline
  },
  props: {
    username: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: function() {
        return {
          tweetLimit: '10',
          chrome: 'transparent',
          dnt: 'true'
        }
      }
    }
  },
  updated() {
    if (window.twttr) {
      document.getElementById('timeline-target').innerHTML = ''
      window.twttr.widgets.createTimeline(
        {
          sourceType: 'profile',
          screenName: this.username
        },
        document.getElementById('timeline-target'),
        this.options
      )
    }
  }
}
</script>

<style scoped></style>
