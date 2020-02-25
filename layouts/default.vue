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
      <v-spacer />
      <v-btn v-if="disconnected" icon :loading="disconnected" disabled>
        <v-icon>{{ disconnected ? 'power_off' : 'power' }}</v-icon>
      </v-btn>
      <v-btn v-if="selectedScenario" round flat disabled>
        <v-icon>play_arrow</v-icon>
        {{ selectedScenario.title }}
      </v-btn>
      <v-icon>{{ disconnected ? 'power_off' : 'power' }}</v-icon>
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
import tweets from '~/static/tweets.json'
import agkeywords from '~/static/agkeywords.json'
import agtopics from '~/static/agtopics.json'
import agusers from '~/static/agusers.json'
export default {
  name: 'LayoutDefault',
  data() {
    return {
      fluid: true,
      disconnected: socket.disconnected,
      clipped: true,
      drawer: true,
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
        },
        {
          icon: 'chrome_reader_mode',
          title: 'Shuffler',
          to: '/shuffler'
        }
      ],
      miniVariant: true,
      right: true,
      rightDrawer: false,
      title: 'VARTTA',
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
    },
    selectedScenario() {
      return this.$store.state.scenarios.find(a => a.consuming)
    }
  },
  mounted() {
    const topics = [
      {
        id: 'neoplasms',
        title: 'Cancers - Neoplasms',
        keywords: [
          'Pharyngeal Cancer',
          'Esophageal Cancer',
          'Prostate Cancer',
          'Gallbladder Cancer',
          'Trachea cancer',
          'Kidney cancer',
          'Laryngeal cancer',
          'Liver cancer',
          'Urinary Organ Cancer',
          'Lung Cancer',
          'Stomach Cancer',
          'Uterine Cancer',
          'Mouth Cancer',
          'Biliary Tract Cancer',
          'Bladder Cancer',
          'Brain Cancer',
          'Breast Cancer',
          'Nasopharyngeal Cancer',
          'Cervical Cancer',
          'Nervous System Cancer',
          'Oropharyngeal Cancer',
          'Colon Cancer',
          'Ovarian Cancer',
          'Pancreatic Cancer',
          'Non-Hodgkin Lymphoma',
          'Multiple Myeloma',
          'Leukemia'
        ]
      },
      {
        id: 'diarrhea',
        title:
          'Diarrhea, Lower Respiratory Infections, Meningitis, and Other Common Infectious Diseases',
        keywords: [
          'Diarrhea Diseases',
          'Typhoid',
          'Pneumonia',
          'Influenza',
          'Bronchitis',
          'Whooping cough',
          'Tetanus',
          'Meningitis',
          'Measles',
          'Encephalitis'
        ]
      },
      {
        id: 'hiv',
        title: 'HIV/AIDS and Tuberculosis',
        keywords: ['Tuberculosis', 'HIV/AIDS']
      },
      {
        id: 'unintentional',
        title: 'Unintentional Injuries other Than Transport Injuries',
        keywords: [
          'Heat Death',
          'Poisonings',
          'Fire Death',
          'Falls',
          'Drowning'
        ]
      },
      {
        id: 'respiratory',
        title: 'Chronic Respiratory Diseases',
        keywords: [
          'Chronic Obstructive Pulmonary Disease',
          'Asthma',
          'Pneumoconiosis',
          'Diffuse Parenchymal Lung Disease',
          'Pulmonary Sarcoidosis'
        ]
      },
      {
        id: 'diabetes',
        title: 'Diabetes, Urogenital, Blood, And Endocrine Diseases',
        keywords: [
          'Diabetes',
          'Male Infertility',
          'Kidney Disease',
          'Glomerulonephritis',
          'Urinary disease'
        ]
      },
      {
        id: 'mental',
        title: 'Mental and Behavioral Disorders',
        keywords: ['Drug Overdose', 'Alcohol Use Disorders']
      },
      {
        id: 'other_communicable',
        title:
          'Other communicable, maternal, neonatal, and nutritional disorders',
        keywords: ['Syphilis', 'STDs', 'Hepatitis']
      },
      {
        id: 'maternal',
        title: 'Maternal Disorders',
        keywords: [
          'Maternal disorders',
          'Abortion',
          'Maternal Hemorrhage',
          'Pregnancy Hypertensive'
        ]
      },
      {
        id: 'tropical',
        title: 'Neglected Tropical Diseases and Malaria',
        keywords: [
          'Tropical',
          'Ebola',
          'Dengue',
          'Chikungunya',
          'Chagas',
          'Malaria'
        ]
      },
      {
        id: 'non_communicable',
        title: 'Other non-communicable Diseases',
        keywords: ['Skin Disease', 'Skin Melanoma', 'Congenital Anomalies']
      },
      {
        id: 'neurological',
        title: 'Neurological disorders',
        keywords: [
          'Multiple Sclerosis',
          'Parkinsons Disease',
          'Migraine',
          'Epilepsy',
          'Alzheimer'
        ]
      },
      {
        id: 'musculoskeletal',
        title: 'Musculoskeletal Disorders',
        keywords: [
          'Rheumatoid Arthritis',
          'Osteoarthritis',
          'Neck Pain',
          'Low Back Pain',
          'Gout'
        ]
      },
      {
        id: 'neonatal',
        title: 'Neonatal disorders',
        keywords: [
          'Sepsis',
          'Preterm Birth Complications',
          'Neonatal Encephalopathy'
        ]
      },
      {
        id: 'cardiovascular',
        title: 'Cardiovascular and circulatory diseases',
        keywords: [
          'Myocarditis',
          'Ischemic Stroke',
          'Hemorrhagic Stroke',
          'Rheumatic Heart',
          'Peripheral Vascular Disease',
          'Peripheral Arterial Disease',
          'Ischemic Heart',
          'Hypertensive Heart Disease',
          'Endocarditis',
          'Cardiomyopathy',
          'Atrial Flutter',
          'Atrial Fibrillation',
          'Aortic Aneurysm'
        ]
      },
      {
        id: 'self_harm',
        title: 'Self-harm and interpersonal violence',
        keywords: ['Self-Harm', 'Interpersonal Violence']
      },
      {
        id: 'digestive',
        title: 'Digestive Diseases (Except Cirrhosis)',
        keywords: [
          'Intestinal Obstruction',
          'Bile Duct Disease',
          'Peptic Ulcer',
          'Paralytic Ileus',
          'Pancreatitis',
          'Gall Bladder'
        ]
      },
      {
        id: 'liver_cirrhosis',
        title: 'Cirrhosis of the liver',
        keywords: ['Liver Cirrhosis']
      },
      {
        id: 'nutritional',
        title: 'Nutritional Deficiencies',
        keywords: ['Protein-Energy Malnutrition', 'Iron-Deficiency Anemia']
      },
      {
        id: 'nature',
        title: 'Forces of nature, war, and legal intervention',
        keywords: [
          'Typhoon Death',
          'Tsunami Death',
          'Tornado Death',
          'Hurricane Death',
          'Earthquake Death'
        ]
      },
      {
        id: 'transport',
        title: 'Transport injuries',
        keywords: ['Transport Injury', 'Road Injury']
      }
    ]

    this.commitUpdates({
      topics: topics,
      aggregatedTopics: agtopics,
      aggregatedUsers: agusers.a,
      aggregatedKeywords: agkeywords,
      tweets: tweets
    })

    // eslint-disable-next-line no-console
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
      this.disconnected = socket.disconnected
      socket.emit('client_event', { data: "I'm connected!" })
      // socket.emit('initial_data_request', {})
    })

    socket.on('reconnecting', data => {
      // eslint-disable-next-line no-console
      console.log(data)
      this.disconnected = socket.disconnected
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
