<template lang="pug">
div.home-comtainer.ps-1A
  div.ps-1
    div.flex.flex-row.justify-between
      span.text-xl Hi {{userName}},
      span.ps-4
        button(@click="navToProfile")
          img.object-cover.h-8.w-8.rounded-full(src="~/assets/myfinfi-icons/profile.png")
  div(v-if="accounts.length > 0 && organization")
    AccountCard.ps-2(:accounts="accounts" :provider="organization")
  div.marketing
   div.card
    div.icon
     img(src="~/assets/myfinfi-icons/more_money.png")
    div.content
      h2 Need more money
      p Get an instant loan
    div.action
     img(src="~/assets/myfinfi-icons/right_arrow.png")
  div.account-card
   div.header
    span.info 
     img(src='~/assets/myfinfi-icons/wallet.png') 
     span Prepaid Rupay card  
    span.actions
      img(src='~/assets/myfinfi-icons/unlock.png')
      img(src='~/assets/myfinfi-icons/settings.png' @click="navToCard")
   div.content
    div.stats
     span.head Total Limit 
     span.amt ₹ {{ cardData?.earned || 0 }}
    div.stats
     span.head Prepaid Balance (Used)
     span.amt ₹ {{ cardData?.used || 0 }} 
    div.stats
     span.head Available Salary
     span.amt ₹ {{ cardData?.account_balance || 0 }}
   div.card.actions
    button(@click="navToLoadYourCard") Add Money  
    button(@click="navToCard") Card Details  
  div.container.corp-exp.products.p-5(v-if="homeProducts?.length")
    h3.font-bold
     span Get upto 15% discount on major brands   
     span.action(@click="navToShop") See All
    div.latest-claim(v-if="homeProducts?.length")
        ssr-carousel(:slides-per-page=3 :loop='true' :show-arrows='true' :feather='true' :autoplay-delay='5')
          div.slide.custom-pro-slide(v-for="product in homeProducts" @click="selectProduct(product)") 
            div.slide-header
             img(:src="baseUrl+product.home_screen_image_path" crossorigin="anonymous")
            div.slide-content
              div.product-name {{product?.product_name}}
              div.product-discount Get {{ product?.merchant_discount + product?.finfi_discount }}% discount
            div.slide-product-availability
             span.mode(v-if="product?.acceptance_mode === 'ONLINE' || product?.acceptance_mode==='BOTH'")
              img(src="~/assets/myfinfi-icons/online.png")
              span  ONLINE
             span.mode(v-if="product?.acceptance_mode === 'INSTORE' || product?.acceptance_mode==='BOTH'")
              img(src="~/assets/myfinfi-icons/instore.png")
              span  INSTORE
  div.container.corp-exp.p-5(v-if="corpExEnabled")
    h3.font-bold.text-sm Corporate Expense    
  div.claim-exp.p-5(v-if="corpExEnabled")
    div.display-corp-limit.text-sm 
      div
        span Allocated 
        span &#8377; {{ allocatedCorpBalance }}
      div  
        span Available 
        span &#8377; {{availableCorpBalance}}
      div  
        span Consumed 
        span &#8377; {{ consumedCorpBalance }}
    h3.font-bold.text-sm Latest Claim
    ClaimItem(v-for="claim in claims" :claimData="claim" :disableActions="true")
    button.claim-btn(@click="navToClaimSettelment") Claim Your Expense 
    button.claim-btn(@click="navToClaimHistory") Claim History 
  div.claim-exp.p-5    
   button.claim-btn(v-if="deferredPrompt" ref="addBtn" class="add-button" @click="clickCallback") Add To HomeScreen  
</template>

