<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-flex xs4 text-xs-center class="boxed" grow>
    <b class="title">{{ title }}</b>
    <v-divider></v-divider>
    <v-flex
      :id="'tweetcollection-' + title"
      style="overflow: auto; height: 55vh;"
    >
      <v-layout :id="'tweetcontainer-' + title" column justify-center>
        <tweet
          v-for="(tweet, index) in sortedTweets"
          :id="'tweet-' + tweet.id_str"
          :key="index"
          :tweet="tweet"
          :selected="tweet.selected"
          @selected="addTweet"
          @deselected="removeTweet"
          @customLabelTweet="updateTweet"
        ></tweet>
      </v-layout>
    </v-flex>
    <v-divider></v-divider>
    <v-container v-if="selectedTweets.length > 0" fluid>
      <v-layout row wrap justify-space-around align-center>
        <v-badge
          v-for="(tweet, index) in selectedTweets"
          :key="index"
          overlap
          color="orange"
          class="badge"
          style="cursor: pointer;"
        >
          <template v-slot:badge>
            <v-icon small dark @click="removeTweet.call(this, tweet)">
              close
            </v-icon>
          </template>
          <v-avatar elevation>
            <img
              :src="tweet.user.profile_image_url_https"
              :alt="tweet.user.screen_name"
              @click="clicked.call({}, tweet)"
            />
          </v-avatar>
        </v-badge>
      </v-layout>
    </v-container>
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
  data() {
    return {
      selectedTweets: []
    }
  },
  computed: {
    sortedTweets() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return this.tweets.sort((a, b) => {
        return a.date < b.date ? 1 : -1
      })
    },
    target() {
      return tweet => {
        return '#' + 'tweet-' + tweet.id_str
      }
    },
    options() {
      return topic => {
        return {
          duration: 300,
          offset: 60,
          easing: 'easeInOutCubic',
          container: '#' + 'tweetcollection-' + topic
        }
      }
    }
  },
  methods: {
    addTweet: function(tweet) {
      tweet.selected = true
      tweet.hover = false
      tweet.exam = false
      if (!this.selectedTweets.map(a => a.id_str).includes(tweet.id_str)) {
        if (this.selectedTweets.length < 4) {
          this.selectedTweets.push(tweet)
          this.$emit('tweetSelect', tweet)
        }
      }
    },
    removeTweet: function(tweet) {
      tweet.selected = false
      const index = this.selectedTweets.findIndex(
        a => a.id_str === tweet.id_str
      )
      this.selectedTweets.splice(index, 1)
      this.$emit('tweetDeselect', tweet)
    },
    updateTweet: function(data) {
      this.$emit('updateTweet', data)
    },
    clicked: function(tweet) {
      // eslint-disable-next-line no-console
      console.log(this.target(tweet), this.options(this.title), this.$vuetify)
      this.$vuetify.goTo(this.target(tweet), this.options(this.title))
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
