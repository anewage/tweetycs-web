<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout row text-xs-left>
    <v-flex>
      <v-card
        hover
        class="`elevation-${hover ? 12 : 2}`"
        :color="!contextMenu && selected ? 'blue lighten-5' : 'white'"
        style="flex: initial !important; overflow: hidden;"
      >
        <v-card-actions>
          <v-list-tile class="grow" style="max-width: 70%;">
            <v-list-tile-avatar>
              <v-img
                class="elevation-6"
                :src="tweet.user.profile_image_url_https || '/person.png'"
              ></v-img>
              <v-icon
                v-if="tweet.user.verified"
                color="primary"
                class="subheading"
              >
                check
              </v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content style="margin-left: -4px;">
              <v-list-tile-title>{{ tweet.user.name }}</v-list-tile-title>
              <v-list-tile-sub-title class="caption">
                <a
                  style="text-decoration: none;"
                  :href="'https://twitter.com/' + tweet.user.screen_name"
                  target="_blank"
                >
                  @{{ tweet.user.screen_name }}
                </a>
              </v-list-tile-sub-title>
            </v-list-tile-content>
            <!--            <v-spacer></v-spacer>-->
            <!--            <v-layout align-center justify-end>-->
            <!--              <v-icon class="mr-1" small>favorite</v-icon>-->
            <!--              <span class="subheading mr-2">{{ tweet.favorite_count }}</span>-->
            <!--              <v-icon class="mr-1" small>share</v-icon>-->
            <!--              <span class="subheading">{{ tweet.retweet_count }}</span>-->
            <!--            </v-layout>-->
          </v-list-tile>
          <v-spacer></v-spacer>
          <span class="caption">{{ niceDate }}</span>
          <v-btn v-if="!contextMenu" flat fab icon small @click="clicked">
            <v-icon color="indigo">
              {{ tweet.selected ? 'remove_circle' : 'add_circle' }}
            </v-icon>
          </v-btn>
          <v-dialog v-model="dialog" max-width="600px">
            <template v-slot:activator="{ on }">
              <v-btn flat fab icon small color="red" v-on="on">
                <v-icon>edit</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">Edit Tweet Labeling</span>
              </v-card-title>
              <v-card-text>
                <v-container grid-list-md>
                  <v-layout row wrap>
                    <!--  eslint-disable-next-line vue/no-v-html-->
                    <v-flex xs12 v-html="decoratedText"></v-flex>
                    <v-flex xs6>
                      <v-combobox
                        v-model="customGroup"
                        :items="groups"
                        chips
                        label="User Category"
                        clearable
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            :key="JSON.stringify(data.item)"
                            :selected="data.selected"
                            class="v-chip--select-multi"
                            @click.stop="data.parent.selectedIndex = data.index"
                            @input="data.parent.selectItem(data.item)"
                          >
                            <v-avatar class="accent white--text">
                              <v-icon>account_circle</v-icon>
                            </v-avatar>
                            {{ data.item }}
                          </v-chip>
                        </template>
                      </v-combobox>
                    </v-flex>
                    <v-flex xs6>
                      <v-combobox
                        v-model="customTheme"
                        :items="themes"
                        chips
                        label="Content Theme"
                        clearable
                      >
                        <template v-slot:selection="data">
                          <v-chip
                            :key="JSON.stringify(data.item)"
                            :selected="data.selected"
                            class="v-chip--select-multi"
                            @click.stop="data.parent.selectedIndex = data.index"
                            @input="data.parent.selectItem(data.item)"
                          >
                            <v-avatar class="accent white--text">
                              <v-icon>tag</v-icon>
                            </v-avatar>
                            {{ data.item }}
                          </v-chip>
                        </template>
                      </v-combobox>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" flat @click="closeDialog(false)">
                  Close
                </v-btn>
                <v-btn color="blue darken-1" flat @click="closeDialog(true)">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn flat fab icon small @click="expand = !expand">
            <v-icon>{{ expand ? 'menu' : 'menu_open' }}</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-layout row wrap>
            <v-flex v-show="expand" xs12 class="transition-ease-in-out">
              <v-tabs v-model="active" centered grow slider-color="grey">
                <v-tab ripple>
                  <v-icon>emoji_emotions</v-icon>
                </v-tab>
                <v-tab ripple>
                  <v-icon>speaker_notes</v-icon>
                </v-tab>
                <v-tab-item>
                  <div
                    v-for="label in sortedAnalysis"
                    :key="label.id"
                    class="text-xs-center"
                  >
                    <span>{{ label.id }}: </span>
                    <v-chip
                      :color="label.result > 0 ? 'green' : 'orange'"
                      outline
                    >
                      <v-avatar style="margin-right: 0px;">
                        <v-icon>
                          {{ label.result > 0 ? 'mood' : 'mood_bad' }}
                        </v-icon>
                      </v-avatar>
                      <strong>{{ (+label.result).toPrecision(2) }}</strong>
                    </v-chip>
                    <v-divider></v-divider>
                  </div>
                </v-tab-item>
                <v-tab-item>
                  <div
                    v-for="label in sortedLabels"
                    :key="label.id"
                    class="text-xs-center"
                  >
                    <span>{{ label.id }}: </span> <br />
                    <v-chip :color="colorScale(label.result.group)" outline>
                      <v-avatar style="margin-right: 0px;">
                        <v-icon>account_circle</v-icon>
                      </v-avatar>
                      <strong>{{ label.result.group }}</strong>
                    </v-chip>
                    <v-chip :color="colorScale(label.result.theme)" outline>
                      <v-avatar style="margin-right: 0px;">
                        <v-icon>label</v-icon>
                      </v-avatar>
                      <strong>{{ label.result.theme }}</strong>
                    </v-chip>
                    <v-divider></v-divider>
                  </div>
                </v-tab-item>
              </v-tabs>
            </v-flex>
            <v-flex xs12>
              <span v-if="tweet.possibly_sensitive" class="red--text caption">
                Possibly Sensitive
              </span>
              <!--  eslint-disable-next-line vue/no-v-html-->
              <div class="body-2" v-html="decoratedText"></div>
              <!--              <span-->
              <!--                v-if="tweet.labels.find(a => a.id === 'custom')"-->
              <!--                class="red&#45;&#45;text"-->
              <!--              >-->
              <!--                {{ tweet.labels.find(a => a.id === 'custom') }}-->
              <!--              </span>-->
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import * as d3 from 'd3'
export default {
  name: 'Tweet',
  props: {
    contextMenu: {
      type: Boolean,
      default: false
    },
    avgSentiment: {
      type: Number,
      default: 0
    },
    influence: {
      type: Number,
      default: 0
    },
    selected: {
      type: Boolean,
      default: false
    },
    tweet: {
      type: Object,
      default: function() {
        return {
          id: 'sample',
          text:
            'sample ldsfkgj sldfkhglsjdfhg ldskjfhg ;ahglwerhgipuweyrg phg phgwiehg iw45thg 09q4yhgeohgwelrugh ogowhg wiergh pwhg pihg pwhgpeqhg pqhgqphg phgeh ieqwhg oiwhg iwehg ',
          created_at: new Date('2019-06-18 00:26:53.000').toDateString(),
          retweet_count: 100,
          favorite_count: 100,
          possibly_sensitive: false,
          selected: false,
          user: {
            name: 'John Doe',
            screen_name: 'JohnDoe',
            verified: true,
            followers_count: 100,
            friends_count: 10,
            statuses_count: 100,
            avg_sentiment: 2.8,
            influence: 35.24,
            profile_image_url_https:
              'https://pbs.twimg.com/profile_images/942858479592554497/BbazLO9L_normal.jpg',
            profile_background_image_url_https:
              'https://abs.twimg.com/images/themes/theme4/bg.gif'
          },
          analysis: {
            id: 'folan',
            title: 'Folan',
            result: 0.88
          }
        }
      }
    }
  },
  data() {
    return {
      dialog: false,
      tempGroup: '',
      tempTheme: '',
      expand: false,
      active: 0
    }
  },
  computed: {
    colorScale() {
      return d3.scaleOrdinal(d3.schemeCategory10)
    },
    sortedLabels() {
      return this.tweet.labels
    },
    sortedAnalysis() {
      return this.tweet.analysis
    },
    groups() {
      return this.sortedLabels.map(a => a.result.group)
    },
    themes() {
      return this.sortedLabels.map(a => a.result.theme)
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
    niceDate() {
      const date = new Date(this.tweet.created_at)
      const now = new Date()
      const diff = now.getTime() - date.getTime()
      const secs = diff / 1000
      const mins = diff / (1000 * 60)
      const hours = diff / (1000 * 60 * 60)
      const days = diff / (1000 * 60 * 60 * 24)
      const weeks = diff / (1000 * 60 * 60 * 24 * 7)
      if (weeks > 1) return ~~weeks + 'w'
      else if (days > 1) return ~~days + 'd'
      else if (hours > 1) return ~~hours + 'h'
      else if (mins > 1) return ~~mins + 'm'
      else return ~~secs + 's'
    },
    customGroup: {
      get: function() {
        const label = this.tweet.labels.find(t => t.id === 'custom')
        let group = this.tempGroup
        if (label) group = label.result.group
        return group
      },
      set: function(val) {
        this.tempGroup = val
      }
    },
    customTheme: {
      get: function() {
        const label = this.tweet.labels.find(t => t.id === 'custom')
        let theme = this.tempTheme
        if (label) theme = label.result.theme
        return theme
      },
      set: function(val) {
        this.tempTheme = val
      }
    },
    decoratedText: function() {
      let text = this.tweet.original_text
      for (const kw of this.tweet.keywords) {
        const regEx = new RegExp(kw, 'ig')
        text = text.replace(regEx, (matched, index, original) => {
          return '<mark>' + matched + '</mark>'
        })
      }
      return (
        '<p>' +
        text
          .replace(/RT/g, '<b>RT</b>')
          // Links
          .replace(
            /(https:\/\/)?(http:\/\/)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/g,
            (matched, index, original) => {
              return (
                '<a style="text-decoration: none;" href="' +
                matched +
                '" target="_blank">' +
                matched +
                '</a>'
              )
            }
          )
          // Mentions
          .replace(/(@[A-z])\w+/g, (matched, index, original) => {
            return (
              '<a style="text-decoration: none;" href="https://twitter.com/' +
              matched +
              '" target="_blank">' +
              matched +
              '</a>'
            )
          })
          // Hashtags
          .replace(/(#[A-z])\w+/g, (matched, index, original) => {
            return (
              '<a style="text-decoration: none;" href="https://twitter.com/search?q=%23' +
              matched +
              '" target="_blank">' +
              matched +
              '</a>'
            )
          }) +
        '</p>'
      )
    }
  },
  methods: {
    clicked: function() {
      if (this.tweet.selected) this.$emit('deselected', this.tweet)
      else this.$emit('selected', this.tweet)
    },
    closeDialog(save) {
      if (save)
        this.$emit('customLabelTweet', {
          tweet: this.tweet,
          group: this.tempGroup,
          theme: this.tempTheme
        })
      this.dialog = false
      // eslint-disable-next-line no-console
      console.log(this.tweet.text, this.customGroup, this.customTheme)
    }
  }
}
</script>

<style scoped>
.boxed {
  border-style: solid;
  border-width: thin;
  border-color: #cecece;
}
</style>