<script>
export default {
  name: 'DashboardPage',
  layout: 'session',

  data() {
    return {
      deferredPrompt: null,
      claims: [],
      user: this.$auth.user,
      accounts: [],
      requestedAmount: null,
      recentTransaction: null,
      inProgress: false,
      kycStatus: null,
      vciplink: null,
      availableLimit: null,
      corpExEnabled: false,
      isCardNumber: false,
      financialPartnerType: null,
      isCardLock: false,
      enableFinfi: false,
      enableM2P: false,
      categories: [],
      category_name: [],
      lock: true,
      filteredProducts: [],
      toFilter: [1, 3, 7, 14],
      card_type: null,
      homeProducts: [],
      selectedProduct: [],
      selected: false,
      baseUrl: this.$axios.defaults.baseURL,
    }
  },

  computed: {
    organization() {
      return this.$auth.user.organization
    },
    availableCorpBalance() {
      return this.$store.getters.getUserConfig?.corpx_limit?.available || 0
    },
    allocatedCorpBalance() {
      return this.$store.getters.getUserConfig?.corpx_limit?.allocated || 0
    },
    consumedCorpBalance() {
      return this.$store.getters.getUserConfig?.corpx_limit?.consumed || 0
    },
    isCardEnabled() {
      let isEnable = false
      this.$store.getters.getUserConfig?.account?.forEach((accData) => {
        if (accData?.account_type === 'CARD') {
          isEnable = true
        }
      })

      return isEnable
    },
    cardData() {
      const cardAccount = this.accounts.filter(
        (item) => item.account_type.toUpperCase() === 'CARD'
      )
      return cardAccount.length > 0 ? cardAccount[0] : {}
    },
    userName() {
      return `${this.$store.getters.getUserDetails?.first_name} ${this.$store.getters.getUserDetails?.last_name}`
    },
  },
  mounted() {
    if (this.$auth.strategy.token.status().valid()) {
      this.getHomeProducts()
    }
    this.fetchClaims()
    this.fetchUserConfig()
    this.captureEvent()
    this.fetchAccountDetails()
  },
  async beforeMount() {
    if (this.$auth.strategy.token.status().valid()) {
      const apiResult = await this.$axios.get('/organizations/config', {
        headers: {
          Authorization: this.token,
        },
      })
      this.isCardEnabled = apiResult.data.is_card_enabled
      this.corpExEnabled = apiResult.data?.user.is_corporate_expense_enabled
      this.financialPartnerType = apiResult.data?.financial_partner_type
    }
    this.fetchUserDetails()
  },
  methods: {
    async fetchAccountDetails() {
      await this.getAccountDetails()
    },
    captureEvent() {
      window.addEventListener('beforeinstallprompt', (e) => {
        // ! Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault()
        // Stash the event so it can be triggered later.
        this.deferredPrompt = e
      })
    },
    clickCallback() {
      // Show the prompt
      this.deferredPrompt.prompt()
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          // Call another function?
        }
        this.deferredPrompt = null
      })
    },
    async fetchUserConfig() {
      const res = await this.$axios.$get('/api/coprx/userconfig', {
        headers: {
          Authorization: this.token,
        },
      })
      if (res?.status) {
        this.$store.commit('setUserConfig', {
          account: res?.account,
          corpx_limit: res?.corpx_limit,
        })
      }
    },
    navToClaimHistory() {
      this.$router.push('/claim?activeTab=claim_history')
    },
    navToClaimSettelment() {
      this.$router.push('/claim')
    },
    navToTransferScreen() {
      this.$router.push('/transferscreen')
    },
    navToCard() {
      this.$router.push('/cards')
    },
    navToShop() {
      this.$router.push('/shopnow')
    },
    navToTransaction() {
      this.$router.push('/transactions')
    },
    navToProfile() {
      this.$router.push('/profile')
    },
    navToSaveNow() {
      this.$router.push('/shopnow')
    },
    navToFAQ() {
      this.$router.push('/askedquestions')
    },
    navToLoadYourCard() {
      this.$router.push('/loadyourcard')
    },
    async fetchClaims() {
      const res = await this.$axios.$get(
        '/api/coprx/claims?sort=desc&limit=1',
        {
          headers: {
            Authorization: this.token,
          },
        }
      )
      // console.log('CLAIMS', res)
      if (res?.status) {
        this.claims = res?.claims
      }
    },
    async navToPhysicalCard() {
      const isVartualCard = await this.$axios.get('m2p/requestPhysicalCard', {
        headers: {
          Authorization: this.token,
        },
      })

      if (isVartualCard.data.message === 'True') {
        this.$router.push('/welcomePage4')
      } else if (isVartualCard.data.message === 'Fail') {
        this.$toast.error(isVartualCard.data.result)
      } else if (isVartualCard.data.message === 'Paid') {
        this.$router.push('/RequestPhysical')
        this.$toast.success('Already Paid For Physical Card.')
      } else {
        this.$toast.error(isVartualCard.data.result)
      }
    },
    async getCategories() {
      const categories = await this.$axios.$get(`/snbl/category`)
      this.categories = categories.data.map((item) => item.category_name)
    },
    async getProducts() {
      const payload = { category: this.categories }
      const res = await this.$axios.$post(`/snbl/products`, payload)
      const productList = res.data
      this.filteredProducts = productList.filter((x) =>
        this.toFilter.includes(x.id)
      )
    },
    async getHomeProducts() {
      const res = await this.$axios.$get(`/snbl/home-products`)
      if (res.message === 'Success') {
        this.homeProducts = res.data
      }
    },
    selectProduct(Product) {
      const productObj = {
        organization_id: Product.organization_id,
        product: Product,
      }
      this.selectedProduct = []
      this.selectedProduct.push(productObj)
      this.selected = true
      this.$store.commit('setProduct', productObj)
      this.$router.push('/startplan')
    },
    cardNumber() {
      if (this.isCardNumber === true) {
        this.isCardNumber = false
      } else {
        this.isCardNumber = true
      }
    },
    lockOpen() {
      if (this.lock === true) {
        this.lock = false
      } else {
        this.lock = true
      }
    },
    async getAccountDetails() {
      try {
        const UserProfile = await this.$axios.get('/profile')
        const orgAccountTypes = UserProfile.data.account_types.split(',')
        if (UserProfile.data.card_type) {
          this.card_type = UserProfile.data.card_type
        }
        const accountresult = await this.$axios.get('/accounts')
        const providerFinfi = await this.$axios.post('/ext/service-provider', {
          service_provider: 'FINFI',
        })
        const providerM2P = await this.$axios.post('/ext/service-provider', {
          service_provider: 'M2P',
        })

        for (const item of accountresult.data) {
          if (orgAccountTypes.includes(item.account.account_type)) {
            this.accounts.push(item.account)
            this.$store.commit('setAccountsBalance', this.accounts)
            if (item.account.account_type !== 'PAYABLE') {
              this.availableLimit += item.account.account_balance
            }
          }
        }
        this.availableLimit = this.availableLimit.toLocaleString('en-IN')

        const finfiAccount = this.accounts.filter(
          (item) =>
            item.account_type.toUpperCase() ===
            providerFinfi.data.filter((x) => orgAccountTypes.includes(x))[0]
        )
        const m2pAccount = this.accounts.filter(
          (item) =>
            item.account_type.toUpperCase() ===
            providerM2P.data.filter((x) => orgAccountTypes.includes(x))[0]
        )

        this.enableFinfi = finfiAccount.length > 0 ? true : null
        this.enableM2P = m2pAccount.length > 0 ? true : null
        if (finfiAccount.length > 0)
          await this.fetchRecentWithdrawal(finfiAccount[0].id)
      } catch (err) {
        this.$toast.error('Failed to fetch accounts')
      }
    },
    async fetchRecentWithdrawal(accountId) {
      try {
        const result = await this.$axios.get(
          `/accounts/${accountId}/withdrawals?limit=1`
        )
        if (result.data.length > 0) {
          this.recentTransaction = result.data[0]
        }
      } catch (err) {
        this.$toasted.error(err.response.data.message)
      }
    },
    async fetchUserDetails() {
      const profileResult = await this.$axios.get('/profile')
      console.log('PROFILE::DATA::>>', profileResult.data)
      this.$store.commit('setUserDetails', profileResult.data)
    },
  },
}
</script>

