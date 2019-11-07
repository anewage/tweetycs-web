export const state = () => ({
  comparisonSlider: 1,
  comparisons: [{ analysis: '', machineLearning: '', topic: 'hiv' }]
})

export const mutations = {
  setComparisonSlider(state, value) {
    state.comparisonSlider = value
  },
  setComparisons(state, val) {
    state.comparisons = val
  },
  updateComparisons(state, count) {
    count = [1, 2, 3, 4, 6, 12][count - 1]
    if (state.comparisons.length < count) {
      for (let i = state.comparisons.length; i < count; i++)
        state.comparisons.push({
          analysis: '',
          machineLearning: '',
          topic: 'hiv'
        })
    } else if (state.comparisons.length > count) {
      state.comparisons.splice(count)
    }
  }
}
