<template>
  <v-layout row text-xs-left>
    <v-flex>
      <v-card>
        <v-img
          :src="
            user.profile_background_image_url_https ||
              'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NDQ0NDQ0NDQ0NDQ0NDQ0NDQ8NDQ0NFREWFhURFRUYHSggGBolGxUVITEhMSk3Li46Fx8zODMtNygtOjcBCgoKBQUFDgUFDisZExkrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIALgBEwMBIgACEQEDEQH/xAAXAAEBAQEAAAAAAAAAAAAAAAAAAQIH/8QAFhABAQEAAAAAAAAAAAAAAAAAAAER/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AONAAAAKgCiKAAABABVBmLQoMqICgAKiglRagKIoBQoIAAAAAACggACoACgIKAAAAAokUBKoCIoAGALAgBWWkAAAhViUEAAAAAAABFQBVQBUVAUAAFAQAWAAohQAgAACAAqKgALAEWoAigJQAAARUUEVFAgALEVAFRQAIAAAKUAAEUAAAQUARQEABUAAEBUUAkBAFQBFAAIoEFiAgoAAAqKAqGAoAIACoqUAQBQAEACFWFBDBQQVAQVAFQAAABQBagAACgCKAKCAumoAAoBQBAAAAAAAAQAAABFAQMUEABQAAAFSNQBFQAAAVAAAUAAQAAAAAAAqNICAAGCggtQAAEBZASC4oIRagAAKCggEBShQQACKAIAAAAAAAAGABQARUAAAABFiKC6IAUAAAFFwBBQAwAMMNNABAKAAAABADFS0FQARUAVAAAAABFRQBQEAAVAFEUFEAVAAAAAAAAAAEUAABFQFQAAAAAAARUAUAACAAAAAqCgAAAgKACwSKCCAAAAACoAAAAAAAAAgoBAAAAAACAAqANIAIqAKIApABaiAAAAAAAAAAAAAAAP/2Q=='
          "
          height="230px"
        >
          <v-layout column>
            <v-card-title class="white--text pl-4 pt-4">
              <v-avatar>
                <img :src="user.profile_image_url_https" />
              </v-avatar>
              <v-icon v-if="user.verified" color="primary" left>
                check
              </v-icon>
              <div class="display-1 ml-3">
                {{ user.name }}
              </div>
              <div class="caption pl-3">@{{ user.screen_name }}</div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-card-title class="white--text">
              <v-chip>Tweets: {{ user.statuses_count }}</v-chip>
              <v-chip>Following: {{ user.friends_count }}</v-chip>
              <v-chip>Followers: {{ user.followers_count }}</v-chip>
              <v-chip>Avg. Sentiment: {{ avgSentiment }}</v-chip>
              <v-chip>Influence: {{ influence }}</v-chip>
            </v-card-title>
          </v-layout>
        </v-img>

        <v-card-text v-for="tweet in tweets" :key="tweet.id">
          <div class="title">
            <v-chip v-if="tweet.possibly_sensitive" text-color="red">
              Possibly Sensitive
            </v-chip>
            &quot;{{ tweet.text }}&quot;
          </div>
          <span class="caption">{{ tweet.created_at }}</span>

          <v-spacer></v-spacer>

          <v-icon small class="mr-1 mt-2">favorite</v-icon>
          <span class="caption mr-2 mt-2">{{ tweet.favorite_count }}</span>

          <v-icon small class="mr-1 mt-2">share</v-icon>
          <span class="caption">{{ tweet.retweet_count }}</span>

          <span class="ml-2 mr-1 mt-2">Sentiment:</span>
          <span class="caption mr-2 mt-2">{{ tweet.analysis.result }}</span>

          <v-divider class="mt-3"></v-divider>
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
    user: {
      type: Object,
      default: function() {
        return {
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
        }
      }
    },
    tweets: {
      type: Array,
      default: function() {
        return [
          {
            id: 'sample',
            text:
              'sample ldsfkgj sldfkhglsjdfhg ldskjfhg ;ahglwerhgipuweyrg phg phgwiehg iw45thg 09q4yhgeohgwelrugh ogowhg wiergh pwhg pihg pwhgpeqhg pqhgqphg phgeh ieqwhg oiwhg iwehg ',
            created_at: new Date('2019-06-18 00:26:53.000').toDateString(),
            retweet_count: 100,
            favorite_count: 100,
            possibly_sensitive: false,
            analysis: {
              id: 'folan',
              title: 'Folan',
              result: 0.88
            }
          },
          {
            id: 'sample2',
            text:
              'sample ldsfkgj sldfkhglsjdfhg ldskjfhg ;ahglwerhgipuweyrg phg phgwiehg iw45thg 09q4yhgeohgwelrugh ogowhg wiergh pwhg pihg pwhgpeqhg pqhgqphg phgeh ieqwhg oiwhg iwehg ',
            created_at: new Date('2019-06-18 00:26:53.000').toDateString(),
            retweet_count: 150,
            favorite_count: 110,
            possibly_sensitive: true,
            analysis: {
              id: 'folan',
              title: 'Folan',
              result: -0.83
            }
          }
        ]
      }
    }
  }
}
</script>

<style scoped></style>