<style scoped>
.corp-exp.products {
  background: #e5e2ff;
  margin-top: 10px;
  font-weight: 700;
  font-size: 14px;
  line-height: 18px;
  color: #000000;
  padding-bottom: 1.25rem;
}
.corp-exp.products > h3 {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.corp-exp.products > h3 > span.action {
  color: #4c83b3;
  cursor: pointer;
}
.claim-exp {
  background-color: #ffffff;
  margin: 10px 15px;
  border-radius: 10px;
}
.display-corp-limit {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 20px;
}
.display-corp-limit > div > span {
  display: block;
}

.account-card {
  background: #fff;
  border-radius: 10px;
  margin: 10px 15px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
}
.account-card .header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e9e9fc;
  margin: 10px;
  padding: 15px 0;
}
.account-card .header .info img,
.account-card .header .actions img {
  margin-right: 10px;
}
.account-card .header .actions img {
  cursor: pointer;
}
.account-card .header .info {
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
  color: #1c1939;
}

.account-card .header .info,
.account-card .header .actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.account-card .content {
  display: flex;
  justify-content: space-around;
  margin: 10px;
}
.account-card .content .stats {
  text-align: center;
  border-right: 1px solid #e9e9fc;
  padding-right: 20px;
  margin-top: 10px;
}
.account-card .content .stats:nth-child(3) {
  border-right: 0;
  padding-right: 0;
}
.account-card .content .stats:nth-child(3) .head {
  width: 85px;
}
.account-card .content .stats .head {
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  color: #898a8d;
  display: block;
  margin: 0 auto;
  width: 50px;
  margin-bottom: 10px;
}
.account-card .content .stats .amt {
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
  color: #1c1939;
}

