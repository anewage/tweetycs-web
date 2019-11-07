<template>
  <v-layout row>
    <v-flex xs3 grow>
      <v-layout column align-space-between justify-start fill-height>
        <v-flex md3 class="grey">
          Topics:
          <v-checkbox
            v-for="(topic, i) in aggregatedTopics"
            :key="i"
            v-model="selectedTopics"
            height="0"
            multiple
            :label="firstLetterUpperCase(topic)"
            :value="topic"
          ></v-checkbox>
        </v-flex>
        <v-flex md3 class="grey">
          User Categories (Sources):
          <v-checkbox
            v-for="(topic, i) in aggregatedTopics"
            :key="i"
            v-model="selectedTopics"
            height="0"
            multiple
            :label="firstLetterUpperCase(topic)"
            :value="topic"
          ></v-checkbox>
        </v-flex>
        <v-flex md3 class="grey">
          Content Themes:
          <v-checkbox
            v-for="(topic, i) in aggregatedTopics"
            :key="i"
            v-model="selectedTopics"
            height="0"
            multiple
            :label="firstLetterUpperCase(topic)"
            :value="topic"
          ></v-checkbox>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs9 grow>
      <v-layout column justify-center fill-height>
        <v-flex style="overflow-x: auto;" shrink>
          <v-layout row justify-start align-center>
            <v-flex v-for="(tweet, i) in tweets" :key="i">
              <tweets
                :tweet="tweet"
                @selected="setDetails"
                @deselected="unsetDetails"
              ></tweets>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex grow class="yellow">
          {{ this.selectedTweet.text }}
        </v-flex>
        <v-flex grow class="teal">
          Sentiment chart
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import Tweets from '../components/Twitter/Tweets'
export default {
  name: 'PageShuffler',
  components: {
    tweets: Tweets
  },
  data() {
    return {
      selectedTopics: [],
      selectedTweet: {},
      tweets: [
        {
          text:
            'Hello my name is Amir and this is my first tweet. I am talking about HIV and this is a hot topic today. Also, vaccines would help if we can make sense of them!\n' +
            'Hello my name is Amir and this is my first tweet. I am talking about HIV and this is a hot topic today. Also, vaccines would help if we do!',
          user: {
            name: 'Jafar',
            screen_name: 'JafarJonDoe',
            verified: true,
            followers_count: 100,
            friends_count: 10,
            statuses_count: 100,
            avg_sentiment: 2.8,
            influence: 35.24
          },
          favorite_count: 23,
          retweet_count: 20,
          selected: false
        }
      ]
    }
  },
  computed: {
    aggregatedTopics() {
      return this.$store.state.aggregatedUsers
    }
  },
  mounted() {
    // const that = this
    // const users = ['title', 'amit', 'jafar', 'taghi', 'naghi']
    // setInterval(() => {
    //   // this.$store.commit('updateAggregatedUsers', users)
    //   that.tweets.push({
    //     text:
    //       'Hello my name is Amir and this is my first tweet. I am talking about HIV and this is a hot topic today. Also, vaccines would help if we can make sense of them!\n' +
    //       'Hello my name is Amir and this is my first tweet. I am talking about HIV and this is a hot topic today. Also, vaccines would help if we do!',
    //     user: {
    //       name: 'Jafar',
    //       screen_name: 'JafarJonDoe',
    //       verified: true,
    //       followers_count: 100,
    //       friends_count: 10,
    //       statuses_count: 100,
    //       avg_sentiment: 2.8,
    //       influence: 35.24
    //     },
    //     favorite_count: 23,
    //     retweet_count: 20,
    //     selected: false
    //   })
    // }, 2000)
  },
  methods: {
    firstLetterUpperCase: function(str) {
      return str.charAt(0).toUpperCase() + str.substring(1)
    },
    setDetails: function(tweet) {
      this.selectedTweet = tweet
      for (const t of this.tweets) t.selected = false
      tweet.selected = true
    },
    unsetDetails: function(tweet) {
      this.selectedTweet = {}
      for (const t of this.tweets) t.selected = false
    }
  }
}
</script>

<style scoped></style>
