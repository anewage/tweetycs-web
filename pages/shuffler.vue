<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout row>
    <v-flex xs3 grow>
      <v-layout column align-space-between justify-start fill-height>
        <v-flex md3>
          <v-card flat>
            <v-toolbar card color="grey lighten-3">
              <v-icon>class</v-icon>
              <v-toolbar-title>Topics</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-dialog v-model="dialog" max-width="600px">
                <template v-slot:activator="{ on }">
                  <v-btn flat icon color="primary" v-on="on">
                    <v-icon>edit</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">Edit/Add Topic</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <v-combobox
                            v-model="temp_topic.channel"
                            :items="channels"
                            item-text="name"
                            item-value="id"
                            :return-object="false"
                            :search-input.sync="search"
                            label="Topic*"
                            hint="Select an existing topic or add a new one."
                            persistent-hint
                          >
                            <template v-slot:no-data>
                              <v-list-tile>
                                <v-list-tile-content>
                                  <v-list-tile-title>
                                    No results matching "<strong>{{
                                      search
                                    }}</strong>
                                    ". Press <kbd>enter</kbd> to create a new
                                    one
                                  </v-list-tile-title>
                                </v-list-tile-content>
                              </v-list-tile>
                            </template>
                          </v-combobox>
                        </v-flex>
                        <v-flex xs12>
                          <v-combobox
                            v-model="temp_topic.keywords"
                            :items="getChildren(temp_topic.channel)"
                            :value="getChildren(temp_topic.channel)"
                            item-text="name"
                            item-value="id"
                            :return-object="false"
                            :search-input.sync="search2"
                            label="Keyword(s)"
                            hint="Add new keywords"
                            multiple
                            persistent-hint
                            chips
                            deletable-chips
                          >
                            <template v-slot:no-data>
                              <v-list-tile>
                                <v-list-tile-content>
                                  <v-list-tile-title>
                                    No results matching "<strong>{{
                                      search2
                                    }}</strong>
                                    ". Press <kbd>enter</kbd> to create a new
                                    one
                                  </v-list-tile-title>
                                </v-list-tile-content>
                              </v-list-tile>
                            </template>
                          </v-combobox>
                        </v-flex>
                      </v-layout>
                    </v-container>
                    <small>*indicates required field</small>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue darken-1"
                      flat
                      @click="closeDialog(false)"
                    >
                      Close
                    </v-btn>
                    <v-btn
                      color="blue darken-1"
                      flat
                      @click="closeDialog(true)"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn flat icon color="red" @click="tree = []">
                <v-icon>replay</v-icon>
              </v-btn>
            </v-toolbar>

            <v-layout>
              <v-flex>
                <v-card-text>
                  <v-treeview
                    v-model="tree"
                    :items="items"
                    activatable
                    selected-color="indigo"
                    open-on-click
                    selectable
                    expand-icon="expand_more"
                  >
                  </v-treeview>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex xs9>
      <v-layout column justify-center fill-height>
        <v-flex style="overflow-x: auto;" grow>
          <v-layout row justify-start align-start>
            <v-flex v-for="(tweet, i) in tweets" :key="i">
              <tweets
                :tweet="tweet"
                :selected="tweet.selected"
                @selected="setDetails"
                @deselected="unsetDetails"
              ></tweets>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex grow class="yellow">
          {{ JSON.stringify(selectedTweet) }}
        </v-flex>
        <v-flex grow class="teal">
          Sentiment chart
        </v-flex>
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
/* eslint-disable dot-notation */
import Tweets from '../components/Twitter/Tweets'
import socket from '../lib/socket.io'
export default {
  name: 'PageShuffler',
  components: {
    tweets: Tweets
  },
  data() {
    return {
      dialog: false,
      temp_topic: {
        channel: '',
        keywords: []
      },
      tree: [],
      //
      selectedTopics: [],
      search: null,
      search2: null,
      selectedTweet: {},
      tweets: []
    }
  },
  computed: {
    items() {
      const children = Object.keys(this.topics)
        .map(channel => ({
          id: channel,
          name: this.getName(channel),
          children: this.getChildren(channel)
        }))
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1
        })
      return [
        {
          id: 1,
          name: 'All Topics',
          children
        }
      ]
    },
    channels() {
      return this.items[0].children
    },
    selections() {
      const selections = {}
      for (const elem of this.tree) {
        // element is a keyword belonging to a top-level channel
        for (const channel of Object.keys(this.topics))
          if (this.topics[channel].includes(elem)) {
            if (!selections[channel]) selections[channel] = []
            selections[channel].push(elem)
          }
      }
      return selections
    },
    topics: {
      set(val) {
        this.$store.commit('topics', val)
      },
      get() {
        return this.$store.state.topics
      }
    }
  },
  watch: {
    dialog(val, prev) {
      this.temp_topic.channel = ''
      this.temp_topic.keywords = []
    },
    selections(val, prev) {
      socket.emit('update_topics', this.selections)
      // eslint-disable-next-line no-console
      console.log('update req. sent', this.selections)
    }
  },
  beforeMount() {
    const that = this
    socket.on('topics_response', data => {
      that.$store.commit('updateTopics', data)
      for (const key of Object.keys(data)) {
        that.tree.push(key)
        that.tree = [...that.tree, ...data[key]]
      }
    })
    socket.on('connect', data => {
      // eslint-disable-next-line no-console
      socket.emit('topics_request')
    })
    socket.on('tweets', data => {
      that.tweets = [...that.tweets, ...data.tweets]
    })
  },
  methods: {
    getChildren(topic) {
      if (!topic || topic === '') return []
      if (!Object.keys(this.topics).includes(topic)) return []
      const keywords = []
      for (const keyword of this.topics[topic]) {
        keywords.push({
          id: keyword,
          name: this.getName(keyword)
        })
      }
      return keywords.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    closeDialog(save) {
      if (save)
        this.$store.commit('updateSelectedTopic', {
          channel: this.temp_topic.channel,
          keywords: this.temp_topic.keywords
        })
      this.dialog = false
    },
    getName(name) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    },
    setDetails: function(tweet) {
      this.selectedTweet = tweet
      for (const t of this.tweets) t['selected'] = false
      tweet['selected'] = true
    },
    unsetDetails: function(tweet) {
      this.selectedTweet = {}
      for (const t of this.tweets) t['selected'] = false
    }
  }
}
</script>

<style scoped></style>
