<template lang="pug">
div.home-comtainer.ps-1A
  div.ps-1
    div.flex.flex-row.justify-between
      span
        div.font-bold.text-2xl &#8377; {{this.availableLimit}}
        div.text-xs Available balance
      span
        button(@click="navToFAQ")
          FaIcon.mx-auto.ps-4A(icon='comments')
          div.text-xs.ps-4A1 FAQ
      span.ps-4
        button(@click="navToProfile")
          img.object-cover.h-12.w-12.rounded-full(src="https://library.kissclipart.com/20190227/shw/kissclipart-patient-icon-png-clipart-computer-icons-ac058a2675899cf9.png")
  div(v-if="accounts.length > 0 && organization")
    AccountCard.ps-2(:accounts="accounts" :provider="organization")
  div(v-if="isCardEnabled && this.enableM2P")
    div.container.corp-exp.p-5
      h3.font-bold.text-sm MyVirtual Card
    div.latest-claim.p-5
      button.card-button(@click="navToCard")
        img.ps-6A(src="~/assets/cardimage.jpg")
      button.claim-btn(v-if="this.card_type != 'PHYSICAL'" @click="navToPhysicalCard") Order a Physical card  
  div.container.corp-exp.p-5(v-if="homeProducts?.length")
    h3.font-bold.text-sm Discount On Top Brands     
  div.latest-claim.pt-10(v-if="homeProducts?.length")
      ssr-carousel(:slides-per-page=3 :loop='true' :show-arrows='true' :feather='true' :autoplay-delay='5')
        div.slide.custom-pro-slide(v-for="product in homeProducts" @click="selectProduct(product)") 
          img(:src="baseUrl+product.home_screen_image_path" crossorigin="anonymous")
  div.container.corp-exp.p-5(v-if="corpExEnabled")
    h3.font-bold.text-sm Corporate Expense    
  div.latest-claim.p-5(v-if="corpExEnabled")
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
</template>

<script>
export default {
  name: 'DashboardPage',
  layout: 'session',

  data() {
    return {
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
      isCardEnabled: false,
      isCardNumber: false,
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
  async fetch() {
    await this.getAccountDetails()
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
  },
  mounted() {
    if (this.$auth.strategy.token.status().valid()) {
      this.getHomeProducts()
    }
    console.log('CONFIG::', this.$auth)
    this.fetchClaims()
    this.fetchUserConfig()
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
    }
  },
  methods: {
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
    async fetchClaims() {
      const res = await this.$axios.$get(
        '/api/coprx/claims?sort=desc&limit=1',
        {
          headers: {
            Authorization: this.token,
          },
        }
      )
      console.log('CLAIMS', res)
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
    // async initCashRequest() {
    //   this.inProgress = true;
    //   const cashAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === 'CASH' );
    //   const availableLimit = cashAccount[0].account_balance;
    //   if (this.requestedAmount > availableLimit) {
    //     this.$toast.error(`Cash limit available: ${availableLimit}`);
    //     this.inProgress = false;
    //     return;
    //   }
    //   try {
    //     const bankResult = await this.$axios.get('/profile/banks');
    //     // eslint-disable-next-line camelcase
    //     const { ifsc_code, account_balance } = bankResult.data;
    //     // eslint-disable-next-line camelcase
    //     if (ifsc_code === '' || account_balance === '') {
    //       this.inProgress = false;
    //       this.$toasted.error('you have missing bank details. Pls update bank details in the profile menu')
    //       return;
    //     }
    //     await this.$axios.post(`/accounts/${cashAccount[0].id}/withdrawals`, {
    //       amount: this.requestedAmount
    //       });
    //     this.$toast.success('Cash request sent');
    //     this.getAccountDetails();
    //     this.fetchRecentWithdrawal();
    //     this.requestedAmount=null;
    //     this.inProgress = false;
    //   } catch (err) {
    //     this.inProgress = false;
    //     this.$toasted.error(err.response.data.message)
    //   }
    // },
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
    // async fetchVkyc(){
    //   try{
    //     if (this.kycStatus === "MIN_KYC" ){
    //       const vkycResult = await this.$axios.post('/m2p/vkyc/link');
    //       if(vkycResult.data.message==='Success' && vkycResult.data.data){
    //         this.vciplink = vkycResult.data.data.vcip_link
    //       }
    //     }
    //   }catch(err){
    //     this.$toast.error('Failed to gey kyc status')
    //   }
    // }
  },
}
</script>

<style scoped>
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
.card-button {
  width: 100%;
}
.card-button > img {
  height: 180px;
}
.latest-claim {
  background-color: #ffffff !important;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  margin: 0 20px;
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
  border-radius: 50%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  height: 85px;
  border: 1px solid #000000;
}
.custom-pro-slide > img {
  height: 55px;
  width: 60px;
}
.ps-1 {
  height: 30vh;
  background-color: #7165e3;
  padding-left: 2rem;
  padding-top: 2rem;
  color: white;
}

.ps-1A {
  background-color: #f2f2f2;
  min-height: 100vh;
}

.ps-2 {
  margin-top: -6.5rem;
  border-radius: 10px;
  height: 10rem;
  background-color: #ffffff;
  color: #1c1939;
  margin-left: 1rem;
  margin-right: 1rem;
  padding-right: 2rem;
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
  padding-bottom: 5px;
  padding-left: 25px;
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
