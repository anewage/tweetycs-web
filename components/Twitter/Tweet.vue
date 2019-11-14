<template>
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
    return {}
  },
  computed: {
    decoratedText: function() {
      const text = this.tweet.original_text
      return (
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
          })
      )
    }
  },
  methods: {
    clicked: function() {
      // eslint-disable-next-line no-console
      console.log(this.tweet.user.name)
      if (this.tweet.selected) this.$emit('deselected', this.tweet)
      else this.$emit('selected', this.tweet)
    }
  }
}
</script>

<style scoped></style>
