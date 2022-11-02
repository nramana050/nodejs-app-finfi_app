<template lang="pug">
div.ps-1A
  div.ps-1
    div.flex.flex-row.justify-between
      span
        div.font-bold.text-2xl &#8377; {{this.availableLimit}}
        div.text-xs Available balance
      span
        FaIcon.mx-auto.ps-4A(icon='comments')(@click="navToFAQ")
        div.text-xs.ps-4A1 FAQ
      span.ps-4(@click="navToProfile")
        img.object-cover.h-12.w-12.rounded-full(src="https://library.kissclipart.com/20190227/shw/kissclipart-patient-icon-png-clipart-computer-icons-ac058a2675899cf9.png")
  div(v-if="accounts.length > 0 && organization")
    AccountCard.ps-2(:accounts="accounts" :provider="organization")
  div
    div 
      P.font-bold.text-sm.ps-5 MyVirtual Card
    div
      button.ps-6(@click="navToCard")
        img.ps-6A(src="~/assets/cardimage.jpg")
    div
      div.ps-7
        div.flex.flex-row.justify-between
          span.ps-7A Order a Physical card
          FaIcon.mx-auto.ps-7B(icon='angle-right')
    div
      div.font-bold.text-sm.ps-8 Savings Plan
      ssr-carousel
        div.slide 
          div.ps-9.flex.flex-row
            div.col-1
              span
                img.ps-9A(src="~/assets/apple.jpeg")
            div.col-2
              div.font-bold.ps-9B Apple
              div.ps-9B save now for apple products
        div.slide 
          div.ps-9.flex.flex-row
            span.col-1
              img.ps-9A(src="~/assets/croma.jpg")
            span.col-2
              div.font-bold.ps-9B Croma
              div.ps-9B save now for Croma products      
        div.slide 
          div.ps-9.flex.flex-row
            span.col-1
              img.ps-9A(src="~/assets/makemytrip.png")
            span.col-2
              div.font-bold.ps-9B MakeMyTrip
              div.ps-9B save now for MakeMyTrip 
        div.slide 
          div.ps-9.flex.flex-row
            span.col-1
              img.ps-9A(src="~/assets/bluestone.png")
            span.col-2
              div.font-bold.ps-9B BlueStone
              div.ps-9B save now for BlueStone products
           
    //- div.ps-17
    //-   p(v-if="this.vciplink").text-xs.font-bold You are eligible for higher limits, Please complete 
    //-     a(:href="this.vciplink" target="_blank") Full KYC
    //- div
    //-   p.ps-3.font-bold Activity
    //- div.flex.flex-row.justify-evenly
    //-   button.ps-6.grid.text-center(v-if="this.enableFinfi" @click="navToTransferScreen")
    //-     FaIcon.mx-auto.ps-9(icon='paper-plane')
    //-     p.text-sm Transfer
    //-   button.ps-7.grid.text-center(v-if="isCardEnabled && this.enableM2P" @click="navToCard")
    //-     FaIcon.mx-auto.ps-9(icon='credit-card')
    //-     p.text-sm My Card
    //-   button.ps-8.grid.text-center(@click="navToSaveNow")
    //-     FaIcon.mx-auto.ps-9(icon='piggy-bank')
    //-     p.text-sm Save now
    //- div.ps-10(v-if="this.enableFinfi")
    //-   div(v-if="recentTransaction")
    //-     div.font-bold.text-xm.ps-12 Last Transaction 
    //-     div.flex.flex-row.justify-between
    //-       div.text-xs.ps-13 Cash Withdraw Status
    //-       div.self-center
    //-         div.text-xs.tracking-wide.inline-flex.items-center.leading-sm.font-bold.uppercase.ps-19.px-3.py-1.bg-green-200.text-green-700.rounded-full {{ recentTransaction.status }}
    //-     div.flex.flex-row.justify-between
    //-       div.text-xm.ps-15 &#8377; {{ parseFloat(recentTransaction.requested_amount).toLocaleString() }}
    //-       div(@click="navToTransaction")
    //-         button.text-xs.underline.ps-16 View All
    //-   div(v-else)
    //-     div.ps-18 No Cash Request found
      
</template>

