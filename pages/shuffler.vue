<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout row>
    <v-flex :xs2="!minimizeTopics" :xs1="minimizeTopics" shrink>
      <v-layout column align-space-between justify-start fill-height wrap>
        <v-flex>
          <v-card flat>
            <v-toolbar card color="grey lighten-3">
              <v-btn
                :color="minimizeTopics ? 'grey' : 'indigo'"
                icon
                flat
                dark
                @click="minimizeTopics = !minimizeTopics"
              >
                <v-icon>
                  {{ `chevron_${minimizeTopics ? 'right' : 'left'}` }}
                </v-icon>
              </v-btn>
              <v-toolbar-title v-if="!minimizeTopics">Topics</v-toolbar-title>
              <v-spacer></v-spacer>
              <!--              <v-dialog v-model="dialog" max-width="600px">-->
              <!--                <template v-slot:activator="{ on }">-->
              <!--                  <v-btn flat icon color="primary" v-on="on">-->
              <!--                    <v-icon>edit</v-icon>-->
              <!--                  </v-btn>-->
              <!--                </template>-->
              <!--                <v-card>-->
              <!--                  <v-card-title>-->
              <!--                    <span class="headline">Edit/Add Topic</span>-->
              <!--                  </v-card-title>-->
              <!--                  <v-card-text>-->
              <!--                    <v-container grid-list-md>-->
              <!--                      <v-layout wrap>-->
              <!--                        <v-flex xs12>-->
              <!--                          <v-combobox-->
              <!--                            v-model="temp_topic.channel"-->
              <!--                            :items="channels"-->
              <!--                            item-text="name"-->
              <!--                            item-value="id"-->
              <!--                            :return-object="false"-->
              <!--                            :search-input.sync="search"-->
              <!--                            label="Topic*"-->
              <!--                            hint="Select an existing topic or add a new one."-->
              <!--                            persistent-hint-->
              <!--                          >-->
              <!--                            <template v-slot:no-data>-->
              <!--                              <v-list-tile>-->
              <!--                                <v-list-tile-content>-->
              <!--                                  <v-list-tile-title>-->
              <!--                                    No results matching "<strong>{{-->
              <!--                                      search-->
              <!--                                    }}</strong>-->
              <!--                                    ". Press <kbd>enter</kbd> to create a new-->
              <!--                                    one-->
              <!--                                  </v-list-tile-title>-->
              <!--                                </v-list-tile-content>-->
              <!--                              </v-list-tile>-->
              <!--                            </template>-->
              <!--                          </v-combobox>-->
              <!--                        </v-flex>-->
              <!--                        <v-flex xs12>-->
              <!--                          <v-combobox-->
              <!--                            v-model="temp_topic.keywords"-->
              <!--                            :items="getChildren(temp_topic.channel)"-->
              <!--                            :value="getChildren(temp_topic.channel)"-->
              <!--                            item-text="name"-->
              <!--                            item-value="id"-->
              <!--                            :return-object="false"-->
              <!--                            :search-input.sync="search2"-->
              <!--                            label="Keyword(s)"-->
              <!--                            hint="Add new keywords"-->
              <!--                            multiple-->
              <!--                            persistent-hint-->
              <!--                            chips-->
              <!--                            deletable-chips-->
              <!--                          >-->
              <!--                            <template v-slot:no-data>-->
              <!--                              <v-list-tile>-->
              <!--                                <v-list-tile-content>-->
              <!--                                  <v-list-tile-title>-->
              <!--                                    No results matching "<strong>{{-->
              <!--                                      search2-->
              <!--                                    }}</strong>-->
              <!--                                    ". Press <kbd>enter</kbd> to create a new-->
              <!--                                    one-->
              <!--                                  </v-list-tile-title>-->
              <!--                                </v-list-tile-content>-->
              <!--                              </v-list-tile>-->
              <!--                            </template>-->
              <!--                          </v-combobox>-->
              <!--                        </v-flex>-->
              <!--                      </v-layout>-->
              <!--                    </v-container>-->
              <!--                    <small>*indicates required field</small>-->
              <!--                  </v-card-text>-->
              <!--                  <v-card-actions>-->
              <!--                    <v-spacer></v-spacer>-->
              <!--                    <v-btn-->
              <!--                      color="blue darken-1"-->
              <!--                      flat-->
              <!--                      @click="closeDialog(false)"-->
              <!--                    >-->
              <!--                      Close-->
              <!--                    </v-btn>-->
              <!--                    <v-btn-->
              <!--                      color="blue darken-1"-->
              <!--                      flat-->
              <!--                      @click="closeDialog(true)"-->
              <!--                    >-->
              <!--                      Save-->
              <!--                    </v-btn>-->
              <!--                  </v-card-actions>-->
              <!--                </v-card>-->
              <!--              </v-dialog>-->
              <v-btn flat icon color="red" @click="topicsTreeSelections = []">
                <v-icon>replay</v-icon>
              </v-btn>
            </v-toolbar>

            <v-layout>
              <v-flex>
                <v-card-text class="text-truncate">
                  <v-treeview
                    v-model="topicsTreeSelections"
                    class="text-truncate"
                    :items="topicItems"
                    selected-color="indigo"
                    activatable
                    multiple-active
                    open-on-click
                    selectable
                    expand-icon="expand_more"
                  >
                  </v-treeview>
                </v-card-text>
              </v-flex>
            </v-layout>
          </v-card>
          <!--          <v-card flat>-->
          <!--            <v-toolbar card color="grey lighten-3">-->
          <!--              <v-icon>class</v-icon>-->
          <!--              <v-toolbar-title>Sources</v-toolbar-title>-->
          <!--              <v-spacer></v-spacer>-->
          <!--              <v-btn-->
          <!--                flat-->
          <!--                icon-->
          <!--                color="red"-->
          <!--                @click="userGroupsTreeSelections = []"-->
          <!--              >-->
          <!--                <v-icon>replay</v-icon>-->
          <!--              </v-btn>-->
          <!--            </v-toolbar>-->

          <!--            <v-layout>-->
          <!--              <v-flex>-->
          <!--                <v-card-text-->
          <!--                  style="overflow-wrap: break-word; word-wrap: break-word; hyphens: auto;"-->
          <!--                >-->
          <!--                  <v-treeview-->
          <!--                    v-model="userGroupsTreeSelections"-->
          <!--                    :items="userGroupItems"-->
          <!--                    selected-color="indigo"-->
          <!--                    activatable-->
          <!--                    multiple-active-->
          <!--                    open-on-click-->
          <!--                    selectable-->
          <!--                    expand-icon="expand_more"-->
          <!--                  >-->
          <!--                  </v-treeview>-->
          <!--                </v-card-text>-->
          <!--              </v-flex>-->
          <!--            </v-layout>-->
          <!--          </v-card>-->
          <!--          <v-card flat>-->
          <!--            <v-toolbar card color="grey lighten-3">-->
          <!--              <v-icon>class</v-icon>-->
          <!--              <v-toolbar-title>Content Themes</v-toolbar-title>-->
          <!--              <v-spacer></v-spacer>-->
          <!--              <v-btn-->
          <!--                flat-->
          <!--                icon-->
          <!--                color="red"-->
          <!--                @click="contentThemeTreeSelections = []"-->
          <!--              >-->
          <!--                <v-icon>replay</v-icon>-->
          <!--              </v-btn>-->
          <!--            </v-toolbar>-->

          <!--            <v-layout>-->
          <!--              <v-flex>-->
          <!--                <v-card-text-->
          <!--                  style="overflow-wrap: break-word; word-wrap: break-word; hyphens: auto;"-->
          <!--                >-->
          <!--                  <v-treeview-->
          <!--                    v-model="contentThemeTreeSelections"-->
          <!--                    :items="contentThemeItems"-->
          <!--                    selected-color="indigo"-->
          <!--                    activatable-->
          <!--                    multiple-active-->
          <!--                    open-on-click-->
          <!--                    selectable-->
          <!--                    expand-icon="expand_more"-->
          <!--                  >-->
          <!--                  </v-treeview>-->
          <!--                </v-card-text>-->
          <!--              </v-flex>-->
          <!--            </v-layout>-->
          <!--          </v-card>-->
        </v-flex>
      </v-layout>
    </v-flex>
    <v-flex :xs10="!minimizeTopics" :xs11="minimizeTopics">
      <!--      <v-btn block flat color="error" dark @click="rawTweets = []">-->
      <!--        Empty Results-->
      <!--        <v-icon right>delete</v-icon>-->
      <!--      </v-btn>-->
      <v-layout column justify-center fill-height>
        <v-flex id="topics-columns" class="smooth-scroll" grow>
          <v-layout row>
            <v-flex v-if="selectedChannels.length === 0" style="height: 55vh;">
              <v-layout
                column
                justify-center
                align-center
                text-xs-center
                fill-height
              >
                <h3 class="display-2 grey--text">
                  Please select some topics or keywords...
                </h3>
                <v-btn loading disabled icon></v-btn>
              </v-layout>
            </v-flex>
            <tweet-collection
              v-for="(channel, index) in selectedChannels"
              :id="'column-' + channel"
              :key="'channel-' + index + '-' + channel"
              :tweets="
                filteredTweets.filter(a =>
                  Object.keys(a.topics).includes(channel)
                )
              "
              :title="channel"
              @tweetSelect="tweetSelect"
              @tweetDeselect="tweetDeselect"
              @updateTweet="updateTweet"
            ></tweet-collection>
            <!--            <v-flex v-for="(tweet, i) in filteredTweets" :key="i">-->
            <!--              <tweet-->
            <!--                :tweet="tweet"-->
            <!--                :selected="tweet.selected"-->
            <!--                @selected="setDetails"-->
            <!--                @deselected="unsetDetails"-->
            <!--                @customLabelTweet="updateTweet"-->
            <!--              ></tweet>-->
            <!--              &lt;!&ndash;              <test-tweet :id-str="tweet.id_str"></test-tweet>&ndash;&gt;-->
            <!--            </v-flex>-->
          </v-layout>
        </v-flex>
        <v-flex :id="charts.contextMap.divId" grow text-xs-center>
          <context-map-wrapper
            :id="charts.contextMap.id"
            :div-id="charts.contextMap.divId"
            :label="charts.contextMap.label"
            :width="charts.contextMap.width"
            :height="charts.contextMap.height"
            :topics="topics.map(a => a.id).sort()"
            :tweets="selectedTweets"
            :color="color"
            :flat="flat"
            @topicSelected="topicSelected"
            @tweetClicked="toggleTweetExamMenu"
          ></context-map-wrapper>
        </v-flex>
        <v-divider></v-divider>
        <v-flex>
          <v-layout row>
            <v-flex
              v-for="(tweet, index) in examMenu"
              :key="'examMenu-' + index"
              xs3
            >
              <tweet :tweet="tweet" :selected="tweet.selected"></tweet>
            </v-flex>
          </v-layout>
        </v-flex>
        <!--        <v-flex :id="charts.scatterplot.divId" grow text-xs-center>-->
        <!--          <sunburst-wrapper-->
        <!--            :id="charts.sunburst.id"-->
        <!--            :div-id="charts.sunburst.divId"-->
        <!--            :width="charts.sunburst.width"-->
        <!--            :height="charts.sunburst.height"-->
        <!--            :dataset="topicItems"-->
        <!--          ></sunburst-wrapper>-->
        <!--          <scatter-plot-wrapper-->
        <!--            :id="charts.scatterplot.id"-->
        <!--            :div-id="charts.scatterplot.divId"-->
        <!--            :label="charts.scatterplot.label"-->
        <!--            :width="charts.scatterplot.width"-->
        <!--            :height="charts.scatterplot.height"-->
        <!--            :axes-meta="charts.scatterplot.axesMeta"-->
        <!--            :line="charts.scatterplot.line"-->
        <!--            :selected-data="selectedTweet"-->
        <!--            :sift-dataset="false"-->
        <!--            :dataset="filteredTweets"-->
        <!--            :toolbox="false"-->
        <!--            @circleClicked="-->
        <!--              data => {-->
        <!--                selectedTweet = data-->
        <!--              }-->
        <!--            "-->
        <!--          ></scatter-plot-wrapper>-->
        <!--          <v-data-table-->
        <!--            :headers="selectedTweetCategorizationHeaders"-->
        <!--            :items="selectedTweet.labels"-->
        <!--            hide-actions-->
        <!--          >-->
        <!--            <template v-slot:items="props">-->
        <!--              <td>{{ props.item.id }}</td>-->
        <!--              <td>{{ props.item.result.group }}</td>-->
        <!--              <td>{{ props.item.result.theme }}</td>-->
        <!--            </template>-->
        <!--          </v-data-table>-->
        <!--        </v-flex>-->
      </v-layout>
    </v-flex>
  </v-layout>
