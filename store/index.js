export const state = () => ({
  organization: null,
  snbl: {
    category: null,
    product: null,
  },
})

export const mutations = {
  set(state, data) {
    const { param, value } = data
    state[param] = value
  },
  clear(state, param) {
    state[param] = null
  },
  setCategory(state, selectedCategories) {
    state.snbl.category = selectedCategories
  },
  clearCategory(state) {
    state.snbl.category = null
  },
  setProduct(state, product) {
    state.snbl.product = product
  },
  clearProduct(state) {
    state.snbl.product = null
  },
}

export const getters = {
  organization(state) {
    return state.organization
  },
}
