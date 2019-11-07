export const strict = false
export const state = () => ({
  list: [],
  limit: 500
})

export const mutations = {
  addTweet(state, tweet) {
    if (state.list.length > state.limit) state.list.splice(-state.limit)
    state.list.push(tweet)
  },
  addBulkTweet(state, tweets) {
    if (state.list.length > state.limit) state.list.splice(-state.limit)
    state.list = state.list.concat(tweets)
  }
}
