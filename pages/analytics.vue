<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card flat color="transparent">
        <!--        <v-card-title>-->
        <!--          <h2>-->
        <!--            Control Box-->
        <!--          </h2>-->
        <!--        </v-card-title>-->
        <v-card-actions>
          <v-layout row align-center justify-space-around>
            <v-flex v-if="mlMethods.length === 0" text-xs-center>
              <v-progress-circular
                :size="50"
                color="orange"
                indeterminate
              ></v-progress-circular>
            </v-flex>
            <v-flex v-if="mlMethods.length !== 0" md7>
              <h4>Text Categorization Methods</h4>
              <v-select
                v-model="selectedMachineLearningMethod"
                class="no-overflow"
                :items="mlMethods"
                item-text="title"
                item-value="id"
                label="Text Categorization Method"
              ></v-select>
              <!--              <v-radio-group v-model="selectedMachineLearningMethod" column>-->
              <!--                <v-radio-->
              <!--                  v-for="method in mlMethods"-->
              <!--                  :key="method.id"-->
              <!--                  :label="method.title"-->
              <!--                  :value="method.id"-->
              <!--                  color="orange"-->
              <!--                ></v-radio>-->
              <!--              </v-radio-group>-->
            </v-flex>
            <v-flex v-if="analysisMethods.length === 0" text-xs-center>
              <v-progress-circular
                :size="50"
                color="cyan"
                indeterminate
              ></v-progress-circular>
            </v-flex>
            <v-flex v-if="analysisMethods.length !== 0" md5>
              <h4>Sentiment Analysis Methods</h4>
              <v-select
                v-model="selectedSentimentAnalysisMethod"
                class="no-overflow"
                :items="analysisMethods"
                item-text="title"
                item-value="id"
                label="Sentiment Analysis Methods"
              ></v-select>
              <!--              <v-radio-group v-model="selectedSentimentAnalysisMethod" column>-->
              <!--                <v-radio-->
              <!--                  v-for="method in analysisMethods"-->
              <!--                  :key="method.id"-->
              <!--                  :label="method.title"-->
              <!--                  :value="method.id"-->
              <!--                  color="cyan"-->
              <!--                ></v-radio>-->
              <!--              </v-radio-group>-->
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-flex>
    <v-flex text-xs-center xs12 md7>
      <sankey-diagram-wrapper
        :id="charts.sankey.id"
        :div-id="charts.sankey.divId"
        :label="charts.sankey.label"
        :width="charts.sankey.width"
        :height="charts.sankey.height"
        :color="color"
        :flat="flat"
        :selected-ml-method="selectedMachineLearningMethod"
        :topics="topics"
        :dataset="aggregatedTopics"
        @itemClick="updateSelectedTopic"
        @itemMouseover="applyHighlight"
        @itemMouseout="removeHighlight"
      ></sankey-diagram-wrapper>
    </v-flex>
    <v-flex text-xs-center xs12 md5>
      <heat-map-wrapper
        :id="charts.heatmap.id"
        :div-id="charts.heatmap.divId"
        :selected-analysis-method="selectedSentimentAnalysisMethod"
        :selected-machine-learning-method="selectedMachineLearningMethod"
        :label="charts.heatmap.label"
        :width="charts.heatmap.width"
        :height="charts.heatmap.height"
        :color="color"
        :flat="flat"
        :selected-topic="highlightedTopic"
        :dataset="aggregatedKeywords"
      ></heat-map-wrapper>
    </v-flex>
    <v-flex text-xs-center xs12 md8>
      <scatter-plot-wrapper
        :id="charts.scatterplot.id"
        :div-id="charts.scatterplot.divId"
        :label="charts.scatterplot.label"
        :width="charts.scatterplot.width"
        :height="charts.scatterplot.height"
        :selected-analysis-method="selectedSentimentAnalysisMethod"
        :color="color"
        :flat="flat"
        :dataset="aggregatedUsers"
        @circleClicked="updateTweets"
      ></scatter-plot-wrapper>
    </v-flex>
    <v-flex text-xs-center xs12 md4>
      <!--   TODO: make it transparent   -->
      <user-profile :username="selectedUser.screen_name"></user-profile>
    </v-flex>
  </v-layout>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import ScatterPlotWrapper from '../components/Scatterplot/ScatterPlotWrapper'
