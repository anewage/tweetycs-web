<template>
  <v-layout row justify-center align-space-around wrap>
    <v-flex xs12 text-xs-center>
      <v-card flat color="transparent">
        <v-card-text>
          <h1>Welcome to VARTTA</h1>
          <p>
            VARTTA: Visual Analytics for Real-Time Twitter datA. <br />
            To start, select one of the cases below.
          </p>
          <p>
            If you have questions, please refer to
            <a
              href="http://insight.uwo.ca/"
              target="_blank"
              title="Insight Lab's Webpage"
              >Insight Lab's Webpage</a
            >.
          </p>
          <p>
            Find a bug? Please report it on the Github
            <a
              href="https://github.com/anewage/tweetycs-web/issues"
              target="_blank"
              title="contribute"
              >issue board</a
            >.
          </p>
        </v-card-text>
      </v-card>
    </v-flex>
    <v-flex
      v-for="(scenario, index) in scenarios"
      :key="index"
      xs12
      md6
      class="mt-2"
    >
      <v-hover>
        <v-card
          slot-scope="{ hover }"
          class="mx-auto"
          color="grey lighten-4"
          max-width="600"
        >
          <v-img :aspect-ratio="16 / 9" :src="scenario.cloud">
            <v-expand-transition>
              <div
                v-if="disconnected"
                class="d-flex text-xs-center transition-fast-in-fast-out grey darken-2 v-card--reveal--disconnected display-3 white--text"
                style="height: 100%;"
              >
                Disconnected
              </div>
              <div
                v-else-if="
                  selectedScenario && selectedScenario.id !== scenario.id
                "
                class="d-flex text-xs-center transition-fast-in-fast-out grey darken-2 v-card--reveal--disconnected display-3 white--text"
                style="height: 100%;"
              >
                Another scenario is selected...
              </div>
              <div
                v-else-if="hover"
                :class="
                  'd-flex text-xs-center transition-fast-in-fast-out darken-2 v-card--reveal display-3 white--text ' +
                    scenario.color
                "
                style="height: 100%;"
              >
                {{ scenario.consuming ? 'Pause' : 'Start' }}
              </div>
            </v-expand-transition>
          </v-img>
          <v-card-text class="pt-4" style="position: relative;">
            <v-btn
              absolute
              :color="scenario.color"
              class="white--text"
              fab
              large
              right
              top
              :disabled="
                disconnected ||
                  (selectedScenario && selectedScenario.id !== scenario.id)
              "
              :loading="disconnected"
              @click.stop="toggleConsuming(scenario)"
            >
              <v-icon>
                {{ scenario.consuming ? 'pause' : 'power_settings_new' }}
              </v-icon>
            </v-btn>
            <div class="font-weight-light grey--text title mb-2">
              Twitter discussions on
            </div>
            <h3
              :class="
                'display-1 font-weight-light mb-2 ' + scenario.color + '--text'
              "
            >
              {{ scenario.title }}
            </h3>
            <div class="font-weight-light title mb-2">
              {{ scenario.subtitle }}
            </div>
          </v-card-text>
        </v-card>
      </v-hover>
    </v-flex>
  </v-layout>
</template>

<script>
import socket from '../lib/socket.io'
export default {
  components: {},
  data() {
    return {
      disconnected: socket.disconnected
    }
  },
  computed: {
    scenarios: {
      set(val) {
        this.$store.commit('updateScenarios', val)
      },
      get() {
        return this.$store.state.scenarios
      }
    },
    selectedScenario() {
      return this.scenarios.find(a => a.consuming)
    }
  },
  beforeMount() {
    socket.on('reconnecting', data => {
      // eslint-disable-next-line no-console
      console.log(data)
      this.disconnected = socket.disconnected
    })
    socket.on('connect', data => {
      // eslint-disable-next-line no-console
      console.log(data)
      this.disconnected = socket.disconnected
    })
  },
  methods: {
    toggleConsuming: function(scenario) {
      if (scenario.consuming) {
        this.$store.commit('updateConsumingScenario', {
          id: scenario.id,
          flag: false
        })
        socket.emit('pause_consuming')
      }
      // Was not already consuming streams or was consuming another stream
      else {
        this.$store.commit('reset')
        this.$store.commit('analytics/reset')
        this.$store.commit('compare/reset')
        this.$store.commit('shuffler/reset')
        this.$store.commit('updateConsumingScenario', {
          id: scenario.id,
          flag: true
        })
        socket.emit('pause_consuming')
        // eslint-disable-next-line no-console
        console.log(scenario.channels)
        socket.emit('update_channels', scenario.channels)
        socket.emit('initial_data_request', {})
      }
    }
  }
}
</script>

<style scoped>
.v-card--reveal--disconnected {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.8;
  position: absolute;
  width: 100%;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>