</template>

<script>
import socket from '../lib/socket.io'
import TweetCollection from '../components/Twitter/TweetCollection'
import ContextMapWrapper from '../components/ContextMap/ContextMapWrapper'
import Tweet from '../components/Twitter/Tweet'
export default {
  name: 'PageShuffler',
  // layout: 'shuffler',
  components: {
    TweetCollection,
    'context-map-wrapper': ContextMapWrapper,
    tweet: Tweet
  },
  data() {
    return {
      dialog: false,
      contentThemeTreeSelections: [],
      userGroupsTreeSelections: [],
      selectedTweets: [],
      examMenu: [],
      charts: {
        contextMap: {
          id: 'scatter-plot',
          divId: 'scatter-plot-div',
          label: 'Context Menu',
          width: 700,
          height: 300,
          line: {
            show: true,
            fill: 'none',
            stroke: 'grey',
            stroke_width: '1.0'
          },
          axesMeta: {
            x: {
              selector: 'x',
              // Starting from 24 hours earlier 5 minues from now
              initialBound: [
                Date.now() - 24 * 60 * 60 * 1000,
                Date.now() + 1 * 5 * 60 * 1000
              ],
              scaleToContent: false,
              zoomEnabled: true,
              label: 'Time',
              isTime: true,
              show: false
            },
            y: {
              selector: 'y',
              initialBound: [-1, 1],
              scaleToContent: false,
              zoomEnabled: false,
              label: 'Average Sentiment',
              show: false
            }
          }
        },
        sunburst: {
          id: 'sunburst',
          divId: 'sunburst-div',
          width: 300,
          height: 300
        }
      }
    }
  },
  computed: {
    target() {
      return channel => {
        const id = 'column-' + channel
        if (document.getElementById(id)) return '#' + id
        else return '#topics-columns'
      }
    },
    options() {
      return {
        duration: 300,
        offset: 60,
        easing: 'easeInOutCubic',
        container: '#topics-columns'
      }
    },
    minimizeTopics: {
      set(val) {
        this.$store.commit('shuffler/updateMinimizeTopics', val)
      },
      get() {
        return this.$store.state.shuffler.minimizeTopics
      }
    },
    topicsTreeSelections: {
      set(val) {
        this.$store.commit('shuffler/updateTopicsTreeSelections', val)
      },
      get() {
        return this.$store.state.shuffler.topicsTreeSelections
      }
    },
    filteredTweets() {
      let res = []
      for (const kw of this.topicsTreeSelections) {
        const tweets = this.tweets.filter(t => t.keywords.includes(kw))
        res = [...res, ...tweets]
      }
      return res
    },
    selectedChannels() {
      const res = []
      for (const item of this.filteredTweets.map(a => Object.keys(a.topics)))
        for (const topic of item) if (!res.includes(topic)) res.push(topic)
      return res.sort()
    },
    userGroupItems() {
      // this.tweets().map(tw => tw.labels[i].result.group)
      return []
    },
    contentThemeItems() {
      return []
    },
    topicItems() {
      const that = this
      const children = this.topics
        .map(channel => ({
          id: channel.id + '-channel',
          name: that.getName(channel.id),
          children: that.getChildren(channel.id)
        }))
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1
        })
      return [
        {
          id: '1',
          name: 'All Topics',
          children
        }
      ]
    },
    tweets() {
      const uniques = []
      for (const tweet of this.rawTweets) {
        if (!uniques.map(a => a.id_str).includes(tweet.id_str))
          uniques.push(tweet)
      }
      return uniques
        .map(tw => {
          return {
            ...tw,
            date: new Date(tw.created_at).getTime(),
            selected: false
          }
        })
        .sort((a, b) => {
          return a.date > b.date ? 1 : -1
        })
    },
    selectedTweetCategorizationHeaders() {
      return [
        {
          text: 'Labeling Method',
          align: 'left',
          sortable: true,
          value: 'title'
        },
        {
          text: 'User Group',
          align: 'left',
          sortable: true,
          value: 'result.group'
        },
        {
          text: 'Content Theme',
          align: 'left',
          sortable: true,
          value: 'result.theme'
        }
      ]
    },
    selectedTweetAnalysisHeaders() {
      return [
        {
          text: 'Analysis Method',
          align: 'left',
          sortable: true,
          value: 'title'
        },
        {
          text: 'Sentiment',
          align: 'left',
          sortable: true,
          value: 'result'
        }
      ]
    },
    topics: {
      set(val) {
        this.$store.commit('topics', val)
      },
      get() {
        return this.$store.state.topics
      }
    },
    rawTweets: {
      set(val) {
        this.$store.commit('updateRawTweets', val)
      },
      get() {
        return this.$store.state.rawTweets
      }
    }
  },
  watch: {
    // dialog(val, prev) {
    //   this.temp_topic.channel = ''
    //   this.temp_topic.keywords = []
    // },
    // selections(val, prev) {
    // socket.emit('update_channels', val)
    // }
  },
  mounted() {
    window.addEventListener('resize', this.resize)
    this.resize()
  },
  updated() {
    this.resize()
  },
  methods: {
    resize: function() {
      // const sunburstDiv = document.getElementById(this.charts.sunburst.divId)
      // const scatterDiv = document.getElementById(this.charts.scatterplot.divId)
      // if (scatterDiv) this.charts.scatterplot.width = scatterDiv.clientWidth - 5
      // if (sunburstDiv) {
      //   this.charts.sunburst.width = sunburstDiv.clientWidth - 5
      //   this.charts.sunburst.height = sunburstDiv.clientWidth - 5
      // }
      const contextDiv = document.getElementById(this.charts.contextMap.divId)
      if (contextDiv) this.charts.contextMap.width = contextDiv.clientWidth - 5
    },
    getChildren(topic) {
      if (!topic || topic === '') return []
      if (!this.topics.map(a => a.id).includes(topic)) return []
      const keywords = []
      const foundTopic = this.topics.find(a => a.id === topic)
      if (!foundTopic) return []
      for (const keyword of foundTopic.keywords) {
        keywords.push({
          id: keyword.toLowerCase(),
          name: this.getName(keyword)
        })
      }
      return keywords.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    },
    // closeDialog(save) {
    //   if (save)
    //     this.$store.commit('updateSelectedTopic', {
    //       channel: this.temp_topic.channel,
    //       keywords: this.temp_topic.keywords
    //     })
    //   this.dialog = false
    // },
    getName(name) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    },
    tweetSelect: function(tweet) {
      if (!this.selectedTweets.map(a => a.id_str).includes(tweet.id_str))
        this.selectedTweets.push(tweet)
    },
    tweetDeselect: function(tweet) {
      const index = this.selectedTweets.findIndex(
        a => a.id_str === tweet.id_str
      )
      this.selectedTweets.splice(index, 1)
    },
    updateTweet: function(data) {
      socket.emit('update_labeling', data)
      // eslint-disable-next-line no-console
      console.log('emitted', data)
      const tweet = data.tweet
      const label = tweet.labels.find(a => a.id === 'custom')
      if (label) {
        label.result.group = data.group
        label.result.theme = data.theme
      } else
        tweet.labels.push({
          id: 'custom',
          result: {
            group: data.group,
            theme: data.theme
          }
        })
    },
    topicSelected(data) {
      // eslint-disable-next-line no-console
      const container = document.getElementById('column-' + data)
      if (container)
        container.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'start'
        })
    },
    toggleTweetExamMenu(tweet) {
      if (!this.examMenu.map(a => a.id_str).includes(tweet.id_str)) {
        if (this.examMenu.length < 4) {
          tweet.exam = true
          this.examMenu.push(tweet)
        }
      } else {
        const index = this.examMenu.findIndex(a => a.id_str === tweet.id_str)
        this.examMenu.splice(index, 1)
        tweet.exam = false
      }
    }
  }
}
</script>

<style scoped>
.smooth-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
}
</style>