<script>
export default {
  name: 'DashboardPage',
  layout: 'session',

  data() {
    return {
      user: this.$auth.user,
      accounts: [],
      requestedAmount: null,
      recentTransaction: null,
      inProgress: false,
      kycStatus: null,
      vciplink: null,
      availableLimit: null,
      isCardEnabled: false,
      isCardNumber:false,
      isCardLock:false,
      enableFinfi : false,
      enableM2P: false,
      categories: [],
      category_name:[],
      lock:true,
      filteredProducts:[],
      toFilter:[1,3,7,14]
    }
  },
  async fetch() {
    await this.getAccountDetails()
  },

  computed: {
    organization() {
      return this.$auth.user.organization
    },
  },
  mounted(){
    this.getCategories()
    this.getProducts()
  },
  async beforeMount() {
    const apiResult = await this.$axios.get('/organizations/config', {
      headers: {
        Authorization: this.token,
      },
    })
    this.isCardEnabled = apiResult.data.is_card_enabled
  },

  // mounted() {
  // this.kycStatus = this.$auth.user.kyc_status.kyc_status;
  // this.fetchVkyc()
  // },

  methods: {
    navToTransferScreen() {
      this.$router.push('/TransferScreen')
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
      this.$router.push('/saveNow')
    },
    navToFAQ(){
      this.$router.push('/AskedQuestions')
    },
    async getCategories() {
      const categories = await this.$axios.$get(`/snbl/category`)
      this.categories = categories.data.map(item=>
      item.category_name)
      console.log('categories',this.categories)
    },
    async getProducts() {
      const payload = { category: this.categories }
      const res = await this.$axios.$post(`/snbl/products`,payload)
      console.log('res',res)
      const productList = res.data
      console.log('products',productList)
      this.filteredProducts = productList.filter(x=>this.toFilter.includes(x.id))
      console.log(this.filteredProducts)
    },
    cardNumber(){
      if(this.isCardNumber===true){
        this.isCardNumber=false
      }
      else{
        this.isCardNumber=true
      }
    },
    lockOpen(){
      if(this.lock===true){
         this.lock=false
      }
      else{
        this.lock=true
      }
    },
    async getAccountDetails(){
      try {
        const accountresult = await this.$axios.get('/accounts')
        this.accounts = [];
        for (const item of accountresult.data){
          this.accounts.push(item.account)
        }
        const accountTypes = accountresult.data.map((x)=>x.account.account_type)
        const providerFinfi = await this.$axios.post('/ext/service-provider',{ service_provider : 'FINFI'})
        const providerM2P = await this.$axios.post('/ext/service-provider',{ service_provider : 'M2P'})
 
        const finfiAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === providerFinfi.data.filter(x=>accountTypes.includes(x))[0])  ;
        const m2pAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === providerM2P.data.filter(x=>accountTypes.includes(x))[0] ) ;

        if(finfiAccount.length>0){
          this.enableFinfi = true 
        }
        if(m2pAccount.length>0){
          this.enableM2P = true
        }

        this.availableLimit = 
          ( finfiAccount.length>0 ? finfiAccount[0].account_balance : 0
          + m2pAccount.length>0 ? m2pAccount[0].account_balance : 0 ).toLocaleString('en-IN')

        if (finfiAccount.length>0)
          await this.fetchRecentWithdrawal(finfiAccount[0].id);
        
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
.ps-1 {
  height: 30vh;
  background-color: #7165e3;
  padding-left: 2rem;
  padding-top: 2rem;
  color: white;
}
.ps-1A{
  height: 100vh;
  background-color: #F2F2F2;
}
.ps-2 {
  margin-top: -6.5rem;
  border-radius: 10px;
  height: 10rem;
  background-color: #ffffff;
  color: #1c1939;
  margin-left: 2rem;
  margin-right: 2rem;
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
.ps-4A{
  margin-left: 5rem;
  height: 30px;
}
.ps-4A1{
  margin-left: 5.5rem;
}
.ps-5{
  margin-top: 1rem;
  margin-bottom: 1rem;
  margin-left: 2rem;
  margin-right: 2rem;
}
.ps-6{
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

.ps-6A{
  height: 9rem;
  width: 100%;
}

.ps-7{
  width: 75%;
  height: 2rem;
  background-color: #ffffff;
  margin-left: 3rem;
  margin-right: 3rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
}
.ps-7A{
  padding: 5px;
}
.ps-7B{
  padding: 7px;
  margin-right: 1rem;
}
.ps-8{
  margin-left: 2rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
.ps-9{
  height: 9rem;
  width: 85%;
  background-color: #ffffff;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-bottom: 4.6rem;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 15px;
}
.ps-9A{
  height: 9rem;
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}
.ps-9B{
  padding: 10px;
}

</style>
