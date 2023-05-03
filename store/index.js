export const state = () => ({
  organization: null,
  is_corporate_expense_enabled: false,
  new_transaction: [],
  data: {
    cashRequest: 0,
  },
  snbl: {
    category: null,
    product: null,
  },
  userConfig: {},
  accounts:[],
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
  setrequestAmount(state, amount) {
    state.data.requestedAmount = amount
  },
  clearrequestAmount(state) {
    state.data.requestedAmount = null
  },
  setUserConfig(state, payload) {
    state.userConfig = { ...payload }
  },
  setAccountsBalance(state,payload){
    if(payload){
      state.accounts=[...payload]
    }
  }
}

export const getters = {
  organization(state) {
    return state.organization
  },
  getUserConfig(state) {
    return state.userConfig
  },
  is_corporate_expense_enabled(state) {
    return state.is_corporate_expense_enabled
  },
  new_transaction(state) {
    return state.new_transaction
  },
}
