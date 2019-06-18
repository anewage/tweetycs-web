<template>
  <v-card color="transparent" :flat="flat">
    <v-card-title>
      <h2>
        Extra Tweets...
      </h2>
    </v-card-title>
    <v-card-actions>
      <v-btn icon @click="meta.show = !meta.show">
        <v-icon>{{ meta.show ? 'help' : 'help_outline' }}</v-icon>
      </v-btn>
      <v-btn icon @click="view = !view">
        <v-icon>
          {{ view ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
        </v-icon>
      </v-btn>
    </v-card-actions>
    <v-slide-y-transition>
      <v-card-text v-show="meta.show">
        {{ meta.info }}
      </v-card-text>
    </v-slide-y-transition>
    <v-card-text>
      <tweets
        v-if="view"
        :user="config.user"
        :tweets="config.tweets"
        :avg-sentiment="config.avgSentiment"
        :influence="config.influence"
      ></tweets>
    </v-card-text>
  </v-card>
</template>

<script>
import Tweets from './Tweets'
export default {
  name: 'TweetsWrapper',
  components: {
    tweets: Tweets
  },
  props: {
    config: {
      type: Object,
      default: function() {
        return {
          user: {},
          tweets: [],
          avgSentiment: 0,
          influence: 0
        }
      }
    },
    color: {
      type: String,
      default: 'transparent'
    },
    flat: {
      type: Boolean,
      default: true
    }
  },
  data: function() {
    return {
      meta: {
        show: false,
        info: 'Help...'
      },
      view: true
    }
  },
  watch: {
    config: function(newVal, oldVal) {
      this.view = true
    }
  }
}
</script>

<style scoped></style>
