<template>
  <v-flex xs4 text-xs-center class="boxed">
    <span class="caption">Tweets about</span> <b class="title">{{ title }}</b>
    <v-divider></v-divider>
    <v-flex style="overflow: auto; max-height: 55vh;">
      <v-layout column justify-center>
        <tweet
          v-for="(tweet, index) in sortedTweets"
          :key="index"
          :tweet="tweet"
          :selected="tweet.selected"
          @selected="setDetails"
          @deselected="unsetDetails"
          @customLabelTweet="updateTweet"
        ></tweet>
      </v-layout>
    </v-flex>
  </v-flex>
</template>

<script>
import Tweet from './Tweet'
export default {
  name: 'TweetCollection',
  components: {
    tweet: Tweet
  },
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    tweets: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  computed: {
    sortedTweets() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.tweets.sort((a, b) => {
        return a.date < b.date ? 1 : -1
      })
    }
  },
  methods: {
    setDetails: function(tweet) {
      this.$emit('setDetails', tweet)
    },
    unsetDetails: function(tweet) {
      this.$emit('unsetDetails', tweet)
    },
    updateTweet: function(data) {
      this.$emit('updateTweet', data)
    }
  }
}
</script>

<style scoped>
.boxed {
  border-style: solid;
  border-radius: 11.5px;
  border-color: #cecece;
  max-height: inherit;
}
</style>
