<template lang="pug">
div.ps-5
  //- div.flex-0
  //-   PageHeader(:title="'Dashboard'")
  div.justify-between.ps-1
    div.text-left
      div
      p.font-bold.tracking-wider.text-2xl &#8377; {{this.availableLimit}}
      p.tracking-wide.text-xs Available Balance
      div.rounded-full.mx-auto.ps-4(@click="navToProfile")
        img.object-cover.h-12.w-12.rounded-full(src="https://library.kissclipart.com/20190227/shw/kissclipart-patient-icon-png-clipart-computer-icons-ac058a2675899cf9.png")
      //- div.text-right
      //- p.font-bold.text-white {{ user.first_name }} {{ user.last_name }}
  div#dynamicheight(v-if="accounts.length > 0 && organization")
    div
      AccountCard.ps-2(:accounts="accounts" :provider="organization")
      
    div
      //- p You are eligible for higher limits, please complete Full VKYC 
      //- p.tracking-wide(v-if="this.vkycMessage==='complete' || this.vkycMessage==='continue'") You are eligible for higher limits, please {{this.vkycMessage}} Full KYC 
      //-   button.w-full.h-10.px-2.text-white.rounded.bg-primary.my-3(@click="vkyc") Complete Full KYC
      //- p.uppercase.py-4.font-bold.tracking-wider Transfer to my bank account
      //- div.relative
      //-   input.h-12.pl-5.rounded.z-0.border.border-purple-100.w-full(class="focus:shadow focus:outline-none" type="number" placeholder="Enter amount" v-model="requestedAmount")
      //-   div.absolute.top-0.right-0(v-if="requestedAmount > 0")
      //-     button.h-12.w-24.text-white.rounded.bg-purple-700.uppercase.font-bold(@click="initCashRequest")
      //-       span(v-if="inProgress")
      //-         LoadingIcon.w-6.h-6.text-white.mx-auto
      //-       span(v-else) Send
    //- div.p-4
    //-   p.uppercase.font-bold.tracking-wider.py-4 Bank Transfer Status
    //-   div.flex.flex-col.p-2.rounded-md.shadow-md.w-full.bg-gray-50
    //-     div.flex.flex-row.justify-between(v-if="recentTransaction")
    //-       div
    //-         p.text-xs {{ this.$dayjs(recentTransaction.requested_on).format('YYYY-MM-DD HH:mm:ss') }}
    //-         p.font-thin.text-lg &#8377; {{ parseFloat(recentTransaction.requested_amount).toFixed(2) }}
    //-       div.self-center
    //-         div.text-xs.tracking-wide.inline-flex.items-center.leading-sm.font-bold.uppercase.px-3.py-1.bg-green-200.text-green-700.rounded-full {{ recentTransaction.status }}
    //-     p(v-else) No cash request found. You can raise a cash request and get money in your account 
    //-kyc 
    //- div.ps-17
    //-   p(v-if="this.vciplink").text-xs.font-bold You are eligible for higher limits, Please complete 
    //-     a(:href="this.vciplink" target="_blank") Full KYC
    div
      p.ps-3.font-bold Activity
    div.flex.flex-row.justify-evenly
      button.ps-6.grid.text-center(v-if="this.enableFinfi" @click="navToTransferScreen")
        FaIcon.mx-auto.ps-9(icon='paper-plane')
        p.text-sm Transfer
      button.ps-7.grid.text-center(v-if="isCardEnabled && this.enableM2P" @click="navToCard")
        FaIcon.mx-auto.ps-9(icon='credit-card')
        p.text-sm My Card
      button.ps-8.grid.text-center(@click="navToSaveNow")
        FaIcon.mx-auto.ps-9(icon='piggy-bank')
        p.text-sm Save now
    div.ps-10(v-if="this.enableFinfi")
      div(v-if="recentTransaction")
        div.font-bold.text-xm.ps-12 Last Transaction 
        div.flex.flex-row.justify-between
          div.text-xs.ps-13 Cash Withdraw Status
          div.self-center
            div.text-xs.tracking-wide.inline-flex.items-center.leading-sm.font-bold.uppercase.ps-19.px-3.py-1.bg-green-200.text-green-700.rounded-full {{ recentTransaction.status }}
        div.flex.flex-row.justify-between
          div.text-xm.ps-15 &#8377; {{ parseFloat(recentTransaction.requested_amount).toLocaleString() }}
          div(@click="navToTransaction")
            button.text-xs.underline.ps-16 View All
      div(v-else)
        div.ps-18 No Cash Request found
      //- div.flex.flex-row.justify-evenly(v-if="recentTransaction")
      //-   div.text-xs.ps-13 Cash Withdraw Status
      //-   div.self-center
      //-     div.text-xs.tracking-wide.inline-flex.items-center.leading-sm.font-bold.uppercase.ps-19.px-3.py-1.bg-green-200.text-green-700.rounded-full {{ recentTransaction.status }} 
      //-     div.flex.flex-row.justify-between(@click="navToTransaction")
      //-       div.text-xm.ps-15 &#8377; {{ parseFloat(recentTransaction.requested_amount).toLocaleString() }}
      //-       p.text-xs.underline.ps-16 View All
      //- div.ps-18(v-else)
      //-   p No Cash Request found.
      
      //- p.ps-3.font-bold Bank Transfer Status
      //- div.flex.flex-col.ps-11.rounded-md.shadow-md
      //-   div.flex.flex-row.justify-between(v-if="recentTransaction")
      //-     div
      //-       p.text-xs {{ this.$dayjs(recentTransaction.requested_on).format('YYYY-MM-DD HH:mm:ss') }}
      //-       p.font-thin.text-lg &#8377; {{ parseFloat(recentTransaction.requested_amount).toFixed(2) }}
      //-     div.self-center
      //-       div.text-xs.tracking-wide.inline-flex.items-center.leading-sm.font-bold.uppercase.px-3.py-1.bg-green-200.text-green-700.rounded-full {{ recentTransaction.status }}
      //-   p(v-else) No cash request found. You can raise a cash request and get money in your account 
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
      enableFinfi : false,
      enableM2P: false
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
  height: 13rem;
  background-color: #7165e3;
  padding-left: 2rem;
  padding-top: 2rem;
  color: white;
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
  margin-top: -3.25rem;
  margin-left: 75%;
}
.ps-5 {
  background-color: #f2f2f2;
}
.ps-6 {
  margin-top: 1rem;
  height: 100px;
  width: 93px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 30px 60px rgba(0, 0, 0, 0.0790811);
  color: #1c1939;
  margin-left: 2rem;
  padding-top: 10px;
}
.ps-7 {
  margin-top: 1rem;
  height: 100px;
  width: 93px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 30px 60px rgba(0, 0, 0, 0.0790811);
  color: #1c1939;
  margin-left: 0.5rem;
  padding-top: 10px;
}
.ps-8 {
  margin-top: 1rem;
  height: 100px;
  width: 93px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 30px 60px rgba(0, 0, 0, 0.0790811);
  color: #1c1939;
  margin-left: 0.5rem;
  margin-right: 2rem;
  padding-top: 10px;
}
.ps-9 {
  margin-top: 0.5rem;
  background-color: #7165e3;
  color: white;
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 5px;
  padding-top: 3px;
  padding-left: 3px;
  padding-bottom: 3px;
  padding-right: 3px;
}
.ps-10 {
  margin-top: 2rem;
  margin-left: 2rem;
  margin-right: 2rem;
  border-radius: 10px;
  height: 7rem;
  width: 20rem;
  background-color: #ffffff;
  color: #1c1939;
}
.ps-12 {
  margin-left: 1rem;
  padding-top: 5px;
  padding-bottom: 5px;
}
.ps-13 {
  margin-left: 1rem;
  padding-top: 10px;
}
.ps-14 {
  padding-top: 3px;
  padding-bottom: 3px;
}
.ps-15 {
  margin-left: 1rem;
  padding-top: 5px;
}
.ps-16 {
  margin-right: 3rem;
  margin-top: 0.7rem;
  color: #7165e3;
}
.ps-17 {
  margin-top: 1rem;
  margin-left: 2rem;
  color: #1c1939;
}
.ps-18 {
  padding-top: 2rem;
  text-align: center;
}
.ps-19 {
  margin-right: 1rem;
  margin-top: 0.5rem;
}
</style>
