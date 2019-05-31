export const state = () => ({
  fetched: []
})

export const mutations = {
  add(state, datapoint) {
    const limit = 100
    if (state.fetched.length > limit) state.fetched.splice(1, 10)
    state.fetched.push(datapoint)
  }
}
