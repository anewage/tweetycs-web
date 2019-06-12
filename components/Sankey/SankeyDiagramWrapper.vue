<template>
  <v-card :color="color" :flat="flat">
    <v-card-title>
      <h2>
        {{ label }}
      </h2>
    </v-card-title>
    <v-card-actions>
      <v-btn icon @click="meta.show = !meta.show">
        <v-icon>{{
          meta.show ? 'keyboard_arrow_down' : 'keyboard_arrow_up'
        }}</v-icon>
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
          :dataset="dataset"
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
        return {
          nodes: [],
          links: []
        }
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
  }
}
</script>

<style scoped></style>
