<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
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
        <v-flex primary lighten-2 py-1 text-xs-center white--text xs12>
          <span class="caption">
            <strong>
              <a
                href="http://insight.uwo.ca"
                style="color: #fff6f9; text-decoration: none;"
              >
                Insight Lab @ Western </a
              >— </strong
            >&copy; {{ new Date().getFullYear() }}</span
          >
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      fluid: true,
      clipped: true,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'bubble_chart',
          title: 'Analytics',
          to: '/analytics'
        },
        {
          icon: 'dashboard',
          title: 'Compare',
          to: '/compare'
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Tweetycs'
    }
  }
}
</script>
