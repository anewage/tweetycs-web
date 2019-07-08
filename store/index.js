export const state = () => ({
  aggregatedTopics: {
    group_topics: [],
    theme_topics: []
  },
  aggregatedKeywords: {
    themes: [],
    groups: []
  },
  aggregatedUsers: [],
  topics: {},
  selectedMachineLearningMethod: '',
  selectedSentimentAnalysisMethod: '',
  selectedTopic: ''
})

export const mutations = {
  updateAggregatedTopics(state, data) {
    state.aggregatedTopics = data
  },
  updateAggregatedUsers(state, data) {
    state.aggregatedUsers = data
  },
  updateAggregatedKeywords(state, data) {
    state.aggregatedKeywords = data
  },
  updateSelectedMachineLearningMethod(state, data) {
    state.selectedMachineLearningMethod = data
  },
  updateSelectedSentimentAnalysisMethod(state, data) {
    state.selectedSentimentAnalysisMethod = data
  },
  updateSelectedTopic(state, data) {
    state.selectedTopic = data
  },
  updateTopics(state, data) {
    state.topics = data
  }
}
