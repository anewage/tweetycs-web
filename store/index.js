export const state = () => ({
  tweets: []
})

export const mutations = {
  addTweet(state, tweet) {
    const limit = 100
    if (state.tweets.length > limit) state.tweets = state.tweets.slice(-limit)
    state.fetched.push(tweet)
  }
}
