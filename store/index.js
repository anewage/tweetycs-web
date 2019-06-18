export const state = () => ({
  aggregatedTopics: {
    group_topics: [],
    theme_topics: []
  },
  aggregatedUsers: []
})

export const mutations = {
  updateAggregatedTopics(state, data) {
    state.aggregatedTopics = data
  },
  updateAggregatedUsers(state, data) {
    state.aggregatedUsers = data
  }
}
