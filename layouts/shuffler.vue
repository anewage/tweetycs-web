<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-group
          v-for="(item, index) in topicItems"
          :key="index"
          prepend-icon="account_circle"
          value="true"
        >
          <template v-slot:activator>
            <v-list-tile>
              <v-list-tile-title>{{ item.name }}</v-list-tile-title>
            </v-list-tile>
          </template>
          <v-list-group
            v-for="(subitem, ind) in item.children"
            :key="index + ',' + ind"
            no-action
            sub-group
            value="true"
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-title>{{ subitem.name }}</v-list-tile-title>
              </v-list-tile>
              <v-list-tile-action>
                <v-icon>check</v-icon>
              </v-list-tile-action>
            </template>

            <v-list-tile
              v-for="(subsubitem, i) in subitem.children"
              :key="i + ',' + ind + ',' + index"
            >
              <v-list-tile-title>{{ subsubitem.name }}</v-list-tile-title>
              <v-list-tile-action>
                <v-icon>check</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list-group>
      </v-list>
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar :clipped-left="clipped" fixed app color="primary" dark>
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon>{{ `chevron_${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <!--      <v-btn icon @click.stop="clipped = !clipped">-->
      <!--        <v-icon>web</v-icon>-->
      <!--      </v-btn>-->
      <!--      <v-btn icon @click.stop="fixed = !fixed">-->
      <!--        <v-icon>remove</v-icon>-->
      <!--      </v-btn>-->
      <v-toolbar-title v-text="title" />
      <!--      <v-spacer />-->
      <!--      <v-btn icon @click.stop="rightDrawer = !rightDrawer">-->
      <!--        <v-icon>menu</v-icon>-->
      <!--      </v-btn>-->
    </v-toolbar>
    <v-content>
      <v-container :fluid="fluid">
        <nuxt />
      </v-container>
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-tile @click.native="right = !right">
          <v-list-tile-action>
            <v-icon light>compare_arrows</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Switch drawer (click me)</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-footer height="auto" color="primary" app>
      <v-layout justify-center row wrap>
        <v-btn
          v-for="link in items"
          :key="link.title"
          nuxt
          flat
          round
          :to="link.to"
          color="white"
        >
          {{ link.title }}
        </v-btn>
        <!--        <v-flex primary lighten-2 py-1 text-xs-center white&#45;&#45;text xs12>-->
        <!--          <span class="caption">-->
        <!--            <strong>-->
        <!--              <a-->
        <!--                href="http://insight.uwo.ca"-->
        <!--                target="_blank"-->
        <!--                style="color: #fff6f9; text-decoration: none;"-->
        <!--              >-->
        <!--                Insight Lab @ Western </a-->
        <!--              >— </strong-->
        <!--            >&copy; {{ new Date().getFullYear() }}</span-->
        <!--          >-->
        <!--        </v-flex>-->
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
import socket from '../lib/socket.io'
export default {
  name: 'LayoutShuffler',
  data() {
    return {
      fluid: true,
      clipped: true,
      drawer: true,
      fixed: false,
      items: [],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Tweetycs',
      // Data required for connection metrics
      pingPong: {
        start: 0,
        end: 0,
        busy: false,
        history: []
      }
    }
  },
  computed: {
    topics: {
      set(val) {
        this.$store.commit('topics', val)
      },
      get() {
        return this.$store.state.topics
      }
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
    /*
     * Current delay in ms
     */
    delay() {
      if (this.pingPong.busy)
        if (this.pingPong.history.length > 0)
          return this.pingPong.history[this.pingPong.history.length - 1]
        else return 0
      return this.pingPong.end - this.pingPong.start
    },
    /*
     * Current average delay in ms
     */
    avgDelay() {
      let avg = 0
      for (const num of this.pingPong.history) avg += num
      avg = (10 * avg) / (this.pingPong.history.length * 10)
      return avg
    }
  },
  mounted() {
    const that = this
    window.setInterval(() => {
      if (socket.connected) {
        that.pingPong.busy = true
        that.pingPong.start = new Date().getTime()
        socket.emit('client_ping')
      }
    }, 2000)
    /*
     * Event handler for new connections.
     * The callback function is invoked when a connection with the server is established.
     */
    socket.on('connect', () => {
      socket.emit('client_event', { data: "I'm connected!" })
      socket.emit('initial_data_request', {})
    })

    /*
     * Event handler for server sent data.
     * The callback function is invoked whenever the server emits data
     * to the client. The data is then displayed in the "Received"
     * section of the page.
     */
    socket.on('server_response', msg => {
      // document.getElementById('log').innerText = msg.data
    })
    /*
     * Handler for the "pong" message. When the pong is received, the
     * time from the ping is stored, and the average of the last 30
     * samples is average and displayed.
     */
    socket.on('server_pong', () => {
      that.pingPong.end = new Date().getTime()
      that.pingPong.history.push(that.pingPong.end - that.pingPong.start)
      // Keep last 30 samples
      if (that.pingPong.history.length > 30) that.pingPong.history.splice(-30)
      that.pingPong.busy = false
    })
    /*
     * Store the incoming data
     */
    socket.on('bulk-update', msg => {
      that.commitUpdates(msg)
    })
  },
  methods: {
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
    getName(name) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)}`
    },
    commitUpdates: function(msg) {
      // eslint-disable-next-line no-console
      console.log('commiting bulk update')
      // Store the changes
      this.$store.commit('updateTopics', msg.topics)
      this.$store.commit('updateAggregatedTopics', msg.aggregatedTopics)
      this.$store.commit('updateAggregatedUsers', msg.aggregatedUsers)
      this.$store.commit('updateAggregatedKeywords', msg.aggregatedKeywords)
      this.$store.commit('addToRawTweets', msg.tweets)
    }
  }
}
</script>

<style scoped></style>
