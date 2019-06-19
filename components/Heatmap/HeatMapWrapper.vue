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
      <v-spacer></v-spacer>

      <span class="caption theme--light">Low Values:</span>
      <input v-model="colorRange[0]" type="color" />

      <v-spacer></v-spacer>

      <span class="caption theme--light">High Values:</span>
      <input v-model="colorRange[1]" type="color" />
      <v-spacer></v-spacer>
    </v-card-actions>
    <v-slide-y-transition>
      <v-card-text v-show="meta.show">
        {{ meta.info }}
      </v-card-text>
    </v-slide-y-transition>
    <v-card-text>
      <div :id="divId">
        <heat-map
          :chart-dom-i-d="id"
          :width="width"
          :height="height"
          :color-range="colorRange"
          :dataset="heatmapData"
        />
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
      type: Object,
      default: function() {
        return {
          themes: [],
          groups: []
        }
      }
    },
    selectedAnalysisMethod: {
      type: String,
      default: ''
    },
    selectedMachineLearningMethod: {
      type: String,
      default: ''
    },
    selectedTopic: {
      type: String,
      default: 'hiv'
    }
  },
  data() {
    return {
      colorRange: ['#ffffff', '#69b3a2'],
      meta: {
        show: false,
        info: 'Hello this is only a help box!'
      }
    }
  },
  computed: {
    heatmapData() {
      if (
        this.selectedMachineLearningMethod === '' ||
        this.selectedSentimentAnalysisMethod === ''
      )
        return []
      const that = this
      const final = []
      const filteredThemes = this.dataset.themes.filter(it => {
        return (
          it._id.analysis === that.selectedAnalysisMethod &&
          it._id.labeling === that.selectedMachineLearningMethod &&
          it._id.topic === that.selectedTopic
        )
      })
      for (const it of filteredThemes) {
        for (const kw of it._id.keywords) {
          final.push({
            x: kw,
            y: 'Content Theme: ' + it._id.theme,
            v: it.avgSentiment,
            sort: 1
          })
        }
      }
      const filteredGroups = this.dataset.groups.filter(it => {
        return (
          it._id.analysis === that.selectedAnalysisMethod &&
          it._id.labeling === that.selectedMachineLearningMethod &&
          it._id.topic === that.selectedTopic
        )
      })
      for (const it of filteredGroups) {
        for (const kw of it._id.keywords) {
          final.push({
            x: kw,
            y: 'Contributor Category: ' + it._id.group,
            v: it.avgSentiment,
            sort: 0
          })
        }
      }
      return final
    }
  }
}
</script>

<style scoped></style>
