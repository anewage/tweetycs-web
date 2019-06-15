<template>
  <v-card :color="color" :flat="flat">
    <v-card-title>
      <h2>
        {{ label }}
      </h2>
    </v-card-title>
    <v-card-actions>
      <v-btn icon @click="meta.show = !meta.show">
        <v-icon>{{ meta.show ? 'help' : 'help_outline' }}</v-icon>
      </v-btn>
    </v-card-actions>
    <v-slide-y-transition>
      <v-card-text v-show="meta.show">
        {{ meta.info }}
      </v-card-text>
    </v-slide-y-transition>
    <v-card-text>
      <div :id="divId">
        <sankey-diagram
          :id="id"
          :width="width"
          :height="height"
          :dataset="sankeyData"
        />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import SankeyDiagram from './SankeyDiagram'
export default {
  name: 'SankeyDiagramWrapper',
  components: {
    'sankey-diagram': SankeyDiagram
  },
  props: {
    id: {
      type: String,
      default: 'sankey'
    },
    divId: {
      type: String,
      default: 'sankey-div'
    },
    height: {
      type: Number,
      default: 0
    },
    width: {
      type: Number,
      default: 0
    },
    color: {
      type: String,
      default: 'transparent'
    },
    flat: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      default: 'This Amazing Sankey Diagram'
    },
    dataset: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      meta: {
        show: false,
        info: 'Hello this is only a help box!'
      }
    }
  },
  computed: {
    sankeyData() {
      // Get data from bak and update the values only by each emit
      return {
        nodes: [
          { id: 'neoplasms', name: 'Neoplasms' },
          {
            id: 'diarrhea',
            name:
              'Diarrhea, Lower Respiratory Infections, Meningitis, and Other Common Infectious Diseases'
          },
          { id: 'hiv', name: 'HIV/AIDS and Tuberculosis' },
          { id: 'fundraising', name: 'Fundraising' },
          { id: 'promotional', name: 'Promotional' },
          { id: 'public', name: 'Public' },
          { id: 'interest_group', name: 'Intereset Groups' },
          { id: 'media', name: 'Media' }
        ],
        links: [
          { source: 'fundraising', target: 'hiv', value: 10.729 },
          { source: 'hiv', target: 'media', value: 30 },
          { source: 'hiv', target: 'interest_group', value: 15 },
          { source: 'promotional', target: 'neoplasms', value: 9 },
          { source: 'neoplasms', target: 'public', value: 16 },
          { source: 'promotional', target: 'diarrhea', value: 7 },
          { source: 'diarrhea', target: 'public', value: 3 },
          { source: 'diarrhea', target: 'media', value: 5 }
        ]
      }
    }
  }
}
</script>

<style scoped></style>
