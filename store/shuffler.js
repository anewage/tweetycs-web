export const strict = false
export const state = () => ({
  topicsTreeSelections: [],
  minimizeTopics: false
})

export const mutations = {
  updateTopicsTreeSelections(state, val) {
    state.topicsTreeSelections = val
  },
  updateMinimizeTopics(state, val) {
    state.minimizeTopics = val
  }
}
