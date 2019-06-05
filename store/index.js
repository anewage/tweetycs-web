export const state = () => ({
  analysisMethods: []
})

export const mutations = {
  addAnalysisMethod(state, methods) {
    const ids = state.analysisMethods.map(x => x.id)
    for (const m of methods)
      if (!ids.includes(m.id)) state.analysisMethods.push(m)
  }
}
