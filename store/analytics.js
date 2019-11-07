export const strict = false
export const state = () => ({
  selectedMachineLearningMethod: '',
  selectedSentimentAnalysisMethod: '',
  selectedTopic: ''
})

export const mutations = {
  updateSelectedMachineLearningMethod(state, data) {
    state.selectedMachineLearningMethod = data
  },
  updateSelectedSentimentAnalysisMethod(state, data) {
    state.selectedSentimentAnalysisMethod = data
  },
  updateSelectedTopic(state, data) {
    state.selectedTopic = data
  }
}
