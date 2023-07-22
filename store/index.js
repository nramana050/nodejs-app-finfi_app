export const state = () => ({
  organization: null,
  is_corporate_expense_enabled: false,
  new_transaction: [],
  nbfc_status: null,
  web_journey_url: null,
  data: {
    cashRequest: 0,
  },
  snbl: {
    category: null,
    product: null,
  },
  userConfig: {},
  orgConfig: {},
  accounts: [],
  userDetails: {},
  shop: {
    products: [],
    cart: null,
    selectedCategory: null,
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
  setShop(state, data) {
    state.shop.products = data
  },
  setSelectedCategory(state, data) {
    state.shop.selectedCategory = data
  },
  setCart(state, product) {
    state.shop.cart = product
  },
  clearCart(state) {
    state.shop.cart = null
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

  requestDocumentForBankTransfer(state, attachments) {
    state.data.attachments = attachments
  },

  clearRequestDocumentForBankTransfer(state) {
    state.data.attachments = []
  },

  setUserConfig(state, payload) {
    state.userConfig = { ...payload }
  },
  setOrgConfig(state, payload) {
    state.orgConfig = { ...payload }
  },

  setAccountsBalance(state, payload) {
    if (payload) {
      state.accounts = [...payload]
    }
  },
  setUserDetails(state, payload) {
    state.userDetails = payload
  },
  setNbfcStatus(state, payload) {
    state.nbfc_status = payload
  },
  setWebJourneyUrl(state, payload) {
    state.web_journey_url = payload
  },
}

export const getters = {
  organization(state) {
    return state.organization
  },
  getUserConfig(state) {
    return state.userConfig
  },
  getOrgConfig(state) {
    return state.orgConfig
  },
  is_corporate_expense_enabled(state) {
    return state.is_corporate_expense_enabled
  },
  new_transaction(state) {
    return state.new_transaction
  },
  getUserDetails(state) {
    return state.userDetails
  },
  getShopProducts(state) {
    return state.shop.products
  },
  getSelectedCategory(state) {
    return state.shop.selectedCategory
  },
  getShopCart(state) {
    return state.shop.cart
  },
  getAccounts(state) {
    return state.accounts
  },
}