.account-card .card.actions {
  margin: 10px;
  padding: 20px 10px;
  display: flex;
  justify-content: space-around;
}
.account-card .card.actions button {
  width: 102px;
  height: 28px;
  background: #ffffff;
  border: 1px solid #d8d8d8;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
  text-align: center;
  color: #674297;
}

.marketing {
  margin: 10px 15px;
}
.marketing .card {
  background: #ffffff;
  border-radius: 10px;
  display: flex;
  justify-content: space-around;
  min-height: 65px;
  align-items: center;
  padding: 10px 15px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.marketing .card .icon {
  margin-right: 10px;
}
.marketing .card .content {
  width: 75%;
}
.marketing .card .content h2 {
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: #1c1939;
}

.marketing .card .content p {
  font-weight: 300;
  font-size: 14px;
  line-height: 21px;
  color: #898a8d;
}
.add-short-cut {
  margin: 15px;
}
.card-button {
  width: 100%;
}
.card-button > img {
  height: 180px;
}
.latest-claim {
  border-radius: 10px;
}
.latest-claim > h3 {
  margin-bottom: 10px;
}
.home-comtainer {
  padding-bottom: 50px;
}
.claim-btn {
  border: 1px solid #7165e3;
  color: #7165e3;
  padding: 5px;
  width: 100%;
  border-radius: 10px;
  margin: 10px 0;
}
.custom-pro-slide {
  text-align: center;
  background-color: #fff;
  min-width: 180px;
  border-radius: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  position: relative;
}
.custom-pro-slide > .slide-header {
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #7165e3;
  margin: 0 10px;
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.custom-pro-slide > .slide-header > img {
  height: 70px;
  width: 75px;
}
.custom-pro-slide .slide-content {
  padding: 0px 5px;
  min-height: 80px;
}
.slide-product-availability {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  padding-bottom: 0;
  position: absolute;
  top: 150px;
}
.slide-product-availability .mode {
  display: flex;
  font-size: 12px;
  line-height: 16px;
  color: #898a8d;
}
.slide-product-availability .mode img {
  margin-right: 5px;
  height: 15px;
  width: 15px;
}
.custom-pro-slide .slide-content .product-name {
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  text-align: center;
  color: #000000;
}
.custom-pro-slide .slide-content .product-discount {
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #898a8d;
}
.ps-1 {
  height: 100px;
  background-color: #7165e3;
  padding-left: 2rem;
  padding-top: 1rem;
  color: #ffffff;
}

.ps-1A {
  background-color: #f2f2f2;
  min-height: 100vh;
}

.ps-2 {
  margin-top: -2.5rem;
  border-radius: 10px;
  height: 12rem;
  background-color: #ffffff;
  color: #1c1939;
  margin-left: 1rem;
  margin-right: 1rem;
  box-shadow: 0px 35px 65px rgba(0, 0, 0, 0.0790811);
}

.ps-3 {
  margin-top: 1rem;
  margin-left: 2rem;
}

.ps-4 {
  margin-right: 2rem;
}

.ps-4A {
  margin-left: 5rem;
  height: 30px;
}

.ps-4A1 {
  margin-left: 5.5rem;
}

.ps-5 {
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: 2rem;
  margin-right: 2rem;
}

.corp-exp {
  padding: 10px 15px 0px 15px;
}

.ps-6 {
  width: 75%;
  height: 9rem;
  background-color: #ffffff;
  margin-left: 3rem;
  margin-right: 3rem;
  margin-bottom: 1rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.col-1 {
  width: 50%;
  background-color: white;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.col-2 {
  width: 50%;
  color: black;
  background-color: white;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}

.ps-6A {
  height: 9rem;
  width: 100%;
}

.ps-7 {
  width: 75%;
  height: 2rem;
  background-color: #ffffff;
  margin-left: 3rem;
  margin-right: 3rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}

.ps-7A {
  padding: 5px;
}

.ps-7B {
  padding: 7px;
  margin-right: 1rem;
}

.ps-8 {
  margin-left: 2rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.ps-9 {
  height: 9rem;
  width: 85%;
  background-color: #ffffff;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-bottom: 4.6rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
}

.ps-9A {
  height: 9rem;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}

.ps-9B {
  padding: 10px;
}
</style>
