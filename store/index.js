export const state = () => ({
  organization: null,
  data:{
    cashRequest:0
  },
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
  setrequestAmount(state,amount){
    state.data.requestedAmount=amount
  },
  clearrequestAmount(state){
    state.data.requestedAmount=null
  }

}

export const getters = {
  organization(state) {
    return state.organization
  },
}
