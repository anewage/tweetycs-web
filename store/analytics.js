export const strict = false
function initialState() {
  return {
    selectedMachineLearningMethod: '',
    selectedSentimentAnalysisMethod: '',
    selectedTopic: ''
  }
}
export const state = () => ({
  selectedMachineLearningMethod: '',
  selectedSentimentAnalysisMethod: '',
  selectedTopic: ''
})

export const mutations = {
  reset(state) {
    const initial = initialState()
    Object.keys(initial).forEach(key => {
      state[key] = initial[key]
    })
  },
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
