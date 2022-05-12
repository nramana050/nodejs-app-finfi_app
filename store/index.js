export const state = () => ({
  organization: null
})

export const mutations = {
  set(state, data) {
    const { param, value } = data
    state[param] = value
  },
  clear(state, param) {
    state[param] = null
  }
}

export const getters = {
  organization (state) {
    return state.organization
  }
}