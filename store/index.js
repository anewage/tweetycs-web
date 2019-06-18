export const state = () => ({
  aggregatedTopics: {
    group_topics: [],
    theme_topics: []
  },
  aggregatedUsers: [],
  selectedMachineLearningMethod: '',
  selectedSentimentAnalysisMethod: ''
})

export const mutations = {
  updateAggregatedTopics(state, data) {
    state.aggregatedTopics = data
  },
  updateAggregatedUsers(state, data) {
    state.aggregatedUsers = data
  },
  updateSelectedMachineLearningMethod(state, data) {
    state.selectedMachineLearningMethod = data
  },
  updateSelectedSentimentAnalysisMethod(state, data) {
    state.selectedSentimentAnalysisMethod = data
  }
}
