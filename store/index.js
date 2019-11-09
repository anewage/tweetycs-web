export const strict = false
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
  topics: []
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
  updateTopics(state, data) {
    // Sort keywords
    for (const channel of data) {
      channel.keywords = channel.keywords.sort()
    }
    // Sort channels
    data = data.sort((a, b) => {
      return a.id > b.id ? 1 : -1
    })
    state.topics = data
  },
  updateSelectedTopic(state, data) {
    state.topics[data.channel] = data.keywords
  }
}
