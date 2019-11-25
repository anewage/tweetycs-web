<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-layout row text-xs-left>
    <v-flex>
      <v-card
        hover
        :color="selected ? 'blue lighten-4' : 'white'"
        style="flex: initial !important;"
        min-width="500"
        @click="clicked"
      >
        <v-card-actions>
          <v-list-tile class="grow">
            <v-list-tile-avatar>
              <v-img
                class="elevation-6"
                :src="tweet.user.profile_image_url_https || '/person.png'"
              ></v-img>
              <v-icon v-if="tweet.user.verified" color="primary">
                check
              </v-icon>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ tweet.user.name }}</v-list-tile-title>
              <v-list-tile-sub-title class="tiny">
                <a
                  style="text-decoration: none;"
                  :href="'https://twitter.com/' + tweet.user.screen_name"
                  target="_blank"
                >
                  @{{ tweet.user.screen_name }}
                </a>
              </v-list-tile-sub-title>
            </v-list-tile-content>

            <v-spacer></v-spacer>
            <span v-if="tweet.possibly_sensitive" class="red--text">
              Possibly Sensitive
            </span>
            <span
              v-if="tweet.labels.find(a => a.id === 'custom')"
              class="red--text"
            >
              Custom!
            </span>
            <v-spacer></v-spacer>

            <v-layout align-center justify-end>
              <v-icon class="mr-1" small>favorite</v-icon>
              <span class="subheading mr-2">{{ tweet.favorite_count }}</span>
              <v-icon class="mr-1" small>share</v-icon>
              <span class="subheading">{{ tweet.retweet_count }}</span>
            </v-layout>
          </v-list-tile>
        </v-card-actions>
        <v-card-text>
          <!--  eslint-disable-next-line vue/no-v-html-->
          <div class="body-2" v-html="decoratedText"></div>
          <span class="caption">{{ new Date(tweet.created_at) }}</span>
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
                      <v-text-field
                        v-model="customGroup"
                        label="User Group"
                        clearable
                      ></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="customTheme"
                        label="Content Theme"
                        clearable
                      ></v-text-field>
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
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: 'Tweet',
  props: {
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
      tempTheme: ''
    }
  },
  computed: {
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
      // eslint-disable-next-line no-console
      console.log(this.tweet.user.name)
      if (this.tweet.selected) this.$emit('deselected', this.tweet)
      else this.$emit('selected', this.tweet)
    },
    closeDialog(save) {
      debugger
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

<style scoped></style>
