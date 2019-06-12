<template>
  <v-card :color="color" :flat="flat">
    <v-card-title>
      <h2>
        {{ label }}
      </h2>
    </v-card-title>
    <v-card-text>
      <div :id="divId">
        <heat-map :id="id" :width="width" :height="height" :dataset="dataset" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import HeatMap from './HeatMap'
export default {
  name: 'HeatMapWrapper',
  components: {
    'heat-map': HeatMap
  },
  props: {
    id: {
      type: String,
      default: 'heatmap'
    },
    divId: {
      type: String,
      default: 'heatmap-div'
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
      default: 'This Amazing Scatter Plot'
    },
    dataset: {
      type: Array,
      default: function() {
        return []
      }
    },
    selectedAnalysisMethod: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped></style>