import HeatMapWrapper from '../components/Heatmap/HeatMapWrapper'
import SankeyDiagramWrapper from '../components/Sankey/SankeyDiagramWrapper'
import UserProfile from '../components/Twitter/UserProfile'
export default {
  name: 'PageAnalytics',
  components: {
    UserProfile,
    'sankey-diagram-wrapper': SankeyDiagramWrapper,
    'scatter-plot-wrapper': ScatterPlotWrapper,
    'heat-map-wrapper': HeatMapWrapper
  },
  data() {
    return {
      flat: true,
      color: 'transparent',
      highlightedTopic: '',
      msg: '',
      temp: [],
      selectedUser: { screen_name: '' },
      // Charts and all of their configurations
      charts: {
        scatterplot: {
          id: 'scatter-plot',
          divId: 'scatter-plot-div',
          label: 'User Influence Vs. Average Sentiment',
          width: 600,
          height: 600
        },
        sankey: {
          id: 'sankey-diagram',
          divId: 'sankey-diagram-div',
          label: 'User Groups, Topics, and Content Themes',
          width: 600,
          height: 600
        },
        heatmap: {
          id: 'heatmap',
          divId: 'heatmap-div',
          label: 'Hybrid Analysis',
          width: 600,
          height: 600
        }
      }
    }
  },
  computed: {
    aggregatedTopics() {
      return this.$store.state.aggregatedTopics
    },
    aggregatedUsers() {
      return this.$store.state.aggregatedUsers
    },
    aggregatedKeywords() {
      return this.$store.state.aggregatedKeywords
    },
    topics() {
      return this.$store.state.topics
    },
    selectedTopic: {
      set(val) {
        this.$store.commit('analytics/updateSelectedTopic', val)
      },
      get() {
        return this.$store.state.analytics.selectedTopic
      }
    },
    selectedSentimentAnalysisMethod: {
      set(val) {
        this.$store.commit(
          'analytics/updateSelectedSentimentAnalysisMethod',
          val
        )
      },
      get() {
        return this.$store.state.analytics.selectedSentimentAnalysisMethod
      }
    },
    selectedMachineLearningMethod: {
      set(val) {
        this.$store.commit('analytics/updateSelectedMachineLearningMethod', val)
      },
      get() {
        return this.$store.state.analytics.selectedMachineLearningMethod
      }
    },
    analysisMethods() {
      return this.aggregatedUsers.map(cat => {
        return {
          id: cat._id,
          title: cat.items[0].analysis.title
        }
      })
    },
    mlMethods() {
      return this.aggregatedTopics.group_topics.map(cat => {
        return {
          id: cat._id,
          title: cat.items[0].labels.title
        }
      })
    }
  },
  mounted() {
    this.resize()
    window.addEventListener('resize', this.resize)
    // this.$nextTick(() => {
    //   debugger
    //
    // })
  },
  methods: {
    resize: function() {
      const scatterDiv = document.getElementById(this.charts.scatterplot.divId)
      const heatDiv = document.getElementById(this.charts.heatmap.divId)
      const sankeyDiv = document.getElementById(this.charts.sankey.divId)
      if (scatterDiv) this.charts.scatterplot.width = scatterDiv.clientWidth - 5
      if (heatDiv) this.charts.heatmap.width = heatDiv.clientWidth - 5
      if (sankeyDiv) this.charts.sankey.width = sankeyDiv.clientWidth - 5
    },
    // commitUpdates: function(msg) {
    //   // Store the changes
    //   this.$store.commit('updateAggregatedTopics', msg.aggregatedTopics)
    //   this.$store.commit('updateAggregatedUsers', msg.aggregatedUsers)
    //   this.$store.commit('updateAggregatedKeywords', msg.aggregatedKeywords)
    //   this.$store.commit('updateTopics', msg.topics)
    // },
    updateTweets: function(data) {
      this.selectedUser = data.user
    },
    // Just to be consistent with the page compare
    highlightTopic: function(item) {
      this.highlightedTopic = item.id
    },
    updateSelectedTopic: function(item) {
      if (this.topics.map(a => a.id).includes(item.id)) {
        this.selectedTopic = item.id
        this.highlightTopic(item)
      }
    },
    applyHighlight: function(item) {
      this.highlightTopic(item)
    },
    removeHighlight: function(item) {
      this.highlightTopic({ id: this.selectedTopic })
    }
  }
}
</script>

<style scoped>
.no-overflow {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
