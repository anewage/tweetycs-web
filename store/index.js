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
  topics: [],
  rawTweets: []
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
    // If the topic already exists
    if (state.topics.includes(a => a.id === data.channel))
      state.topics.find(a => a.id === data.channel).keywords = data.keywords
    // otherwise
    else
      state.topics.push({
        id: data.channel.toLowerCase(),
        title: data.channel,
        keywords: data.keywords
      })
  },
  updateRawTweets(state, data) {
    state.rawTweets = data
  },
  addToRawTweets(state, data) {
    // Make sure tweets are unique
    const unique = data.tweets
      .map(e => e.id)
      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the dead keys & store unique objects
      .filter(e => data.tweets[e])
      .map(e => data.tweets[e])
    state.rawTweets = [...state.rawTweets, ...unique]
  }
}
