<template lang="pug">
div
  div.ps-1
    button(@click="navToDashboard")
      FaIcon.mx-auto.ps-7(icon='angle-left')
    div.grid.text-center
    FaIcon.w-4.h-6.mx-auto.ps-10(icon='building-columns')
    div.ps-2.text-xm.text-center Transfer to your Bank account 
    div.ps-3.text-sm.text-center A/C number-{{bank.account_number}}
    div.flex.flex-row.justify-evenly
      div.text-3xl.ps-6 &#8377;
      input.text-3xl.ps-8(class="focus:outline-none" type="numeric" v-model="requestedAmount")
    //- div
    //-   div(v-if="requestedAmount>0")
    //-     button.ps-5.font-bold.text-white(@click="initCashRequest")
    //-       span(v-if="inProgress")
    //-         LoadingIcon.w-6.h-6.text-black.mx-auto
    //-       span(v-else) Transfer
    div(v-if="requestedAmount>0")
      div.flex-0.fixed.bottom-0
        button.btn.h-8.px-4.text-white.rounded.font-bold.ps-5(@click="requestAmount")
          span Transfer &#8377; {{transferAmount}}
</template>
<script>
export default {
  name: 'TransferScreen',
  layout: 'empty',
  data() {
    return {
      user: this.$auth.user,
      accounts: [],
      requestedAmount: null,
      recentTransaction: null,
      inProgress: false,
      availableLimit: null,
      transferAmount:0,
      amount:[],
      bank: {
        ifsc_code: null,
        account_number: null,
      },
    }
  },
  // async fetch() {
  //   await this.getAccountDetails()
  // },
  async fetch() {
    const profileResult = await this.$axios.get('/profile')
    this.profile = profileResult.data
    await this.getBankAccount()
  },
   mounted(){
    this.$emit('requestAmount', this.amount)  
    const _this = this
    setInterval(function (){
      _this.transferAmount=_this.requestedAmount
    },1000)  
  },
    methods:{
      navToDashboard() {
        this.$router.push('/dashboard')
      },
      async getBankAccount() {
      try {
        const bankResult = await this.$axios.get('/profile/banks')
        if (bankResult.data) {
          this.bank = bankResult.data
        }
      } catch (err) {
        this.$toast.error('Failed to fetch profile')
      }
    },
      requestAmount(){
        this.amount=[]
        this.amount.push(this.transferAmount)
        this.$store.commit('setrequestAmount', this.transferAmount)
        this.$router.push('/confirmTransfer')
      },
    //   async getAccountDetails() {
    //   try {
    //     const accountresult = await this.$axios.get('/accounts')
    //     this.accounts = [];
    //     for (const item of accountresult.data){
    //       this.accounts.push(item.account)
    //     }
    //     const accountTypes = accountresult.data.map((x)=>x.account.account_type)
    //     const providerFinfi = await this.$axios.post('/ext/service-provider',{ service_provider : 'FINFI'})
    //     const providerM2P = await this.$axios.post('/ext/service-provider',{ service_provider : 'M2P'})
 
    //     const finfiAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === providerFinfi.data.filter(x=>accountTypes.includes(x))[0])  ;
    //     const m2pAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === providerM2P.data.filter(x=>accountTypes.includes(x))[0] ) ;
    //     console.log('f m accs',finfiAccount,m2pAccount)

    //     this.availableLimit = 
    //       ( finfiAccount.length>0 ? finfiAccount[0].account_balance : 0
    //       + m2pAccount.length>0 ? m2pAccount[0].account_balance : 0 ).toLocaleString('en-IN')

    //     if (finfiAccount.length>0)
    //       await this.fetchRecentWithdrawal(finfiAccount[0].id);

    //   } catch (err) {
    //     console.log(err)
    //     this.$toast.error('Failed to fetch accounts');
    //   }
    // },        
    async initCashRequest() {
      this.inProgress = true;
      const accountresult = await this.$axios.get('/accounts')
      this.accounts = [];
      for (const item of accountresult.data){
        this.accounts.push(item.account)
      }
      const accountTypes = accountresult.data.map((x)=>x.account.account_type)
      const providerFinfi = await this.$axios.post('/ext/service-provider',{ service_provider : 'FINFI'})
      const finfiAccount = this.accounts.filter((item) => item.account_type.toUpperCase() === providerFinfi.data.filter(x=>accountTypes.includes(x))[0])  ;
      const availableLimit = finfiAccount[0].account_balance;
      if (this.requestedAmount > availableLimit) {
        this.$toast.error(`Cash limit available: ${availableLimit}`)
        this.inProgress = false
        return
      }
      try {
        const bankResult = await this.$axios.get('/profile/banks')
        // eslint-disable-next-line camelcase
        const { ifsc_code, account_balance } = bankResult.data
        // eslint-disable-next-line camelcase
        if (ifsc_code === '' || account_balance === '') {
          this.inProgress = false
          this.$toasted.error(
            'you have missing bank details. Pls update bank details in the profile menu'
          )
          return
        }
        await this.$axios.post(`/accounts/${finfiAccount[0].id}/withdrawals`, {
          amount: this.requestedAmount 
          });
        this.$toast.success('Cash request sent');
        this.requestedAmount=null;
        this.inProgress = false;
      } catch (err) {
        this.inProgress = false
        this.$toasted.error(err.response.data.message)
      }
    },
    // async fetchRecentWithdrawal(accountId) {
    //   try {
    //     const result = await this.$axios.get(
    //       `/accounts/${accountId}/withdrawals?limit=1`
    //     )
    //     if (result.data.length > 0) {
    //       this.recentTransaction = result.data[0]
    //     }
    //   } catch (err) {
    //     this.$toasted.error(err.response.data.message)
    //   }
    // },
  },
}
</script>
<style scoped>
.ps-7 {
  color: #ffffff;
  margin-left: 2rem;
  width: 20px;
  height: 20px;
  padding-top: 1rem;
}
.ps-6 {
  margin-top: 2rem;
  margin-left: 30%;
}

.ps-1 {
  height: 100vh;
  background-color: #7165e3;
  color: #ffffff;
}
.ps-2 {
  margin-top: 2rem;
}
.ps-5 {
  color: #1C1939;
  background-color: white;
  height: 2.5rem;
  width: 20rem;
  margin-left: 2rem;
  margin-right: 2rem;
  margin-bottom: 3rem;
}
.ps-8 {
  background: none;
  border: none;
  width: 50%;
  margin-left: -2rem;
  margin-top: 2rem;
}
.ps-4{
 color: #7165e3;
}
.ps-9 {
  width: 6rem;
  height: 6rem;
  margin-left: 38%;
}
.ps-10 {
  margin-left: 44%;
  margin-top: 3rem;
  width: 2rem;
  height: 2rem;
  background-color: #ffffff;
  color: #1c1939;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 27px;
}
</style>
