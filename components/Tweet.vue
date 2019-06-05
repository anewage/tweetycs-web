<template>
  <v-card class="mx-auto" color="#26c6da" dark max-width="500">
    <v-card-title>
      <v-img
        class="elevation-6"
        :src="tweet.user.profile_image_url_https"
      ></v-img>
      <v-icon v-if="tweet.user.verified" large left>
        mdi-check-decagram
      </v-icon>
      <v-chip>Followers: {{ tweet.user.followers_count }}</v-chip>
      <v-chip>Following: {{ tweet.user.friends_count }}</v-chip>
      <v-chip>Tweets: {{ tweet.user.statuses_count }}</v-chip>
    </v-card-title>

    <v-card-text class="headline font-weight-bold">
      {{ tweet.text }}
    </v-card-text>

    <v-card-actions>
      <v-list-tile class="grow">
        <v-list-tile-avatar color="grey darken-3">
          <v-chip v-if="tweet.possibly_sensitive">Possibly Sensitive</v-chip>
        </v-list-tile-avatar>

        <v-list-tile-content>
          <v-list-tile-title>{{ tweet.user.name }}</v-list-tile-title>
        </v-list-tile-content>

        <v-layout align-center justify-end>
          <v-icon class="mr-1">mdi-heart</v-icon>
          <span class="subheading mr-2">{{ tweet.favorite_count }}</span>
          <v-icon class="mr-1">mdi-share-variant</v-icon>
          <span class="subheading">{{ tweet.retweet_count }}</span>
        </v-layout>
      </v-list-tile>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Tweet',
  props: {
    tweet: {
      type: Object,
      default: function() {
        return {
          text: 'sample',
          retweet_count: 100,
          favorite_count: 100,
          possibly_sensitive: false,
          user: {
            name: 'John Doe',
            screen_name: 'JohnDoe',
            verified: true,
            followers_count: 100,
            friends_count: 10,
            statuses_count: 100,
            profile_image_url_https:
              'https://pbs.twimg.com/profile_images/942858479592554497/BbazLO9L_normal.jpg'
          }
        }
      }
    }
  }
}
</script>

<style scoped></style>
